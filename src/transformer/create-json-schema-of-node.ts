import { Context, Definition, SchemaGenerator, StringMap } from "ts-json-schema-generator";
import * as ts from "typescript";

export type CreateJsonSchemaOfNode = (schemaGenerator: SchemaGenerator, rootNode: ts.Node) => any;

export function createJsonSchemaOfNode(schemaGenerator: SchemaGenerator, rootNode: ts.Node) {
  const sg: any = schemaGenerator;
  const rootNodes = [rootNode];
  const rootTypes = rootNodes.map(rootNode => {
    return sg.nodeParser.createType(rootNode, new Context());
  });
  const rootTypeDefinition = rootTypes.length === 1 ? sg.getRootTypeDefinition(rootTypes[0]) : {};
  const definitions: StringMap<Definition> = {};
  rootTypes.forEach(rootType => sg.appendRootChildDefinitions(rootType, definitions));
  return { $schema: "http://json-schema.org/draft-07/schema#", ...rootTypeDefinition, definitions };
}

export function createNoopSchemaOfNode(schemaGenerator: SchemaGenerator, rootNode: ts.Node) {
  return {};
}
