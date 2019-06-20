import { AssertTypeFn } from "./assert-types";

const typesmithValidatableSymbol: any =
  typeof Symbol !== "undefined" ? Symbol("typesmithValidatableSymbol") : "__typesmithValidatableSymbol__";

export function getValidatableFn(obj: any, allowInherited = false): AssertTypeFn<any> | undefined {
  const [result, source] = obj[typesmithValidatableSymbol];
  if (!allowInherited && source !== obj) {
    throw new Error("allowInherited is false but the validator appears to be inherited");
  }
  return result;
}

export function setValidatableFn(obj: any, assertTypeFn: AssertTypeFn<any>): void {
  Object.defineProperty(obj, typesmithValidatableSymbol, {
    enumerable: false,
    value: [assertTypeFn, obj],
  });
}
