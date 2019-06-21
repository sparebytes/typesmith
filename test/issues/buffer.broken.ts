import test from "ava";
import { assertTypeFn } from "../../dist";

export class DataBox {
  data?: string | Buffer;
}

/**
 * This will not tranform due to the `data: Buffer` property.
 */
export const assertDataBox = assertTypeFn<DataBox>();

test("ISSUE: Buffer", t => {
  t.assert(assertDataBox({ data: null }).unwrap().data === null);
  t.assert(assertDataBox({ data: "a" }).unwrap().data === "a");
  t.assert(
    assertDataBox({ data: Buffer.from("b") })
      .unwrap()
      .data!.toString() === "b",
  );
  t.throws(() => assertDataBox({ data: 1 }).unwrap());
  t.throws(() => assertDataBox({ data: {} }).unwrap());
});
