import test from "ava";
import { assertTypeFn } from "../index";

test("Simple String", t => {
  const assertString = assertTypeFn<string>();

  // Valid
  t.assert(assertString("Correct" as any).getOrElse("Incorrect") === "Correct");
  
  // Coerced
  t.assert(assertString(false as any).getOrElse("Incorrect") === false as any);
  t.assert(assertString(-1 as any).getOrElse("Incorrect") === -1 as any);

  // Invalid
  t.assert(assertString(/test/ as any).getOrElse("Incorrect") === "Incorrect");
  t.assert(assertString({} as any).getOrElse("Incorrect") === "Incorrect");
  t.assert(assertString([] as any).getOrElse("Incorrect") === "Incorrect");
});

test("Simple Number", t => {
  const assertNumber = assertTypeFn<number>();

  // Valid
  t.assert(assertNumber(1337 as any).getOrElse(-1) === 1337);
  t.assert(assertNumber(1337.1 as any).getOrElse(-1) === 1337.1);

  // Coerced
  t.assert(assertNumber(false as any).getOrElse(-1) === false as any);
  t.assert(assertNumber("1337" as any).getOrElse(-1) === "1337" as any);

  // Invalid
  t.assert(assertNumber("Incorrect" as any).getOrElse(-1) === -1);
  t.assert(assertNumber(/test/ as any).getOrElse(-1) === -1);
  t.assert(assertNumber({} as any).getOrElse(-1) === -1);
  t.assert(assertNumber([] as any).getOrElse(-1) === -1);
});

test("Simple Integer", t => {
  /** @type integer */
  type int = number;
  const assertNumber = assertTypeFn<int>();

  // Valid
  t.assert(assertNumber(1337 as any).getOrElse(-1) === 1337);

  // Coerced
  t.assert(assertNumber(false as any).getOrElse(-1) === false as any);
  t.assert(assertNumber("1337" as any).getOrElse(-1) === "1337" as any);
  t.assert(assertNumber(1337.1 as any).getOrElse(-1) === 1337.1);
  
  // Invalid
  t.assert(assertNumber("Incorrect" as any).getOrElse(-1) === -1);
  t.assert(assertNumber(/test/ as any).getOrElse(-1) === -1);
  t.assert(assertNumber({} as any).getOrElse(-1) === -1);
  t.assert(assertNumber([] as any).getOrElse(-1) === -1);
});

test("Simple Boolean", t => {
  const assertBoolean = assertTypeFn<boolean>();

  // Valid
  t.assert(assertBoolean(true as any).getOrElse(false) === true);

  // Coerced
  t.assert(assertBoolean("true" as any).getOrElse(false) === "true" as any);

  // Invalid
  t.assert(assertBoolean(1337 as any).getOrElse(false) === false);
  t.assert(assertBoolean("Incorrect" as any).getOrElse(false) === false);
  t.assert(assertBoolean(/test/ as any).getOrElse(false) === false);
  t.assert(assertBoolean({} as any).getOrElse(false) === false);
  t.assert(assertBoolean([] as any).getOrElse(false) === false);
});


test("Simple DateTime String", t => {
  /** @format date-time */
  type dateTimeString = string;
  const assertDateTimeString = assertTypeFn<dateTimeString>();
  const date = new Date("2019-01-01T00:00:00Z");

  // Valid
  t.assert(assertDateTimeString("2019-01-01T00:00:00Z" as any).getOrElse("Incorrect") === "2019-01-01T00:00:00Z");

  // Invalid
  t.assert(assertDateTimeString(date as any).getOrElse("Incorrect") === "Incorrect");
  t.assert(assertDateTimeString(true as any).getOrElse("Incorrect") === "Incorrect");
  t.assert(assertDateTimeString(1337 as any).getOrElse("Incorrect") === "Incorrect");
  t.assert(assertDateTimeString("Incorrect" as any).getOrElse("Incorrect") === "Incorrect");
  t.assert(assertDateTimeString(/test/ as any).getOrElse("Incorrect") === "Incorrect");
  t.assert(assertDateTimeString({} as any).getOrElse("Incorrect") === "Incorrect");
  t.assert(assertDateTimeString([] as any).getOrElse("Incorrect") === "Incorrect");
});
