import test from "ava";
import { assertTypeFn } from "../../dist";

export class DataBox {
  constructor(public data: any) {}
}
export const assertDataBox = assertTypeFn<DataBox>();

test("Class Constructor Properties ", t => {
  t.throws(() => assertDataBox({}).unwrap());
  t.assert(assertDataBox({ data: "abc" }).unwrap().data === "abc");
});
