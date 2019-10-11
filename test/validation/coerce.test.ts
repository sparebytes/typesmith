import test from "ava";
import { assertTypeFn, Int } from "../../dist";

interface MyBox {
  value: Int | null;
}

test("coerceTypes: true", t => {
  const assertMyBox = assertTypeFn<MyBox>({ coerceTypes: true });

  t.assert(assertMyBox({ value: null }).unwrap().value === null);
  t.assert(assertMyBox({ value: 1 }).unwrap().value === 1);
  t.assert(assertMyBox({ value: "1" }).unwrap().value === 1);
  t.assert(assertMyBox({ value: "" }).unwrap().value === null);
  t.throws(() => assertMyBox({ value: NaN }).unwrap());
  t.throws(() => assertMyBox({ value: Infinity }).unwrap());
  t.throws(() => assertMyBox({ value: -Infinity }).unwrap());
  t.throws(() => assertMyBox({ value: 1.1 }).unwrap());
  t.throws(() => assertMyBox({ value: "1.1" }).unwrap());
});

test("coerceTypes: false", t => {
  const assertMyBox = assertTypeFn<MyBox>({ coerceTypes: false });

  t.assert(assertMyBox({ value: null }).unwrap().value === null);
  t.assert(assertMyBox({ value: 1 }).unwrap().value === 1);
  t.throws(() => assertMyBox({ value: "1" }).unwrap());
  t.throws(() => assertMyBox({ value: "" }).unwrap());
  t.throws(() => assertMyBox({ value: NaN }).unwrap());
  t.throws(() => assertMyBox({ value: Infinity }).unwrap());
  t.throws(() => assertMyBox({ value: -Infinity }).unwrap());
  t.throws(() => assertMyBox({ value: 1.1 }).unwrap());
  t.throws(() => assertMyBox({ value: "1.1" }).unwrap());
});
