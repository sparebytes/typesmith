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
       "transform": "typesmith/transformer",
       "options": {
         "coerceTypes": false
       }
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

// Valid Object
const person = { firstName: "Jill", lastName: "Smith", dateOfBirth: "1990-12-31" };
assertPerson(person).unwrap();
//# { firstName: "Jill", lastName: "Smith", dateOfBirth: "1990-12-31" }
assertPerson(person).getErrors();
//# null
assertPerson(person).getOrElse("else");
//# { firstName: "Jill", lastName: "Smith", dateOfBirth: "1990-12-31" }
assertPerson(person).getOrElseL(errors => "else");
//# { firstName: "Jill", lastName: "Smith", dateOfBirth: "1990-12-31" }

// Invalid Object
const invalidPerson = {};
assertPerson(invalidPerson).unwrap();
// throws error
assertPerson(invalidPerson).getErrors();
// [...]
assertPerson(invalidPerson).getOrElse("else");
// "else"
assertPerson(invalidPerson).getOrElseL(errors => "else");
// "else"
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
