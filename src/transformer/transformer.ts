import * as path from "path";
import { performance } from "perf_hooks";
import * as ts from "typescript";
import { TypesmithCompilationError } from "../typesmith-errors";
import { jsonToLiteralExpression } from "./json-to-literal-expression";
import { makeVisitorContext, MakeVisitorContextTsOptions, VisitorContext } from "./visitor-context";

export function createTransformer(
  program: ts.Program,
  options?: MakeVisitorContextTsOptions,
): ts.TransformerFactory<ts.SourceFile> {
  if (options && options.verbose) {
    console.log(
      `typesmith: transforming program with ${program.getSourceFiles().length} source files; using TypeScript ${ts.version}.`,
    );
  }

  const visitorContext = makeVisitorContext(program, options);

  if (visitorContext.perfDebugger) visitorContext.perfDebugger.startEventPrinter();
  try {
    const result = (context: ts.TransformationContext) => (file: ts.SourceFile) =>
      transformNodeAndChildren(file, program, context, visitorContext);
    return result;
  } finally {
    if (visitorContext.perfDebugger) visitorContext.perfDebugger.stopEventPrinter();
  }
}

function friendlyErrorMessageAtNode(node: ts.Node): string {
  const sourceFile = node.getSourceFile();
  if (sourceFile) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
    return `Failed to transform node at: ${sourceFile.fileName}:${line + 1}:${character + 1}`;
  }
  else {
    return `Failed to transform node at: <unknown-source-file>`;
  }
}

function transformNodeAndChildren(
  node: ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
  visitorContext: VisitorContext,
): ts.SourceFile;
function transformNodeAndChildren(
  node: ts.Node,
  program: ts.Program,
  context: ts.TransformationContext,
  visitorContext: VisitorContext,
): ts.Node;
function transformNodeAndChildren(
  node: ts.Node | ts.SourceFile,
  program: ts.Program,
  context: ts.TransformationContext,
  visitorContext: VisitorContext,
): ts.Node | ts.SourceFile {
  let transformedNode: ts.Node;
  try {
    transformedNode = transformNode(node, visitorContext);
  } catch (error) {
    throw new TypesmithCompilationError(friendlyErrorMessageAtNode(node), error);
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

export function transformNode(node: ts.Node, visitorContext: VisitorContext): ts.Node {
  try {
    let start = visitorContext.perfDebugger ? performance.now() : NaN;
    if (ts.isCallExpression(node)) {
      const signature = visitorContext.checker.getResolvedSignature(node);
      const declaration = signature?.declaration;
      const declarationSourceDir = declaration && getSourceFileDir(declaration.getSourceFile());

      if (declaration != null && declarationSourceDir === visitorContext.declarationPath) {
        const name = visitorContext.checker.getTypeAtLocation(declaration).symbol.name;
        if (name === "assertTypeFn") {
          const typeArguments = node.typeArguments ?? ((node as any).original as ts.CallExpression | undefined)?.typeArguments;
          if (typeArguments !== undefined && typeArguments.length === 1) {
            const typeArgument = typeArguments[0];
            const typeNodeJsonSchema = visitorContext.createJsonSchemaOfNode(visitorContext.schemaGenerator, typeArgument);

            const result = ts.updateCall(node, node.expression, node.typeArguments, [
              ...node.arguments,
              ts.createStringLiteral("\u2663"),
              jsonToLiteralExpression(visitorContext.defaultValidationOptions),
              jsonToLiteralExpression(typeNodeJsonSchema),
            ]);
            if (visitorContext.perfDebugger) visitorContext.perfDebugger.logEvent("assertTypeFn", performance.now() - start);
            return result;
          }
          else {
            throw new Error(`assertTypeFn<T>: Expected 1 Generic Type but ${node?.typeArguments?.length ?? 0} were found.`);
          }
        } else if (name == "Validatable") {
          const decorator = node.parent;
          if (ts.isDecorator(decorator)) {
            const classDeclaration = decorator.parent;
            if (ts.isClassDeclaration(classDeclaration)) {
              const typeNodeJsonSchema = visitorContext.createJsonSchemaOfNode(visitorContext.schemaGenerator, classDeclaration);
              const result = ts.updateCall(node, node.expression, node.typeArguments, [
                ...node.arguments,
                ts.createStringLiteral("\u2663"),
                jsonToLiteralExpression(visitorContext.defaultValidationOptions),
                jsonToLiteralExpression(typeNodeJsonSchema),
              ]);
              if (visitorContext.perfDebugger) visitorContext.perfDebugger.logEvent("@Validatable", performance.now() - start);
              return result;
            }
          }

          throw new Error(`Typesmith: @Validatable() is invalid.`);
        }
        else {
          // console.error("\n\nTypesmith Compilation Error\n\n");
          // console.error(friendlyErrorMessageAtNode(node), `Unexpected call to ${name}.`);
          // console.error("\n\nTypesmith: You may wish to restart your compiler\n\n");
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
    if (visitorContext.perfDebugger) visitorContext.perfDebugger.logEvent("miss", performance.now() - start);
    return node;
  } catch (error) {
    console.error("\n\nTypesmith Compilation Error\n\n");
    console.error(friendlyErrorMessageAtNode(node), error);
    console.error("\n\nTypesmith: You may wish to restart your compiler\n\n");
    if (visitorContext.continueOnError) {
      return node;
    } else {
      throw error;
    }
  }
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

export default createTransformer;
