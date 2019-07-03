import test from "ava";
import { assertTypeFn } from "../../dist";

test("NOOP: Everything validates under NOOP Transform", t => {
  interface MyBox {
    data: {
      foo: "bar";
    };
  }

  const assertMyBox = assertTypeFn<MyBox>();

  t.assert(assertMyBox({}).unwrap() != null);
  t.assert(assertMyBox({ data: 123 }).unwrap().data === (123 as any));
});
