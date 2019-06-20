import test from "ava";
import { assertTypeFn } from "../dist";

export class Person<T> {
  name!: string;
  jobData?: T;
}
export const assertPerson = assertTypeFn<Person<any>>();

export interface ContractorData {
  certified: boolean;
  services: string[];
}

export class Contractor extends Person<ContractorData> {}

export const assertContractor = assertTypeFn<Contractor>();

test("Generic Inheritance Valid", t => {
  const json = {
    name: "Joe",
    jobData: {
      certified: true,
      services: ["repairs", "maintenance", "improvements", "remodels"],
    },
  };

  t.assert(assertContractor(json).unwrap().jobData!.certified);
});

test("Generic Inheritance Invalid", t => {
  const json = {
    name: "Joe",
    jobData: {},
  };

  t.throws(() => assertContractor(json).unwrap());
});
