# typesmith

Inspired by [typescript-is](https://www.npmjs.com/package/typescript-is).

Transforms typescript interfaces, classes and other types into runtime validation functions. It leverages these fine libraries:

- [ts-json-schema-generator](https://www.npmjs.com/package/ts-json-schema-generator) - Generate JSON Schema from Typescript AST
- [ajv](https://www.npmjs.com/package/ajv) - Validates an object against JSON Schema

## 💿 Quick Start Guide

1. Install typesmith

   ```bash
   npm i --save typesmith
   ```

2. Install ttypescript

   ```bash
   npm i --save-dev ttypescript
   ```

3. Edit your tsconfig.json to use the plugin

   ```json
   {
     "compilerOptions": {
       "plugins": [{ "transform": "./dist/transformer/index.js" }]
     }
   }
   ```

4. Replace `tsc ...` commands with `ttsc ...` commands.

## 📐 Example

```ts
import { assertTypeFn, DateString } from "typesmith";

interface Person {
  firstName: string;
  lastName: string;
  dateOfBirth: DateString;
}

const assertPerson = assertTypeFn<Person>();

const jillSmith = { firstName: "Jill", lastName: "Smith", dateOfBirth: "1990-12-31" };
const janeDoe = { firstName: "Jane", lastName: "Doe", dateOfBirth: "1990-12-31" };
const invalidPerson = {};

// Validation Successful Result
assertPerson(jillSmith).isSuccess === true;
assertPerson(jillSmith).unwrap() === jillSmith;
assertPerson(jillSmith).getErrors() === null;
assertPerson(jillSmith).getOrElse(janeDoe) === jillSmith;
assertPerson(jillSmith).getOrElseL(errors => janeDoe) === jillSmith;

// Validation Failure Result
assertPerson(invalidPerson).isSuccess === false;
assertPerson(invalidPerson).unwrap(); // Throws Error
assertPerson(invalidPerson).getErrors().length > 0;
assertPerson(invalidPerson).getOrElse(janeDoe) === janeDoe;
assertPerson(invalidPerson).getOrElseL(errors => janeDoe) === janeDoe;
```

## 💣 Caveats

- Recursive generic types cannot be inlined. EG, use `type NumberBTree = BTree<number>; assertTypeFn<NumberBTree>();` instead of `assertTypeFn<BTree<number>>();`
- With AJV's `coerceTypes` enabled, coerced primitives will validate but will return the original value. EG `assertTypeFn<number>("12").unwrap() === "12"` but `assertTypeFn<number>({value: "12"}).unwrap().value === 12`.
- Date objects cannot be properly validated and strings cannot be coerced to the Date type

## ✔ Todo

- feat: allow validation options to be overridden
- feat: allow strings to be coerced to other primitives without using AJV's built-in coercion since it is too lenient. EG, `false` shouldn't be coerced to `0`
- feat: validation of date objects
  - Use [ajv-keywords](ajv-keywords) to accomplish this. `ts-json-schema-generator` may need to be modified to emit the appropriate keyword.
- Use [ajv-pack](https://www.npmjs.com/package/ajv-pack) for precompiled validation functions. ajv-pack has restrictions so this would need to be optional.
