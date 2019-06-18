import { Either } from "fp-ts/lib/Either";
export interface AssertTypeOptions {
  /**
   * remove additional properties - see example in Filtering data. This option is not used if schema is added with addMetaSchema method.
   * Option values:
   * - false (default) - not to remove additional properties
   * - "all" - all additional properties are removed, regardless of additionalProperties keyword in schema (and no validation is made for them).
   * - true - only additional properties with additionalProperties keyword equal to false are removed.
   * - "failing" - additional properties that fail schema validation will be removed (where additionalProperties keyword is false or schema).
   */
  removeAdditional: boolean | "all" | "failing";

  /**
   * replace missing or undefined properties and items with the values from corresponding default keywords. Default behaviour is to ignore default keywords. This option is not used if schema is added with addMetaSchema method. See examples in Assigning defaults.
   * Option values:
   * - false (default) - do not use defaults
   * - true - insert defaults by value (object literal is used).
   * - "empty" - in addition to missing or undefined, use defaults for properties and items that are equal to null or "" (an empty string).
   * - "shared" (deprecated) - insert defaults by reference. If the default is an object, it will be shared by all instances of validated data. If you modify the inserted default in the validated data, it will be modified in the schema as well.
   */
  useDefaults: boolean | "empty" | "shared";

  /**
   * change data type of data to match type keyword. See the example in Coercing data types and coercion rules.
   * Option values:
   * - false (default) - no type coercion.
   * - true - coerce scalar data types.
   * - "array" - in addition to coercions between scalar types, coerce scalar data to an array with one element and vice versa (as required by the schema).
   */
  coerceTypes: boolean | "array";
}
export function assertTypeFn<T>(assertTypeOptions?: Partial<AssertTypeOptions>): (object: any) => Either<Error, T>;
