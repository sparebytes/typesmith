import test from "ava";
import { getValidatableFn, Validatable } from "../dist";

@Validatable()
class Thingy {
  foo!: "bar";
}
getValidatableFn(Thingy);

test("@Validatable JSON Valid", t => {
  const assertThingy = getValidatableFn(Thingy)!;
  assertThingy({ foo: "bar" });
  t.pass();
});

test("@Validatable Instance Valid", t => {
  const assertThingy = getValidatableFn(Thingy)!;
  const thingy = new Thingy();
  thingy.foo = "bar";
  assertThingy(thingy);
  t.pass();
});

test("@Validatable JSON Invalid", t => {
  const assertThingy = getValidatableFn(Thingy)!;
  t.throws(() => assertThingy({ foo: "baz" }).unwrap());
});

test("@Validatable Instance Invalid", t => {
  const assertThingy = getValidatableFn(Thingy)!;
  const thingy = new Thingy();
  thingy.foo = "baz" as any;
  t.throws(() => assertThingy(thingy).unwrap());
});
