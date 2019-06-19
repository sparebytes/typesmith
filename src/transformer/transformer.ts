import * as path from "path";
import { Config, Context, createFormatter, createParser, SchemaGenerator } from "ts-json-schema-generator";
import * as ts from "typescript";
import { AssertTypeOptions } from "../assert-types";
import { jsonToLiteralExpression } from "./json-to-literal-expression";
import NestedError = require("nested-error-stacks");

const defaultExtraJsonTags = [
  "typeof",
  "instanceOf",
  "range",
  "exclusiveRange",
  "regexp",
  "formatMaximum",
  "formatMinimum",
  "formatExclusiveMaximum",
  "formatExclusiveMinimum",
  "transform",
  "uniqueItemProperties",
  "allRequired",
  "anyRequired",
  "oneRequired",
  "patternRequired",
  "prohibited",
  "deepProperties",
  "deepRequired",
  "select",
  "selectCases",
  "selectDefault",
  "dynamicDefaults",
];

export type PartialVisitorContext = {
  program: ts.Program;
  schemaGenerator: SchemaGenerator;
  checker: ts.TypeChecker;
  declarationPath: string;
  defaultValidationOptions: Partial<AssertTypeOptions>;
};

const baseSchemaGeneratorConfig: Config = {
  expose: "all", // "all" | "none" | "export";
  topRef: false,
  jsDoc: "extended", // "none" | "extended" | "basic";
  sortProps: true,
  strictTuples: true,
  skipTypeCheck: false,
  path: "",
  type: "",
};

export function getVisitorContext(program: ts.Program, options?: { [Key: string]: any }) {
  const sgOptions = ((options && options.options) || {}) as Partial<Config>;
  const extraJsonTags = Array.from(new Set([...defaultExtraJsonTags, ...(sgOptions.extraJsonTags || [])]));
  const schemGeneratorConfig: Config = {
    expose: sgOptions.expose != null ? sgOptions.expose : baseSchemaGeneratorConfig.expose,
    topRef: sgOptions.topRef != null ? sgOptions.topRef : baseSchemaGeneratorConfig.topRef,
    jsDoc: sgOptions.jsDoc != null ? sgOptions.jsDoc : baseSchemaGeneratorConfig.jsDoc,
    sortProps: sgOptions.sortProps != null ? sgOptions.sortProps : baseSchemaGeneratorConfig.sortProps,
    strictTuples: sgOptions.strictTuples != null ? sgOptions.strictTuples : baseSchemaGeneratorConfig.strictTuples,
    skipTypeCheck: sgOptions.skipTypeCheck != null ? sgOptions.skipTypeCheck : baseSchemaGeneratorConfig.skipTypeCheck,
    extraJsonTags: extraJsonTags,
    path: baseSchemaGeneratorConfig.path,
    type: baseSchemaGeneratorConfig.type,
  };
  const schemGeneratorNodeParser = createParser(program, schemGeneratorConfig);
  const schemGeneratorTypeFormatter = createFormatter(schemGeneratorConfig);
  const schemaGenerator = new SchemaGenerator(program, schemGeneratorNodeParser, schemGeneratorTypeFormatter);

  const declarationPath =
    options != null && options.options != null && typeof options.options.declarationPath === "string"
      ? options.options.declarationPath
      : path.resolve(path.join(__dirname, "..", "transformable"));

  const vOptions = ((options && options.options) || {}) as Partial<AssertTypeOptions>;
  const defaultValidationOptions: Partial<AssertTypeOptions> = {};
  if ("removeAdditional" in vOptions) defaultValidationOptions.removeAdditional = vOptions.removeAdditional;
  if ("useDefaults" in vOptions) defaultValidationOptions.useDefaults = vOptions.useDefaults;
  if ("coerceTypes" in vOptions) defaultValidationOptions.coerceTypes = vOptions.coerceTypes;
  if ("lazyCompile" in vOptions) defaultValidationOptions.lazyCompile = vOptions.lazyCompile;

  const visitorContext: PartialVisitorContext = {
    program,
    checker: program.getTypeChecker(),
    schemaGenerator: schemaGenerator,
    declarationPath: declarationPath,
    defaultValidationOptions: defaultValidationOptions,
  };

  return visitorContext;
}

export default function transformer(
  program: ts.Program,
  options?: { [Key: string]: unknown },
): ts.TransformerFactory<ts.SourceFile> {
  if (options && options.verbose) {
    console.log(
      `typescript-is: transforming program with ${program.getSourceFiles().length} source files; using TypeScript ${ts.version}.`,
    );
  }

  const visitorContext = getVisitorContext(program, options);

  return (context: ts.TransformationContext) => (file: ts.SourceFile) =>
    transformNodeAndChildren(file, program, context, visitorContext);
}

