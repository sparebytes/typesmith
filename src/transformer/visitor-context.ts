import * as path from "path";
import { Config, createFormatter, createParser, SchemaGenerator } from "ts-json-schema-generator";
import * as ts from "typescript";
import { AssertTypeOptions } from "../assert-types";
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
};

export function getVisitorContext(program: ts.Program, options?: { [Key: string]: any }) {
  const sgOptions = ((options && options.options) || {}) as Partial<Config>;
  const extraJsonTags = Array.from(new Set([...defaultExtraJsonTags, ...(sgOptions.extraJsonTags || [])]));
  const schemGeneratorConfig: Config = {
    expose: sgOptions.expose != null ? sgOptions.expose : baseSchemaGeneratorConfig.expose,
    topRef: sgOptions.topRef != null ? sgOptions.topRef : baseSchemaGeneratorConfig.topRef,
    jsDoc: sgOptions.jsDoc != null ? sgOptions.jsDoc : baseSchemaGeneratorConfig.jsDoc,
    sortProps: sgOptions.sortProps != null ? sgOptions.sortProps : baseSchemaGeneratorConfig.sortProps,
    strictTuples: sgOptions.strictTuples != null ? sgOptions.strictTuples : baseSchemaGeneratorConfig.strictTuples,
    skipTypeCheck: sgOptions.skipTypeCheck != null ? sgOptions.skipTypeCheck : baseSchemaGeneratorConfig.skipTypeCheck,
    extraJsonTags: extraJsonTags,
    path: baseSchemaGeneratorConfig.path,
    type: baseSchemaGeneratorConfig.type,
  };
  const schemGeneratorNodeParser = createParser(program, schemGeneratorConfig);
  const schemGeneratorTypeFormatter = createFormatter();
  const schemaGenerator = new SchemaGenerator(program, schemGeneratorNodeParser, schemGeneratorTypeFormatter);

  const declarationPath =
    options != null && options.options != null && typeof options.options.declarationPath === "string"
      ? options.options.declarationPath
      : path.resolve(path.join(__dirname, "..", "transformable"));

  const vOptions = ((options && options.options) || {}) as AssertTypeOptions;
  const defaultValidationOptions: AssertTypeOptions = {};
  if ("removeAdditional" in vOptions) defaultValidationOptions.removeAdditional = vOptions.removeAdditional;
  if ("useDefaults" in vOptions) defaultValidationOptions.useDefaults = vOptions.useDefaults;
  if ("coerceTypes" in vOptions) defaultValidationOptions.coerceTypes = vOptions.coerceTypes;
  if ("lazyCompile" in vOptions) defaultValidationOptions.lazyCompile = vOptions.lazyCompile;

  const visitorContext: VisitorContext = {
    program,
    checker: program.getTypeChecker(),
    schemaGenerator: schemaGenerator,
    declarationPath: declarationPath,
    defaultValidationOptions: defaultValidationOptions,
    continueOnError: (options && options.options && options.options.continueOnError) || false,
  };

  const oDebug = (options && options.options && options.options.debug) || {};
  if (typeof oDebug.performance === "number") {
    // console.log(`typesmith transformer performance debugging enabled every ${oDebug.performance}ms.`);
    visitorContext.perfDebugger = new TransformerPerformanceDebugger(oDebug.performance);
  }

  return visitorContext;
}
