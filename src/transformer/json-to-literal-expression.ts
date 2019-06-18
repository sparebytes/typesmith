import * as ts from "typescript";

const circularCheck = new WeakSet<any>();

export function jsonToLiteralExpression(v: unknown, options?: { multiline?: boolean }): ts.Expression {
  const multiline = options != null && options.multiline !== false;

  function _jsonToLiteralExpression(value: unknown) {
    switch (typeof value) {
      case "string":
        return ts.createStringLiteral(value);
      case "number":
        return ts.createNumericLiteral(value.toString());
      case "bigint":
        return ts.createNumericLiteral(value.toString() + "n");
      case "boolean":
        return ts.createIdentifier(value.toString());
      case "undefined":
        return ts.createIdentifier("undefined");
      case "object":
        if (value === null) {
          return ts.createNull();
        } else {
          if (circularCheck.has(value)) {
            throw new Error("jsonToLiteralExpression(value): circular reference detected.");
          }

          circularCheck.add(value);
          let result: ts.Expression;
          if (Array.isArray(value)) {
            result = ts.createArrayLiteral(value.map(_jsonToLiteralExpression), multiline);
          } else {
            result = ts.createObjectLiteral(
              Object.keys(value).map(k =>
                ts.createPropertyAssignment(ts.createStringLiteral(k), _jsonToLiteralExpression((value as any)[k])),
              ),
              multiline,
            );
          }
          circularCheck.delete(value);
          return result;
        }
        break;
      case "symbol":
      case "function":
      default:
        throw new Error("jsonToLiteralExpression(value): value is not of an expected type : " + typeof value);
    }
  }

  return _jsonToLiteralExpression(v);
}
