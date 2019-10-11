import test from "ava";
import { assertTypeFn } from "../../dist";

interface Dog {
  kind?: "dog";
  hasBone?: boolean;
}
interface Cat {
  kind?: "cat";
  hasYarn?: boolean;
}
type Pet = Dog | Cat;

test("union", t => {
  const assertPet = assertTypeFn<Pet>();

  t.notThrows(() => assertPet({}).unwrap());
  t.notThrows(() => assertPet({ kind: "dog" }).unwrap());
  t.notThrows(() => assertPet({ kind: "cat" }).unwrap());
  t.notThrows(() => assertPet({ hasBone: true }).unwrap());
  t.notThrows(() => assertPet({ hasYarn: true }).unwrap());
  t.throws(() => assertPet({ kind: "dog", hasYarn: true }).unwrap());
  t.throws(() => assertPet({ kind: "cat", hasBone: true }).unwrap());
  t.throws(() => assertPet({ kind: "wolf" }).unwrap());
  t.throws(() => assertPet({ hasBone: true, hasYarn: true }).unwrap());
});
