import test from "ava";
import { getValidatableFn, Validatable, assertTypeAssign } from "../dist";

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
  t.assert(assertThingy({ foo: "bar" }).unwrap().foo === "bar");
});

test("@Validatable Instance Valid", t => {
  const thingy = new ThingyC();
  thingy.foo = "bar";
  t.assert(assertThingy(thingy).unwrap().foo === "bar");
});

test("@Validatable JSON Invalid", t => {
  t.throws(() => assertThingy({ foo: "baz" }).unwrap());
});

test("@Validatable Instance Invalid", t => {
  const thingy = new ThingyC();
  thingy.foo = "baz" as any;
  t.throws(() => assertThingy(thingy).unwrap());
});

test("assertTypeAssign", t => {
  const thingy = assertTypeAssign(ThingyC, { foo: "bar" }).unwrap();
  t.assert(thingy.foo === "bar");
  t.assert(thingy instanceof ThingyC);

  t.throws(() => assertTypeAssign(ThingyC, { foo: "baz" }).unwrap());
});
