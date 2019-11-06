import test from "ava";
import { assertTypeFn, TypesmithValidationError } from "../../dist/src";

test("Unwrap Error", t => {
  interface Simple {}
  const assertSimple = assertTypeFn<Simple>({ allErrors: true });
  try {
    assertSimple({ name: {} }).unwrap();
    t.fail();
  } catch (error) {
    t.assert(error instanceof TypesmithValidationError);
    t.assert(error.errors.length === 1);
  }
});
