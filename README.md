# typesmith

Inspired by [typescript-is](https://www.npmjs.com/package/typescript-is).

Transforms typescript interfaces, classes and other types into runtime validation functions. It leverages these fine libraries:

- [ts-json-schema-generator](https://www.npmjs.com/package/ts-json-schema-generator) - Generate JSON Schema from Typescript AST
- [ajv](https://www.npmjs.com/package/ajv) - Validates an object against JSON Schema
- [ajv-keywords](ajv-keywords) - Additional validation capabilities via custom JSON Schema keywords


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
  /** @minLength 1 */
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

## 🎛 Options

- **allErrors**: *(default: true)* returns all errors instead of returning only the first one
- **removeAdditional**: *(default: false)* remove additional properties
- **useDefaults**: *(default: false)* replace missing or undefined properties and items with the values from corresponding default keywords
- **coerceTypes**: *(default: false)* change data type of data to match type keyword
- **lazyCompile**: *(default: true)* wait to compile validation function until first use


Options are specifiable at the global and type level, EG:
```ts
import { assertTypeFn, settings, Validatable } from "typesmith";

// Globally:
settings.updateGlobalValidationOptions({ removeAdditional: true });

// Type-Level
assertTypeFn<{ name: string }>({ coerceTypes: true });
@Validatable({ coerceTypes: true }) class Foo {}
```


## 💣 Caveats

- Recursive generic types cannot be inlined. EG, use `type NumberBTree = BTree<number>; assertTypeFn<NumberBTree>();` instead of `assertTypeFn<BTree<number>>();`
- With AJV's `coerceTypes` enabled, coerced primitives will validate but will return the original value. EG `assertTypeFn<number>("12").unwrap() === "12"` but `assertTypeFn<number>({value: "12"}).unwrap().value === 12`.
- Date objects cannot be properly validated and strings cannot be coerced to the Date type

## ✔ Todo

- feat: allow strings to be coerced to other primitives without using AJV's built-in coercion since it is too lenient. EG, `false` shouldn't be coerced to `0`
- docs: validation of date objects and strings
- feat: use [ajv-pack](https://www.npmjs.com/package/ajv-pack) for precompiled validation functions. ajv-pack has restrictions so this would need to be optional.
