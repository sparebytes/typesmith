import { ErrorObject } from "./ajv-errors";

/** @todo smarter implementation */
export function humanizeErrorObject(error: ErrorObject): string {
  return error.message || "";
}

/** @todo smarter implementation */
export function humanizeErrorsToArray(errors: ErrorObject[]): string[] {
  const errorStrings: string[] = errors.map(humanizeErrorObject).filter(e => e) as string[];
  if (errorStrings.length === 0) {
    return ["unexpected error"];
  }
  return errorStrings;
}

/** @todo smarter implementation */
export function humanizeErrorsToString(errors: ErrorObject[]): string {
  return humanizeErrorsToArray(errors).join(". ");
}
