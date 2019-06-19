import test from "ava";
import { assertTypeFn } from "../dist";

export class Name {
  first!: string;
  last!: string;
  middle?: string | null;
  title?: string | null;
  suffix?: string | null;
}

export class Address {
  street!: string;
  city!: string;
  state!: string;
  zip!: string;
}

export class Person {
  name!: Name;
  address?: Address | null
}

export const assertPerson = assertTypeFn<Person>();

test("Class Type Json Valid", t => {
  const person = {
    name: {
      first: "Jill",
      last: "Smith",
    }
  };
  assertPerson(person).unwrap();
  t.pass();
});

test("Class Type Json Invalid", t => {
  const person = {};
  t.throws(() => assertPerson(person).unwrap());
});

test("Class Type Instance Valid", t => {
  const name = new Name();
  name.first = "Jill";
  name.last = "Smith";
  const person = new Person();
  person.name = name;
  assertPerson(person).unwrap();
  t.pass();
});

test("Class Type Instance Invalid", t => {
  const person = new Person();
  t.throws(() => assertPerson(person).unwrap());
});
