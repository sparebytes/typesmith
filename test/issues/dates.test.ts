import test from "ava";
import { assertTypeFn, DateTimeString } from "../../dist";
import { Box } from "../example-types/box";

/**
 * @instanceOf "Date"
 */
type DateInstance = Date

type DateTimeFlex = DateTimeString | DateInstance;

const assertDate = assertTypeFn<Date>();
const assertDateBox = assertTypeFn<Box<Date>>();
const assertDateTimeFlex = assertTypeFn<DateTimeFlex>();
const assertDateTimeFlexBox = assertTypeFn<Box<DateTimeFlex>>();

test("Dates Valid", t => {
  const d1 = new Date();
  t.assert(assertDate(d1).unwrap() == d1);
  t.assert(assertDateBox({ content: d1 }).unwrap().content == d1);
  t.assert(assertDateTimeFlex(d1).unwrap() == d1);
  t.assert(assertDateTimeFlexBox({ content: d1 }).unwrap().content == d1);
  
  const d2 = "2019-01-01T00:00:00Z";
  t.assert(assertDateTimeFlex(d2).unwrap() == d2);
  t.assert(assertDateTimeFlexBox({ content: d2 }).unwrap().content == d2);
});

test("Dates Invalid", t => {
  t.throws(() => assertDate("2019-01-01T00:00:00Z").unwrap());
  t.throws(() => assertDateBox({ content: "2019-01-01T00:00:00Z" }).unwrap());
  t.throws(() => assertDate({}).unwrap());
});
