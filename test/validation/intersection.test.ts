import test from "ava";
import { assertTypeFn } from "../../dist";

interface Dog {
  hasBone: boolean;
}
interface Cat {
  hasYarn: boolean;
}
type CatDog = Dog & Cat;

test("intersection", t => {
  const assertCatDog = assertTypeFn<CatDog>();

  t.throws(() => assertCatDog({}).unwrap());
  t.throws(() => assertCatDog({ hasBone: true }).unwrap());
  t.throws(() => assertCatDog({ hasYarn: true }).unwrap());
  t.notThrows(() => assertCatDog({ hasBone: true, hasYarn: true }).unwrap());
});
