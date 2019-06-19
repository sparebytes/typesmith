import { AssertTypeFn } from "./assert-types";

const typesmithValidatableSymbol: any =
  typeof Symbol !== "undefined" ? Symbol("typesmithValidatableSymbol") : "__typesmithValidatableSymbol__";

export function getValidatableFn(obj: any): AssertTypeFn<any> | undefined {
  const result = obj[typesmithValidatableSymbol];
  return result;
}

export function setValidatableFn(obj: any, assertTypeFn: AssertTypeFn<any>): void {
  Object.defineProperty(obj, typesmithValidatableSymbol, {
    enumerable: false,
    value: assertTypeFn,
  });
}
