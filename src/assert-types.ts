import { ErrorObject } from "./ajv-errors";
import { TypesmithValidationError } from "./typesmith-errors";

export interface AssertTypeOptions {
  /**
   * check all rules collecting all errors.
   */
  allErrors?: boolean;

  /**
   * remove additional properties - see example in Filtering data. This option is not used if schema is added with addMetaSchema method.
   * Option values:
   * - false (default) - not to remove additional properties
   * - "all" - all additional properties are removed, regardless of additionalProperties keyword in schema (and no validation is made for them).
   * - true - only additional properties with additionalProperties keyword equal to false are removed.
   * - "failing" - additional properties that fail schema validation will be removed (where additionalProperties keyword is false or schema).
   */
  removeAdditional?: boolean | "all" | "failing";

  /**
   * replace missing or undefined properties and items with the values from corresponding default keywords. Default behaviour is to ignore default keywords. This option is not used if schema is added with addMetaSchema method. See examples in Assigning defaults.
   * Option values:
   * - false (default) - do not use defaults
   * - true - insert defaults by value (object literal is used).
   * - "empty" - in addition to missing or undefined, use defaults for properties and items that are equal to null or "" (an empty string).
   * - "shared" (deprecated) - insert defaults by reference. If the default is an object, it will be shared by all instances of validated data. If you modify the inserted default in the validated data, it will be modified in the schema as well.
   */
  useDefaults?: boolean | "empty" | "shared";

  /**
   * change data type of data to match type keyword. See the example in Coercing data types and coercion rules.
   * Option values:
   * - false (default) - no type coercion.
   * - true - coerce scalar data types.
   * - "array" - in addition to coercions between scalar types, coerce scalar data to an array with one element and vice versa (as required by the schema).
   */
  coerceTypes?: boolean | "array";

  /**
   * should the validation function be compiled lazily
   * Option values:
   * - false - compile the validation function ASAP
   * - true (default) - compile the validation function the first time it is used
   */
  lazyCompile?: boolean;
}

export interface AssertTypeResult<T> {
  readonly tag: "success" | "failure";
  readonly isSuccess: boolean;
  unwrap(): T;
  map<U>(mapFn: (v: T) => U): AssertTypeResult<U>;
  getErrors(): null | ErrorObject[];
  getOrElse(orElseValue: T): T;
  getOrElseL(orElseFn: (errors: ErrorObject[]) => T): T;
}

export class AssertTypeSuccess<T> implements AssertTypeResult<T> {
  readonly tag: "success" = "success";
  readonly isSuccess = true;
  constructor(private value: T) {}
  unwrap(): T {
    return this.value;
  }
  map<U>(mapFn: (v: T) => U): AssertTypeSuccess<U> {
    return new AssertTypeSuccess(mapFn(this.value));
  }
  getErrors(): null {
    return null;
  }
  getOrElse(orElseValue: T): T {
    return this.value;
  }
  getOrElseL(orElseFn: (errors: ErrorObject[]) => T): T {
    return this.value;
  }
}

export class AssertTypeFailure<T> implements AssertTypeResult<T> {
  readonly tag: "failure" = "failure";
  readonly isSuccess = false;
  constructor(private errors: ErrorObject[]) {}
  unwrap(): never {
    throw new TypesmithValidationError("Validation Error", this.errors as any);
  }
  map<U>(mapFn: (v: T) => U): AssertTypeFailure<U> {
    return (this as unknown) as AssertTypeFailure<U>;
  }
  getErrors(): ErrorObject[] {
    return this.errors;
  }
  getOrElse(orElseValue: T): T {
    return orElseValue;
  }
  getOrElseL(orElseFn: (errors: ErrorObject[]) => T): T {
    return orElseFn(this.errors);
  }
}

// export type AssertTypeResult<T> = AssertTypeSuccess<T> | AssertTypeFailure<T>;

export type AssertTypeFn<T> = (object: any) => AssertTypeResult<T>;
