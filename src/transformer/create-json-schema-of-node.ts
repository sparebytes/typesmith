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
  const schema = { $schema: "http://json-schema.org/draft-07/schema#", ...rootTypeDefinition, definitions };
  normalizeSchemaRoot(schema);
  return schema;
}

export function createNoopSchemaOfNode(schemaGenerator: SchemaGenerator, rootNode: ts.Node) {}

/**
 * Mutates the schema into a more consistent structure
 *
 * Rules:
 * - Prefer `{type: "null"}` to appear first in anyOf arrays.
 */
function normalizeSchemaRoot(schema: any): void {
  if (typeof schema === "object") {
    _normalizeSchemaChild(schema);
    const definitions = schema.definitions;
    if (definitions != null) {
      for (const k in definitions) {
        _normalizeSchemaChild(definitions[k]);
      }
    }
  }
}

function _normalizeSchemaChild(schema: any): void {
  if (typeof schema === "object") {
    const properties = schema.properties;
    for (const propertyName in properties) {
      const property = properties[propertyName];
      if (typeof property === "object") {
        const anyOf: any[] = property.anyOf;
        if (typeof anyOf === "object") {
          const anyOfNullIndex = anyOf.findIndex(s => s != null && s.type === "null");
          if (anyOfNullIndex > 0) {
            const anyOfNull = anyOf[anyOfNullIndex];
            for (let i = anyOfNullIndex; i > -1; i--) {
              anyOf[i] = anyOf[i - 1];
            }
            anyOf[0] = anyOfNull;
          }
        }
      }
    }
  }
}
