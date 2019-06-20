import { AssertTypeOptions } from "./assert-types";

export module settings {
  let globalValidationOptions: AssertTypeOptions = {
    allErrors: true,
  };
  let globalValidationOptionsUsed = false;
  let globalValidationOptionsUsedWarned = false;

  export function updateGlobalValidationOptions(overrides: AssertTypeOptions) {
    if (globalValidationOptionsUsed && !globalValidationOptionsUsedWarned) {
      console.warn(
        "Typesmith: updateGlobalValidationOptions has been called after the options have been used to compile validation functions.\nTry to call updateGlobalValidationOptions sooner.",
      );
      globalValidationOptionsUsedWarned = true;
    }
    globalValidationOptions = {
      ...globalValidationOptions,
      ...overrides,
    };
  }

  export function getGlobalValidationOptions() {
    return globalValidationOptions;
  }

  /** @internal */
  export function useGlobalValidationOptions() {
    globalValidationOptionsUsed = true;
    return getGlobalValidationOptions();
  }
}
