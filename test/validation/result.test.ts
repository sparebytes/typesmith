import test from "ava";
import { assertTypeFn, DateString } from "../../dist";

interface Person {
  firstName: string;
  lastName: string;
  dateOfBirth: DateString;
}

const assertPerson = assertTypeFn<Person>({ allErrors: true });

const jillSmith = { firstName: "Jill", lastName: "Smith", dateOfBirth: "1990-12-31" };
const janeDoe = { firstName: "Jane", lastName: "Doe", dateOfBirth: "1990-12-31" };
const invalidPerson = {};

test("Validation Successful Result", t => {
  t.assert(assertPerson(jillSmith).isSuccess === true);
  t.assert(assertPerson(jillSmith).unwrap() === jillSmith);
  t.assert(assertPerson(jillSmith).getErrors() === null);
  t.assert(assertPerson(jillSmith).getOrElse(janeDoe) === jillSmith);
  t.assert(assertPerson(jillSmith).getOrElseL(errors => janeDoe) === jillSmith);
});

test("Validation Failure Result", t => {
  t.assert(assertPerson(invalidPerson).isSuccess === false);
  t.throws(() => assertPerson(invalidPerson).unwrap());
  t.assert(assertPerson(invalidPerson).getErrors()!.length === 3);
  t.assert(assertPerson(invalidPerson).getOrElse(janeDoe) === janeDoe);
  t.assert(assertPerson(invalidPerson).getOrElseL(errors => janeDoe) === janeDoe);
});
