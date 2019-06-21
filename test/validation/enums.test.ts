import test from "ava";
import { assertTypeFn } from "../../dist";

enum Foo {
  bar,
  baz,
  biz,
}

const assertFoo = assertTypeFn<Foo>();

test("Enums Valid", t => {
  t.assert(assertFoo(Foo.bar).unwrap() === Foo.bar);
  t.assert(assertFoo(Foo.baz).unwrap() === Foo.baz);
  t.assert(assertFoo(Foo.biz).unwrap() === Foo.biz);
});

test("Enums Invalid", t => {
  t.throws(() => assertFoo(-1).unwrap());
});
