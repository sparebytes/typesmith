import test from "ava";
import { getValidatableFn, Validatable } from "../dist";

@Validatable()
class ThingyA {
  a?: "A";
}

@Validatable()
class ThingyB extends ThingyA {
  b?: "B";
}

@Validatable()
class ThingyC extends ThingyB {
  foo!: "bar";
}

const assertThingy = getValidatableFn(ThingyC)!;

test("@Validatable JSON Valid", t => {
  assertThingy({ foo: "bar" }).unwrap();
  t.pass();
});

test("@Validatable Instance Valid", t => {
  const thingy = new ThingyC();
  thingy.foo = "bar";
  assertThingy(thingy).unwrap();
  t.pass();
});

test("@Validatable JSON Invalid", t => {
  t.throws(() => assertThingy({ foo: "baz" }).unwrap());
});

test("@Validatable Instance Invalid", t => {
  const thingy = new ThingyC();
  thingy.foo = "baz" as any;
  t.throws(() => assertThingy(thingy).unwrap());
});
