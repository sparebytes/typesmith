import test from "ava";

test("typesmith/transformer should not be exported from typesmith", t => {
  t.assert(require("../dist").makeVisitorContext === undefined);
});
