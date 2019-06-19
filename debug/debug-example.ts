import { assertTypeFn, Validatable } from "../src";

export type NumberArray = number[];
export const assertNumberArray = assertTypeFn<NumberArray>();

@Validatable()
export class Thingy {
    foo: "bar";
}
