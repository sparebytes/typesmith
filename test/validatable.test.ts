import test from "ava";
import { getValidatableFn, Validatable } from "../dist";

@Validatable()
class Thingy {
  foo!: "bar";
}
const assertThingy = getValidatableFn(Thingy)!;

test("@Validatable JSON Valid", t => {
  assertThingy({ foo: "bar" }).unwrap();
  t.pass();
});

test("@Validatable Instance Valid", t => {
  const thingy = new Thingy();
  thingy.foo = "bar";
  assertThingy(thingy).unwrap();
  t.pass();
});

test("@Validatable JSON Invalid", t => {
  t.throws(() => assertThingy({ foo: "baz" }).unwrap());
});

test("@Validatable Instance Invalid", t => {
  const thingy = new Thingy();
  thingy.foo = "baz" as any;
  t.throws(() => assertThingy(thingy).unwrap());
});
