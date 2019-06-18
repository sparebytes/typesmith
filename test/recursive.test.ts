import test from "ava";
import { assertTypeFn } from "../dist";
import { BTree } from "./example-types/b-tree";

export type NumberTree = BTree<number>;
export const assertNumberTree = assertTypeFn<NumberTree>();

test("Recursive Type", t => {
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
