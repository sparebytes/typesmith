import test from "ava";
import { performance } from "perf_hooks";
import { assertTypeFn } from "../dist";
import { BTree } from "./example-types/b-tree";

test("Speed", t => {
  type NumberTree = BTree<number>;
  const assertNumberTree = assertTypeFn<NumberTree>();

  const value = {
    value: 4,
    left: {
      value: 2,
      left: {
        value: 1,
        left: null,
        right: null,
      },
      right: {
        value: 3,
        left: null,
        right: null,
      },
    },
    right: {
      value: 5,
      left: null,
      right: null,
    },
  };

  const count = 100000;
  const start = performance.now();
  for (let i = 0; i < count; i++) {
    assertNumberTree(value).unwrap();
  }
  const end = performance.now();
  const avgTime = (end - start) / count;
  const avgTimeMax = 0.01;
  
  t.assert(avgTimeMax > avgTime, `Average time must be below ${avgTimeMax}ms but was ${avgTime}`);
});
