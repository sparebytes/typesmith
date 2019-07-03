import test from "ava";
import { assertTypeFn, Int } from "../../dist";

test("Coerce", t => {
  interface MyBox {
    value?: Int | null;
  }
  const assertMyBox = assertTypeFn<MyBox>({ coerceTypes: true });

  t.assert(assertMyBox({ value: null }).unwrap().value === null);
});
