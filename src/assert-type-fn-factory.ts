import * as Ajv from "ajv";
import ajvErrorsPlugin = require("ajv-errors");

import { AssertTypeFailure, AssertTypeFn, AssertTypeOptions, AssertTypeSuccess } from "./assert-types";
import { settings } from "./settings";

function makeAvj(options: AssertTypeOptions) {
  const ajv = new Ajv({
    ...settings.useGlobalValidationOptions(),
    ...options,
    jsonPointers: true, // jsonPointers must be true for ajv-errors
  } as Ajv.Options);
  ajvErrorsPlugin(ajv);
  return ajv;
}

export function assertTypeFnFactory<T>(options: AssertTypeOptions, jsonSchema: any): AssertTypeFn<T> {
  let typeValidateFn: Ajv.ValidateFunction;

  if (options.lazyCompile === false) {
    const ajv = makeAvj(options);
    typeValidateFn = ajv.compile(jsonSchema);
  } else {
    typeValidateFn = (...args: any[]) => {
      const ajv = makeAvj(options);
      typeValidateFn = ajv.compile(jsonSchema);
      return typeValidateFn.apply(null, args as any);
    };
    typeValidateFn.schema = jsonSchema;
  }

  return object => {
    const isValid = typeValidateFn(object);
    return isValid ? new AssertTypeSuccess<T>(object) : new AssertTypeFailure<T>(typeValidateFn.errors as Ajv.ErrorObject[]);
  };
}
