import * as path from "path";
import * as ts from "typescript";
import { transformNode, getVisitorContext } from "../src/transformer";

const configFilename = path.resolve("tsconfig.test.json");
const configContent = ts.sys.readFile(configFilename);
if (configContent === undefined) {
  throw new Error("Could not read config file.");
}
const configFile = ts.parseConfigFileTextToJson(configFilename, configContent);
const configParseResult = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  path.dirname(configFilename),
  {},
  path.basename(configFilename),
);
configParseResult.options.noEmit = true;
delete configParseResult.options.out;
delete configParseResult.options.outDir;
delete configParseResult.options.outFile;
delete configParseResult.options.declaration;

const inFile = path.resolve("test", "simple.test.ts");
const program = ts.createProgram([inFile], configParseResult.options);
const inSourceFile = program.getSourceFile(inFile);

const visitorContext = getVisitorContext(program, {});

function visitNodeAndChildren(node: ts.Node) {
  const transformedNode = transformNode(node, visitorContext);
  ts.forEachChild(transformedNode, visitNodeAndChildren);
}

visitNodeAndChildren(inSourceFile);
