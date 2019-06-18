import { ErrorObject } from "./ajv-errors";
import NestedError = require("nested-error-stacks");

export class AssertTypeSuccess<T> {
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

export class AssertTypeFailure<T> {
  readonly tag: "failure" = "failure";
  readonly isSuccess = false;
  constructor(private errors: ErrorObject[]) {}
  unwrap(): never {
    throw new NestedError("Validation Error", this.errors as any);
  }
  map<U>(mapFn: (v: T) => U): AssertTypeSuccess<U> {
    return (this as unknown) as AssertTypeSuccess<U>;
  }
  getErrors() {
    return this.errors;
  }
  getOrElse(orElseValue: T): T {
    return orElseValue;
  }
  getOrElseL(orElseFn: (errors: ErrorObject[]) => T): T {
    return orElseFn(this.errors);
  }
}

export type AssertTypeResult<T> = AssertTypeSuccess<T> | AssertTypeFailure<T>;
