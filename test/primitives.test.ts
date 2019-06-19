import test from "ava";
import { assertTypeFn } from "../dist";

const INCORRECT: any = "_*INCORRECT*_";

test("Simple String", t => {
  const assertString = assertTypeFn<string>();

  // Valid
  t.assert(assertString("Correct" as any).getOrElse(INCORRECT) === "Correct");
  
  // Coerced
  t.assert(assertString(false as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertString(-1 as any).getOrElse(INCORRECT) === INCORRECT);

  // Invalid
  t.assert(assertString(/test/ as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertString({} as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertString([] as any).getOrElse(INCORRECT) === INCORRECT);
});

test("Simple Number", t => {
  const assertNumber = assertTypeFn<number>();

  // Valid
  t.assert(assertNumber(1337 as any).getOrElse(INCORRECT) === 1337);
  t.assert(assertNumber(1337.1 as any).getOrElse(INCORRECT) === 1337.1);

  // Coerced
  t.assert(assertNumber(false as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber("1337" as any).getOrElse(INCORRECT) === INCORRECT);

  // Invalid
  t.assert(assertNumber(INCORRECT as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber(/test/ as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber({} as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber([] as any).getOrElse(INCORRECT) === INCORRECT);
});

test("Simple Integer", t => {
  /** @asType integer */
  type int = number;
  const assertNumber = assertTypeFn<int>();

  // Valid
  t.assert(assertNumber(1337 as any).getOrElse(INCORRECT) === 1337);

  // Coerced
  t.assert(assertNumber(false as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber("1337" as any).getOrElse(INCORRECT) === INCORRECT);
  
  // Invalid
  t.assert(assertNumber(1337.1 as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber(INCORRECT as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber(/test/ as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber({} as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertNumber([] as any).getOrElse(INCORRECT) === INCORRECT);
});

test("Simple Boolean", t => {
  const assertBoolean = assertTypeFn<boolean>();

  // Valid
  t.assert(assertBoolean(true as any).getOrElse(INCORRECT) === true);

  // Coerced
  t.assert(assertBoolean("true" as any).getOrElse(INCORRECT) === INCORRECT);

  // Invalid
  t.assert(assertBoolean(1337 as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertBoolean(INCORRECT as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertBoolean(/test/ as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertBoolean({} as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertBoolean([] as any).getOrElse(INCORRECT) === INCORRECT);
});


test("Simple DateTime String", t => {
  /** @format date-time */
  type dateTimeString = string;
  const assertDateTimeString = assertTypeFn<dateTimeString>();
  const date = new Date("2019-01-01T00:00:00Z");

  // Valid
  t.assert(assertDateTimeString("2019-01-01T00:00:00Z" as any).getOrElse(INCORRECT) === "2019-01-01T00:00:00Z");

  // Invalid
  t.assert(assertDateTimeString(date as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertDateTimeString(true as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertDateTimeString(1337 as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertDateTimeString(INCORRECT as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertDateTimeString(/test/ as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertDateTimeString({} as any).getOrElse(INCORRECT) === INCORRECT);
  t.assert(assertDateTimeString([] as any).getOrElse(INCORRECT) === INCORRECT);
});
