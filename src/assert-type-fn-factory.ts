import * as Ajv from "ajv";
import { AssertTypeFailure, AssertTypeFn, AssertTypeOptions, AssertTypeSuccess } from "./assert-types";
import { settings } from "./settings";

export function assertTypeFnFactory<T>(options: AssertTypeOptions, jsonSchema: any): AssertTypeFn<T> {
  const ajv = new Ajv({
    ...settings.useGlobalValidationOptions(),
    ...options,
  } as Ajv.Options);
  let typeValidateFn: Ajv.ValidateFunction;

  if (options.lazyCompile === false) {
    typeValidateFn = ajv.compile(jsonSchema);
  } else {
    typeValidateFn = (...args: any[]) => {
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
