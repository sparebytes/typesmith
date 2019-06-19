import { assertTypeFnFactory } from "../assert-types";
import { setValidatableFn } from "../validatable-util";

// TODO: Handle audit.createdByUserID and audit.updatedByUserID
export function Validatable(...args: any[]) {
  const n2 = args[args.length - 3];
  const n1 = args[args.length - 2];
  const n0 = args[args.length - 1];
  if (n2 !== "\u2663") {
    throw new Error("@Validatable(): Requires transformation via ttsc or ttypescript.");
  }

  const assertTypeFn = assertTypeFnFactory(n1, n0);
  return <C>(clazz: C): C => {
    setValidatableFn(clazz, assertTypeFn);
    return clazz;
  };
}
