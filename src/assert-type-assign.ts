import { AssertTypeResult, AssertTypeFn } from "./assert-types";
import { getValidatableFn } from "./validatable-util";

/**
 * returns a function for validating an object and returning a new instance of `clazz`
 *
 * `clazz` must have the `@Validatable()` decorator
 *
 * **Does not instatiate new classes inside of `clazz`'s properties**
 *
 * @example
 *  @Validatable()
 *  class Thing { foo: string }
 *  const assertAssignThing = assertTypeAssign(Thing);
 *  assertAssignThing({ foo: "bar" }).unwrap() instanceof Thing
 */
export function assertTypeAssign<T>(clazz: new () => T): AssertTypeFn<T>;

/**
 * validates `data` and assigns it's properties to a new instance of `clazz`
 *
 * `clazz` must have the `@Validatable()` decorator
 *
 * **Does not instatiate new classes inside of `clazz`'s properties**
 *
 * @example
 *  @Validatable()
 *  class Thing { foo: string }
 *  assertTypeAssign(Thing, { foo: "bar" }).unwrap() instanceof Thing
 */
export function assertTypeAssign<T>(clazz: new () => T, data: any): AssertTypeResult<T>;

export function assertTypeAssign<T>(clazz: new () => T, data?: any): AssertTypeResult<T> | AssertTypeFn<T> {
  const assertClazz = getValidatableFn(clazz);
  if (assertClazz == null) {
    console.error("clazz does not appear to have a @Validatable() applied to it.", { clazz, data });
    throw new Error("clazz does not appear to have a @Validatable() applied to it.");
  }

  if (arguments.length === 1) {
    return (data2: any) => {
      const result = assertClazz(data2).map(validatedData => Object.assign(new clazz(), validatedData));
      return result;
    };
  } else {
    const result = assertClazz(data).map(validatedData => Object.assign(new clazz(), validatedData));
    return result;
  }
}
