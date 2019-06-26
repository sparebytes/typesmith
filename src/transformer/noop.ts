import * as ts from "typescript";
import { createNoopSchemaOfNode } from "./create-json-schema-of-node";
import createTransformer from "./transformer";
import { MakeVisitorContextTsOptions } from "./visitor-context";

export function createNoopTransformer(
  program: ts.Program,
  options?: MakeVisitorContextTsOptions,
): ts.TransformerFactory<ts.SourceFile> {
  return createTransformer(program, {
    ...options,
    createJsonSchemaOfNode: createNoopSchemaOfNode,
  });
}

export default createNoopTransformer;
