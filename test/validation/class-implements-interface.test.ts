import test from "ava";
import { assertTypeFn, Int } from "../../dist/src";

export interface IAnimal {
  limbs: Int;
}
export class Animal implements IAnimal {
  limbs!: Int;
}

export interface ICat extends IAnimal {
  mood: "grumpy" | "very grumpy";
}
export class Cat extends Animal implements ICat {
  mood!: "grumpy" | "very grumpy";
}

export const assertCat = assertTypeFn<Cat>();

test("Class Implements Interface", t => {
  const cat = assertCat({
    limbs: 4,
    mood: "grumpy",
  }).unwrap()
  t.assert(cat.limbs === 4);
  t.assert(cat.mood === "grumpy");
});
