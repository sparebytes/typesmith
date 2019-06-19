import test from "ava";
import { assertTypeFn } from "../../dist";
import { Box } from "../example-types/box";

const assertDate = assertTypeFn<Date>();
const assertDateBox = assertTypeFn<Box<Date>>();

test("Dates Valid", t => {
  const d = new Date();
  t.assert(assertDate(d).unwrap() == d);
  t.assert(assertDateBox({ content: d }).unwrap().content == d);
});

test("Dates Invalid", t => {
  t.throws(() => assertDate("2019-01-01T00:00:00Z").unwrap());
  t.throws(() => assertDateBox({ content: "2019-01-01T00:00:00Z" }).unwrap());
  t.throws(() => assertDate({}).unwrap());
});
