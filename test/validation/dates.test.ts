import test from "ava";
import { assertTypeFn, DateInstance, DateTimeFlex, DateTimeString } from "../../dist";
import { Box } from "../example-types/box";

const dateObject = new Date();
const dateString = "2019-01-01T00:00:00Z";

test("Date", t => {
  const assertDate = assertTypeFn<Date>();
  const assertDateBox = assertTypeFn<Box<Date>>();

  t.assert(assertDate(dateObject).unwrap() == dateObject);
  t.assert(assertDateBox({ content: dateObject }).unwrap().content == dateObject);

  t.throws(() => assertDate(dateString).unwrap());
  t.throws(() => assertDateBox({ content: dateString }).unwrap());
});

test("DateInstance", t => {
  const assertDateInstance = assertTypeFn<DateInstance>();
  const assertDateInstanceBox = assertTypeFn<Box<DateInstance>>();

  t.assert(assertDateInstance(dateObject).unwrap() == dateObject);
  t.assert(assertDateInstanceBox({ content: dateObject }).unwrap().content == dateObject);

  t.throws(() => assertDateInstance(dateString).unwrap());
  t.throws(() => assertDateInstanceBox({ content: dateString }).unwrap());
});

test("DateTimeString", t => {
  const assertDateTimeString = assertTypeFn<DateTimeString>();
  const assertDateTimeStringBox = assertTypeFn<Box<DateTimeString>>();

  t.assert(assertDateTimeString(dateString).unwrap() == dateString);
  t.assert(assertDateTimeStringBox({ content: dateString }).unwrap().content == dateString);

  t.throws(() => assertDateTimeString(dateObject).unwrap());
  t.throws(() => assertDateTimeStringBox({ content: dateObject }).unwrap());
});

test("DateTimeFlex", t => {
  const assertDateTimeFlex = assertTypeFn<DateTimeFlex>();
  const assertDateTimeFlexBox = assertTypeFn<Box<DateTimeFlex>>();

  t.assert(assertDateTimeFlex(dateObject).unwrap() == dateObject);
  t.assert(assertDateTimeFlexBox({ content: dateObject }).unwrap().content == dateObject);

  t.assert(assertDateTimeFlex(dateString).unwrap() == dateString);
  t.assert(assertDateTimeFlexBox({ content: dateString }).unwrap().content == dateString);

  t.throws(() => assertDateTimeFlex("").unwrap());
  t.throws(() => assertDateTimeFlexBox({ content: "" }).unwrap());
});
