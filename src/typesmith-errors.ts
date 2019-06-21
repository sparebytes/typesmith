import NestedError = require("nested-error-stacks");

export class TypesmithValidationError extends NestedError {
  constructor(message?: any, nested?: Error) {
    super(message, nested);
  }
}

export class TypesmithCompilationError extends NestedError {
  constructor(message: any, nested?: Error) {
    super(message, nested);
  }
}
