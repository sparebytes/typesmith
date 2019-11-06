import * as path from "path";
import { Config, createFormatter, createParser, SchemaGenerator } from "ts-json-schema-generator";
import * as ts from "typescript";
import { AssertTypeOptions } from "../assert-types";
import {
  CreateJsonSchemaOfNode,
  createJsonSchemaOfNode as defaultCreateJsonSchemaOfNode,
  createNoopSchemaOfNode,
} from "./create-json-schema-of-node";
import { TransformerPerformanceDebugger } from "./_transformer-performance-debugger";

const defaultExtraJsonTags = [
  "errorMessage",
  "typeof",
  "instanceOf",
  "range",
  "exclusiveRange",
  "regexp",
  "formatMaximum",
  "formatMinimum",
  "formatExclusiveMaximum",
  "formatExclusiveMinimum",
  "transform",
  "uniqueItemProperties",
  "allRequired",
  "anyRequired",
  "oneRequired",
  "patternRequired",
  "prohibited",
  "deepProperties",
  "deepRequired",
  "select",
  "selectCases",
  "selectDefault",
  "dynamicDefaults",
];

const baseSchemaGeneratorConfig: Config = {
  expose: "all", // "all" | "none" | "export";
  topRef: true,
  jsDoc: "extended", // "none" | "extended" | "basic";
  sortProps: true,
  strictTuples: true,
  skipTypeCheck: false,
  path: "",
  type: "",
};

export type VisitorContext = {
  program: ts.Program;
  schemaGenerator: SchemaGenerator;
  checker: ts.TypeChecker;
  declarationPath: string;
  defaultValidationOptions: AssertTypeOptions;
  perfDebugger?: TransformerPerformanceDebugger | null;
  continueOnError: boolean;
  createJsonSchemaOfNode: CreateJsonSchemaOfNode;
};

export interface MakeVisitorContextOptions extends Partial<AssertTypeOptions>, Partial<Config> {
  declarationPath?: string;
  continueOnError?: boolean;
  debug?: {
    performance?: number;
  };
  noop?: "noop" | null;
}

export interface MakeVisitorContextTsOptions {
  createJsonSchemaOfNode?: CreateJsonSchemaOfNode;
  options?: MakeVisitorContextOptions;
  verbose?: boolean;
}

export function makeVisitorContext(program: ts.Program, _tsOptions?: MakeVisitorContextTsOptions) {
  const tsOptions: MakeVisitorContextTsOptions = _tsOptions || {};
  const options = tsOptions.options || {};

  const extraJsonTags = Array.from(new Set([...defaultExtraJsonTags, ...(options.extraJsonTags || [])]));
  const schemGeneratorConfig: Config = {
    expose: options.expose != null ? options.expose : baseSchemaGeneratorConfig.expose,
    topRef: options.topRef != null ? options.topRef : baseSchemaGeneratorConfig.topRef,
    jsDoc: options.jsDoc != null ? options.jsDoc : baseSchemaGeneratorConfig.jsDoc,
    sortProps: options.sortProps != null ? options.sortProps : baseSchemaGeneratorConfig.sortProps,
    strictTuples: options.strictTuples != null ? options.strictTuples : baseSchemaGeneratorConfig.strictTuples,
    skipTypeCheck: options.skipTypeCheck != null ? options.skipTypeCheck : baseSchemaGeneratorConfig.skipTypeCheck,
    extraJsonTags: extraJsonTags,
    path: baseSchemaGeneratorConfig.path,
    type: baseSchemaGeneratorConfig.type,
  };
  const schemGeneratorNodeParser = createParser(program, schemGeneratorConfig);
  const schemGeneratorTypeFormatter = createFormatter();
  const schemaGenerator = new SchemaGenerator(program, schemGeneratorNodeParser, schemGeneratorTypeFormatter);

  const declarationPath =
    typeof options.declarationPath === "string"
      ? options.declarationPath
      : path.resolve(path.join(__dirname, "..", "transformable"));

  const defaultValidationOptions: AssertTypeOptions = {};
  if ("removeAdditional" in options) defaultValidationOptions.removeAdditional = options.removeAdditional;
  if ("useDefaults" in options) defaultValidationOptions.useDefaults = options.useDefaults;
  if ("coerceTypes" in options) defaultValidationOptions.coerceTypes = options.coerceTypes;
  if ("lazyCompile" in options) defaultValidationOptions.lazyCompile = options.lazyCompile;

  const visitorContext: VisitorContext = {
    program,
    checker: program.getTypeChecker(),
    schemaGenerator: schemaGenerator,
    declarationPath: declarationPath,
    defaultValidationOptions: defaultValidationOptions,
    continueOnError: options.continueOnError ?? true,
    createJsonSchemaOfNode: tsOptions.createJsonSchemaOfNode
      ? tsOptions.createJsonSchemaOfNode
      : options.noop === "noop"
      ? createNoopSchemaOfNode
      : defaultCreateJsonSchemaOfNode,
  };

  const oDebug = options.debug || {};
  if (typeof oDebug.performance === "number") {
    // console.log(`typesmith transformer performance debugging enabled every ${oDebug.performance}ms.`);
    visitorContext.perfDebugger = new TransformerPerformanceDebugger(oDebug.performance);
  }

  return visitorContext;
}
