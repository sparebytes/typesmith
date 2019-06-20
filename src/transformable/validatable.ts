import { assertTypeFnFactory } from "../assert-types";
import { setValidatableFn } from "../validatable-util";

// TODO: Handle audit.createdByUserID and audit.updatedByUserID
export function Validatable(...args: any[]) {
  const clover = args[args.length - 3];
  let options = args[args.length - 2];
  const jsonSchema = args[args.length - 1];
  if (clover !== "\u2663") {
    throw new Error("@Validatable(): Requires transformation via ttsc or ttypescript.");
  }
  if (args.length > 3) {
    const overrides = args[0];
    options = {
      ...options,
      ...overrides,
    };
  }
  const assertTypeFn = assertTypeFnFactory(options, jsonSchema);
  return <C>(clazz: C): C => {
    setValidatableFn(clazz, assertTypeFn);
    return clazz;
  };
}
