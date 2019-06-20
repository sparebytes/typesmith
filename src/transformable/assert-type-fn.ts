import { assertTypeFnFactory } from "../assert-type-fn-factory";
import { AssertTypeOptions, AssertTypeResult } from "../assert-types";

export function assertTypeFn<T>(assertTypeOptions?: AssertTypeOptions): (object: any) => AssertTypeResult<T>;
export function assertTypeFn<T>(...args: any[]): (object: any) => AssertTypeResult<T> {
  const clover = args[args.length - 3];
  let options = args[args.length - 2];
  const jsonSchema = args[args.length - 1];
  if (clover !== "\u2663") {
    throw new Error("assertTypeFn(): Requires transformation via ttsc or ttypescript.");
  }
  if (args.length > 3) {
    const overrides = args[0];
    options = {
      ...options,
      ...overrides,
    };
  }
  return assertTypeFnFactory(options, jsonSchema);
}
