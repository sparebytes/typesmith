import test from "ava";
import { assertTypeFn } from "../../dist/src";

test("Class Methods", t => {
  class MyClass {
    data: any;
    doSomething(v: number): string {
      return "string";
    }
  }

  const assertMyClass = assertTypeFn<MyClass>();

  t.assert(assertMyClass({ data: 123 }).unwrap().data === 123);
});
