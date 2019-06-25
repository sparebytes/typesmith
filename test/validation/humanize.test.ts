import test from "ava";
import { ErrorObject, humanizeErrorsToString } from "../../dist";

const errorsWithJsonNotation: ErrorObject[] = [
  {
    dataPath: ".name",
    keyword: "required",
    message: "should have required property 'first'",
    params: {
      missingProperty: "first",
    },
    schemaPath: "#/definitions/Name/required",
  },
  {
    dataPath: ".name",
    keyword: "required",
    message: "should have required property 'last'",
    params: {
      missingProperty: "last",
    },
    schemaPath: "#/definitions/Name/required",
  },
  {
    dataPath: "",
    keyword: "required",
    message: "should have required property 'address'",
    params: {
      missingProperty: "address",
    },
    schemaPath: "#/required",
  },
  {
    dataPath: ".friends[0]",
    keyword: "required",
    message: "should have required property 'name'",
    params: {
      missingProperty: "name",
    },
    schemaPath: "#/required",
  },
  {
    dataPath: ".friends[0]",
    keyword: "required",
    message: "should have required property 'address'",
    params: {
      missingProperty: "address",
    },
    schemaPath: "#/required",
  },
];

const errorsWithJsonPointers: ErrorObject[] = [
  {
    dataPath: "/name",
    keyword: "required",
    message: "should have required property 'first'",
    params: {
      missingProperty: "first",
    },
    schemaPath: "#/definitions/Name/required",
  },
  {
    dataPath: "/name",
    keyword: "required",
    message: "should have required property 'last'",
    params: {
      missingProperty: "last",
    },
    schemaPath: "#/definitions/Name/required",
  },
  {
    dataPath: "",
    keyword: "required",
    message: "should have required property 'address'",
    params: {
      missingProperty: "address",
    },
    schemaPath: "#/required",
  },
  {
    dataPath: "/friends/0",
    keyword: "required",
    message: "should have required property 'name'",
    params: {
      missingProperty: "name",
    },
    schemaPath: "#/required",
  },
  {
    dataPath: "/friends/0",
    keyword: "required",
    message: "should have required property 'address'",
    params: {
      missingProperty: "address",
    },
    schemaPath: "#/required",
  },
];

const expectedErrorString =
  "should have required property 'first'. should have required property 'last'. should have required property 'address'. should have required property 'name'. should have required property 'address'";

test("Humanize ErrorObject w/ Json Notation", t => {
  t.assert(humanizeErrorsToString(errorsWithJsonNotation) === expectedErrorString);
});

test("Humanize ErrorObject w/ Json Pointers", t => {
  t.assert(humanizeErrorsToString(errorsWithJsonPointers) === expectedErrorString);
});
