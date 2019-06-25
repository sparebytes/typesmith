import NestedError = require("nested-error-stacks");
import { ErrorObject } from "./ajv-errors";

export class TypesmithValidationError extends NestedError {
  constructor(message?: any, nested?: ErrorObject[]) {
    super(message, nested as any);
  }
}

export class TypesmithCompilationError extends NestedError {
  constructor(message: any, nested?: Error) {
    super(message, nested);
  }
}
