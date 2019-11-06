import test from "ava";
import { assertTypeFn } from "../../dist/src";

test("Simple", t => {
  /** @errorMessage "simple error message" */
  interface Simple {}
  const assertSimple = assertTypeFn<Simple>({ allErrors: true });
  const errors = assertSimple({ name: {}, friends: [{}] }).getErrors()!;
  t.assert(errors[0].message === "simple error message");
});

test("ByProperty", t => {
  /**
   * @errorMessage {
   *     "additionalProperties": "additionalProperties error message",
   *     "properties": {
   *         "foo": "foo error message"
   *     }
   * }
   */
  interface ByProperty {
    foo: string;
  }
  const assertByProperty = assertTypeFn<ByProperty>({ allErrors: true });
  const errors = assertByProperty({ foo: 123, additional: "oops" }).getErrors()!;
  const messages = errors.map(e => e.message || "");
  t.assert(messages.includes("additionalProperties error message"));
  t.assert(messages.includes("foo error message"));
});

test("ByKeyword", t => {
  /**
   * @errorMessage {
   *     "additionalProperties": "additionalProperties error message",
   *     "required": "required error message"
   * }
   */
  interface ByKeyword {
    required: any;
    /** @errorMessage { "type": "type error message" } */
    type: string;
    /** @errorMessage "misc error message" */
    misc: { ID: number };
  }
  const assertByKeyword = assertTypeFn<ByKeyword>({ allErrors: true });

  const errors = assertByKeyword({ type: 123, misc: {}, additional: "oops" }).getErrors()!;
  const messages = errors.map(e => e.message || "");
  t.assert(messages.includes("required error message"));
  t.assert(messages.includes("additionalProperties error message"));
  t.assert(messages.includes("type error message"));
  t.assert(messages.includes("misc error message"));
});

test("ComposedTypes", t => {
  interface ParentType {
    children: ChildType[];
  }
  interface ChildType {
    children?: ChildType[];
    /** @errorMessage "name is required" */
    name: string;
  }
  const assertParentType = assertTypeFn<ParentType>({ allErrors: true });

  const errors = assertParentType({ children: [{ name: "one", children: [{ children: [] }] }] }).getErrors()!;
  const messages = errors.map(e => e.message || "");
  t.assert(messages.includes("should have required property 'name'"));
});
