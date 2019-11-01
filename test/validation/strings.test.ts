import test from "ava";
import { assertTypeFn } from "../../dist";

export interface Foo {
  /** @minLength 5 */
  minLength?: string;

  /** @maxLength 10 */
  maxLength?: string;

  /** @minLength 5 */
  /** @maxLength 10 */
  minMaxLength?: string;
}

const assertFoo = assertTypeFn<Foo>();

test("Strings Valid", t => {
  const foos = [
    { minLength: "12345" },
    { maxLength: "" },
    { maxLength: "1234567890" },
    { minMaxLength: "1234567" },
  ];
  t.plan(foos.length);
  for (const foo of foos) {
    const coerced = { ...foo };
    try {
      assertFoo(coerced).unwrap();
    } catch (ex) {
      t.log("Value should have passed.", { Original: foo, Coerced: coerced });
      throw ex;
    }
    t.pass();
  }
});

test("Strings Invalid", t => {
  const foos = [
    { minLength: "" },
    { minLength: "1" },
    { maxLength: "12345678901" },
    { minMaxLength: "" },
    { minMaxLength: "1" },
    { minMaxLength: "12345678901" },
  ];
  t.plan(foos.length);
  for (const foo of foos) {
    try {
      const coerced = { ...foo };
      assertFoo(coerced).unwrap();
      t.log("Value should have failed.", { Original: foo, Coerced: coerced });
      t.fail();
    } catch (ex) {
      t.pass();
    }
  }
});
