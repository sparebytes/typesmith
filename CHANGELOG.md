# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.10.0-rc.1](https://github.com/sparebytes/typesmith/compare/v0.10.0-rc.0...v0.10.0-rc.1) (2019-11-06)

## [0.10.0-rc.0](https://github.com/sparebytes/typesmith/compare/v0.9.8...v0.10.0-rc.0) (2019-11-06)

### [0.9.8](https://github.com/sparebytes/typesmith/compare/v0.9.7...v0.9.8) (2019-10-11)


### Bug Fixes

* recursive inline types work as expected since upgrading dependencies


### Tests

* ensure intersection and union types are handled properly
* add additional tests for coercing nullable properties



### [0.9.7](https://github.com/sparebytes/typesmith/compare/v0.9.6...v0.9.7) (2019-07-24)



### [0.9.6](https://github.com/sparebytes/typesmith/compare/v0.9.5...v0.9.6) (2019-07-03)


### Bug Fixes

* running assert function under noop transform throws error ([dd1a6f2](https://github.com/sparebytes/typesmith/commit/dd1a6f2))



### [0.9.5](https://github.com/sparebytes/typesmith/compare/v0.9.4...v0.9.5) (2019-07-03)


### Bug Fixes

* using coerceTypes with anyOf should not coerce nullable values ([a22d779](https://github.com/sparebytes/typesmith/commit/a22d779))


### Tests

* buffer test is no longer broken (but still an issue) ([b58f22b](https://github.com/sparebytes/typesmith/commit/b58f22b))



### [0.9.4](https://github.com/sparebytes/typesmith/compare/v0.9.3...v0.9.4) (2019-06-26)



### [0.9.3](https://github.com/sparebytes/typesmith/compare/v0.9.2...v0.9.3) (2019-06-26)



### [0.9.2](https://github.com/sparebytes/typesmith/compare/v0.9.1...v0.9.2) (2019-06-26)



### [0.9.1](https://github.com/sparebytes/typesmith/compare/v0.9.0...v0.9.1) (2019-06-26)


### Tests

* add class-methods test ([5397e60](https://github.com/sparebytes/typesmith/commit/5397e60))



## [0.9.0](https://github.com/sparebytes/typesmith/compare/v0.8.7...v0.9.0) (2019-06-25)


### Bug Fixes

* support recursive types better by using topRef ([8df278f](https://github.com/sparebytes/typesmith/commit/8df278f))


### Features

* add ajv-error support ([28410e9](https://github.com/sparebytes/typesmith/commit/28410e9))



### [0.8.7](https://github.com/sparebytes/typesmith/compare/v0.8.6...v0.8.7) (2019-06-25)


### Bug Fixes

* **release:** add @types/nested-error-stacks to release dependencies ([c296e24](https://github.com/sparebytes/typesmith/commit/c296e24))



### [0.8.6](https://github.com/sparebytes/typesmith/compare/v0.8.5...v0.8.6) (2019-06-25)


### Bug Fixes

* **transformer:** default export of createTransformer ([9e36d0b](https://github.com/sparebytes/typesmith/commit/9e36d0b))



### [0.8.5](https://github.com/sparebytes/typesmith/compare/v0.8.4...v0.8.5) (2019-06-25)


### Bug Fixes

* class constructor properties should not be ignored ([ca78200](https://github.com/sparebytes/typesmith/commit/ca78200))



### [0.8.4](https://github.com/sparebytes/typesmith/compare/v0.8.3...v0.8.4) (2019-06-21)



### [0.8.3](https://github.com/sparebytes/typesmith/compare/v0.8.2...v0.8.3) (2019-06-20)


### Bug Fixes

* throw error when a validator originates from a superclass ([4002ea3](https://github.com/sparebytes/typesmith/commit/4002ea3))



### [0.8.2](https://github.com/sparebytes/typesmith/compare/v0.8.1...v0.8.2) (2019-06-20)



### [0.8.1](https://github.com/sparebytes/typesmith/compare/v0.8.0...v0.8.1) (2019-06-20)


### Tests

* add test for class constructor properties ([77e56b7](https://github.com/sparebytes/typesmith/commit/77e56b7))



## [0.8.0](https://github.com/sparebytes/typesmith/compare/v0.7.0...v0.8.0) (2019-06-20)


### Features

* add assertTypeAssign for validating and instantiating a new class ([f20cf77](https://github.com/sparebytes/typesmith/commit/f20cf77))


### Tests

* ensure transformer code isn't exported from "typesmith" ([632ecdd](https://github.com/sparebytes/typesmith/commit/632ecdd))



## [0.7.0](https://github.com/sparebytes/typesmith/compare/v0.6.0...v0.7.0) (2019-06-20)


### Features

* ability to override validation settings at the type-level ([1821982](https://github.com/sparebytes/typesmith/commit/1821982))
* add global settings configurable at runtime ([acde2ba](https://github.com/sparebytes/typesmith/commit/acde2ba))


### Tests

* add test for AssertTypeResult ([f1cfac4](https://github.com/sparebytes/typesmith/commit/f1cfac4))
* write buffer test ([e60de89](https://github.com/sparebytes/typesmith/commit/e60de89))



## [0.6.0](https://github.com/sparebytes/typesmith/compare/v0.5.0...v0.6.0) (2019-06-20)


### Features

* **format:** add DateInstance and DateTimeFlex formats ([f2feef1](https://github.com/sparebytes/typesmith/commit/f2feef1))


### Tests

* add inheritance to @Validatable class decorator test ([c0f8f6c](https://github.com/sparebytes/typesmith/commit/c0f8f6c))



## [0.5.0](https://github.com/sparebytes/typesmith/compare/v0.4.0...v0.5.0) (2019-06-19)


### Features

* lazy compilation of validation function ([dd1e8a7](https://github.com/sparebytes/typesmith/commit/dd1e8a7))
* pull custom json keywords from jsdoc ([2b2c5ab](https://github.com/sparebytes/typesmith/commit/2b2c5ab))


### Tests

* add string length jsdoc test ([83cfb75](https://github.com/sparebytes/typesmith/commit/83cfb75))
* fix validatable test not unwrapping ([cfbbb5e](https://github.com/sparebytes/typesmith/commit/cfbbb5e))
* test [@instance](https://github.com/instance)Of keyword with Date ([4f5a9ef](https://github.com/sparebytes/typesmith/commit/4f5a9ef))



## [0.4.0](https://github.com/sparebytes/typesmith/compare/v0.3.1...v0.4.0) (2019-06-19)


### Features

* add @Validatable class decorator ([5c67caa](https://github.com/sparebytes/typesmith/commit/5c67caa))



### [0.3.1](https://github.com/sparebytes/typesmith/compare/v0.3.0...v0.3.1) (2019-06-19)


### Tests

* add test for dates issue ([cdd3c48](https://github.com/sparebytes/typesmith/commit/cdd3c48))



## [0.3.0](https://github.com/sparebytes/typesmith/compare/v0.2.2...v0.3.0) (2019-06-19)


### Features

* add types for Int and UsafeInt ([c9d0ab9](https://github.com/sparebytes/typesmith/commit/c9d0ab9))


### Tests

* fix integer type tests ([f50a953](https://github.com/sparebytes/typesmith/commit/f50a953))
* **formats:** better debug message ([29a1585](https://github.com/sparebytes/typesmith/commit/29a1585))
* **formats:** test union with multiple string formats ([6650f34](https://github.com/sparebytes/typesmith/commit/6650f34))



### [0.2.2](https://github.com/sparebytes/typesmith/compare/v0.2.1...v0.2.2) (2019-06-19)



### 0.2.1 (2019-06-19)
