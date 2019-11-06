import test from "ava";
import { assertTypeFn } from "../../dist/src";
import { BTree } from "../example-types/b-tree";

export type NumberTree = BTree<number>;
export const assertNumberTree = assertTypeFn<NumberTree>();

test("Recursive Type Valid", t => {
  const value = {
    value: 5,
    left: {
      value: 2,
      left: {
        value: 1,
        left: null,
      },
    },
  };
  assertNumberTree(value).unwrap();
  t.pass();
});

test("Recursive Type Invalid", t => {
  const value = {
    value: 5,
    left: {
      value: 2,
      left: {
        value: {},
        left: null,
      },
    },
  };
  t.throws(() => assertNumberTree(value).unwrap());
  t.pass();
});
