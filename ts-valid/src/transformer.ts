import * as path from "path";
import { Config, Context, createFormatter, createParser, SchemaGenerator } from "ts-json-schema-generator";
import * as ts from "typescript";
import { AssertTypeOptions } from "../index";
import { jsonToLiteralExpression } from "./json-to-literal-expression";
import NestedError = require("nested-error-stacks");

export type PartialVisitorContext = {
  program: ts.Program;
  schemaGenerator: SchemaGenerator;
  checker: ts.TypeChecker;
  defaultValidationOptions: AssertTypeOptions;
};

const baseDefaultValidationOptions: AssertTypeOptions = {
  removeAdditional: false,
  useDefaults: false,
  coerceTypes: false,
};

export function getVisitorContext(program: ts.Program, options?: { [Key: string]: unknown }) {
  const schemGeneratorConfig: Config = {
    expose: "all", // "all" | "none" | "export";
    topRef: false,
    jsDoc: "extended", // "none" | "extended" | "basic";
    sortProps: true,
    strictTuples: true,
    skipTypeCheck: false,
    // extraJsonTags?: string[];
    path: "",
    type: "",
  };
  const schemGeneratorNodeParser = createParser(program, schemGeneratorConfig);
  const schemGeneratorTypeFormatter = createFormatter(schemGeneratorConfig);
  const schemaGenerator = new SchemaGenerator(program, schemGeneratorNodeParser, schemGeneratorTypeFormatter);

  const o = ((options && options.options) || {}) as Partial<AssertTypeOptions>;

  const visitorContext: PartialVisitorContext = {
    program,
    checker: program.getTypeChecker(),
    schemaGenerator: schemaGenerator,
    defaultValidationOptions: {
      removeAdditional: "removeAdditional" in o ? o.removeAdditional : baseDefaultValidationOptions.removeAdditional,
      useDefaults: "useDefaults" in o ? o.useDefaults : baseDefaultValidationOptions.useDefaults,
      coerceTypes: "coerceTypes" in o ? o.coerceTypes : baseDefaultValidationOptions.coerceTypes,
    } as AssertTypeOptions,
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

export function transformNode(node: ts.Node, visitorContext: PartialVisitorContext): ts.Node {
  if (ts.isCallExpression(node)) {
    const signature = visitorContext.checker.getResolvedSignature(node);
    if (
      signature !== undefined &&
      signature.declaration !== undefined &&
      path.resolve(signature.declaration.getSourceFile().fileName) === path.resolve(path.join(__dirname, "..", "index.d.ts")) &&
      node.typeArguments !== undefined &&
      node.typeArguments.length === 1
    ) {
      const typeArgument = node.typeArguments[0];
      const typeNodeJsonSchema = createJsonSchemaOfNode(visitorContext.schemaGenerator, typeArgument);

      return ts.updateCall(node, node.expression, node.typeArguments, [
        ...node.arguments,
        ts.createStringLiteral("\u2663"),
        jsonToLiteralExpression(visitorContext.defaultValidationOptions),
        jsonToLiteralExpression(typeNodeJsonSchema),
      ]);

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
