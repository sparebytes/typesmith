"use strict";
const Ajv = require("ajv");
const { left, right } = require("fp-ts/lib/Either");

Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTypeFn = (...args) => {
  const n2 = args[args.length - 3];
  const n1 = args[args.length - 2];
  const n0 = args[args.length - 1];
  if (n2 !== "\u2663") {
    throw new Error("assertTypeFn(): Requires transformation via ttsc or ttypescript.");
  }
  const ajv = new Ajv(n1);
  const typeValidateFn = ajv.compile(n0);
  return object => {
    const isValid = typeValidateFn(object);
    return isValid ? right(object) : left(typeValidateFn.errors);
  };
};
