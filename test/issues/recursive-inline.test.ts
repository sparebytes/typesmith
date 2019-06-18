import test from "ava";
import { assertTypeFn } from "../../dist";
import { BTree } from "../example-types/b-tree";

// A runtime error is thrown during validation because the generated JSON Schema is invalid.
// This happend when `BTree<number>` is inlined.
export const assertNumberTree = assertTypeFn<BTree<number>>();

test("Recursive Type Inline", t => {
  const value = {
    value: "5",
    left: {
      value: "2",
      left: {
        value: "1",
        left: null,
      },
    },
  };
  assertNumberTree(value).getOrElseL(e => {
    throw e;
  });
  t.pass();
});