function transformNodeAndChildren(
  node: ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
  visitorContext: PartialVisitorContext,
): ts.SourceFile;
function transformNodeAndChildren(
  node: ts.Node,
  program: ts.Program,
  context: ts.TransformationContext,
  visitorContext: PartialVisitorContext,
): ts.Node;
function transformNodeAndChildren(
  node: ts.Node | ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
  visitorContext: PartialVisitorContext,
): ts.Node | ts.SourceFile {
  let transformedNode: ts.Node;
  try {
    transformedNode = transformNode(node, visitorContext);
  } catch (error) {
    const sourceFile = node.getSourceFile();
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
    throw new NestedError(`Failed to transform node at: ${sourceFile.fileName}:${line + 1}:${character + 1}`, error);
  }
  return ts.visitEachChild(
    transformedNode,
    childNode => transformNodeAndChildren(childNode, program, context, visitorContext),
    context,
  );
}

const sourceFileDirMap = new WeakMap<ts.SourceFile, string>();

function getSourceFileDir(sourceFile: ts.SourceFile): string {
  let result = sourceFileDirMap.get(sourceFile);
  if (result == null) {
    result = path.dirname(path.resolve(sourceFile.fileName));
    sourceFileDirMap.set(sourceFile, result);
  }
  return result;
}

export function transformNode(node: ts.Node, visitorContext: PartialVisitorContext): ts.Node {
  if (ts.isCallExpression(node)) {
    const signature = visitorContext.checker.getResolvedSignature(node);
    if (
      signature !== undefined &&
      signature.declaration !== undefined &&
      getSourceFileDir(signature.declaration.getSourceFile()) === visitorContext.declarationPath
    ) {
      const name = visitorContext.checker.getTypeAtLocation(signature.declaration).symbol.name;
      if (name === "assertTypeFn" && node.typeArguments !== undefined && node.typeArguments.length === 1) {
        const typeArgument = node.typeArguments[0];
        const typeNodeJsonSchema = createJsonSchemaOfNode(visitorContext.schemaGenerator, typeArgument);

        return ts.updateCall(node, node.expression, node.typeArguments, [
          ...node.arguments,
          ts.createStringLiteral("\u2663"),
          jsonToLiteralExpression(visitorContext.defaultValidationOptions),
          jsonToLiteralExpression(typeNodeJsonSchema),
        ]);
      } else if (name == "Validatable") {
        const decorator = node.parent;
        if (ts.isDecorator(decorator)) {
          const classDeclaration = decorator.parent;
          if (ts.isClassDeclaration(classDeclaration)) {
            const typeNodeJsonSchema = createJsonSchemaOfNode(visitorContext.schemaGenerator, classDeclaration);
            return ts.updateCall(node, node.expression, node.typeArguments, [
              ...node.arguments,
              ts.createStringLiteral("\u2663"),
              jsonToLiteralExpression(visitorContext.defaultValidationOptions),
              jsonToLiteralExpression(typeNodeJsonSchema),
            ]);
          }
        }

        console.warn(`Typesmith: unexpected call "${name}"`);
      }

      // import * as Ajv from "ajv";
      // var ajv = new Ajv({ sourceCode: true });
      // const pack: any = require("ajv-pack");
      // const type = visitorContext.checker.getTypeFromTypeNode(typeArgument);
      // const typeValidateFn = ajv.compile(typeNodeJsonSchema);
      // const typeValidateCode = pack(ajv, typeValidateFn);
      // console.log(JSON.stringify(typeNodeJsonSchema, undefined, 2));
      // console.log(typeValidateCode);
      // const arrowFunction = createValidationArrowFunction(typeNodeJsonSchema);
    }
  }
  return node;
}

export function createJsonSchemaOfNode(schemaGenerator: SchemaGenerator, rootNode: ts.Node) {
  const rootType = (schemaGenerator as any).nodeParser.createType(rootNode, new Context());
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: (schemaGenerator as any).getRootChildDefinitions(rootType),
    ...(schemaGenerator as any).getRootTypeDefinition(rootType),
  };
}

// export function createValidationArrowFunction(jsonSchema: any) {
//   return ts.createArrowFunction(
//     /*modifiers*/ undefined,
//     /*typeParameters*/ undefined,
//     /*parameters*/ [
//       ts.createParameter(
//         undefined,
//         undefined,
//         undefined,
//         VisitorUtils.objectIdentifier,
//         undefined,
//         ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
//       ),
//     ],
//     /*type*/ undefined,
//     /*equalsGreaterThanToken*/ undefined,
//     /*body*/ ts.createBlock([ts.createReturn(ts.createNumericLiteral("123"))]),
//   );
// }
