import test from "ava";
import { assertTypeFn } from "../../dist";
import { Box } from "../example-types/box";

const INCORRECT = "_*INCORRECT*_";

const _assertBoxDeep = (t: any, assertFn: any) => (actual: any, expected: any) => {
  if (expected === INCORRECT) {
    t.deepEqual(assertFn({ content: actual }).getOrElse(INCORRECT), INCORRECT);
  } else {
    t.deepEqual(assertFn({ content: actual }).getOrElse(INCORRECT), { content: expected });
  }
};

test("Property String", t => {
  const assertString = assertTypeFn<Box<string>>();
  const _assertDeep = _assertBoxDeep(t, assertString);

  // Valid
  _assertDeep("Correct", "Correct");

  // Coerced
  _assertDeep(true, INCORRECT);
  _assertDeep(false, INCORRECT);
  _assertDeep(-1, INCORRECT);

  // Invalid
  _assertDeep(/test/, INCORRECT);
  _assertDeep({}, INCORRECT);
  _assertDeep([], INCORRECT);
});

test("Property Number", t => {
  const assertNumber = assertTypeFn<Box<number>>();
  const _assertDeep = _assertBoxDeep(t, assertNumber);

  // Valid
  _assertDeep(1337, 1337);
  _assertDeep(1337.1, 1337.1);

  // Coerced
  _assertDeep(true, INCORRECT);
  _assertDeep(false, INCORRECT);
  _assertDeep("1337", INCORRECT);

  // Invalid
  _assertDeep("Incorrect", INCORRECT);
  _assertDeep(/test/, INCORRECT);
  _assertDeep({}, INCORRECT);
  _assertDeep([], INCORRECT);
});

test("Property Integer", t => {
  /** @asType integer */
  type int = number;
  const assertNumber = assertTypeFn<Box<int>>();
  const _assertDeep = _assertBoxDeep(t, assertNumber);

  // Valid
  _assertDeep(1337, 1337);

  // Coerced
  _assertDeep(false, INCORRECT);
  _assertDeep(true, INCORRECT);
  _assertDeep("1337", INCORRECT);

  // Invalid
  _assertDeep(1337.1, INCORRECT);
  _assertDeep("Incorrect", INCORRECT);
  _assertDeep(/test/, INCORRECT);
  _assertDeep({}, INCORRECT);
  _assertDeep([], INCORRECT);
});

test("Property Boolean", t => {
  const assertBoolean = assertTypeFn<Box<boolean>>();
  const _assertDeep = _assertBoxDeep(t, assertBoolean);

  // Valid
  _assertDeep(true, true);

  // Coerced
  _assertDeep("true", INCORRECT);
  _assertDeep("false", INCORRECT);
  _assertDeep(1, INCORRECT);
  _assertDeep(0, INCORRECT);

  // Invalid
  _assertDeep(1337, INCORRECT);
  _assertDeep("Incorrect", INCORRECT);
  _assertDeep(/test/, INCORRECT);
  _assertDeep({}, INCORRECT);
  _assertDeep([], INCORRECT);
});

test("Property DateTime String", t => {
  /** @format date-time */
  type dateTimeString = string;
  const assertDateTimeString = assertTypeFn<Box<dateTimeString>>();
  const _assertDeep = _assertBoxDeep(t, assertDateTimeString);
  const date = new Date("2019-01-01T00:00:00Z");

  // Valid
  _assertDeep("2019-01-01T00:00:00Z", "2019-01-01T00:00:00Z");

  // Invalid
  _assertDeep(date, INCORRECT);
  _assertDeep(true, INCORRECT);
  _assertDeep(1337, INCORRECT);
  _assertDeep("...", INCORRECT);
  _assertDeep(/test/, INCORRECT);
  _assertDeep({}, INCORRECT);
  _assertDeep([], INCORRECT);
});
