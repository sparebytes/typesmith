import { assertTypeFnFactory, AssertTypeOptions, AssertTypeResult } from "../assert-types";

export function assertTypeFn<T>(assertTypeOptions?: Partial<AssertTypeOptions>): (object: any) => AssertTypeResult<T>;
export function assertTypeFn<T>(...args: any[]): (object: any) => AssertTypeResult<T> {
  const n2 = args[args.length - 3];
  const n1 = args[args.length - 2];
  const n0 = args[args.length - 1];
  if (n2 !== "\u2663") {
    throw new Error("assertTypeFn(): Requires transformation via ttsc or ttypescript.");
  }
  return assertTypeFnFactory(n1, n0);
}
