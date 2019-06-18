# typesmith

Inspired by [typescript-is](https://www.npmjs.com/package/typescript-is).

Typescript transformer to generate runtime validation functions. It leverages these fine libraries:

* [x] [ts-json-schema-generator](https://www.npmjs.com/package/ts-json-schema-generator) - Generate JSON Schema from Typescript AST
* [x] [ajv](https://www.npmjs.com/package/ajv) - Validates an object against JSON Schema
* [ ] [ajv-pack](https://www.npmjs.com/package/ajv-pack) - Generates JS code from JSON Schema to quickly validate an objectz
