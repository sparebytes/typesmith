import test from "ava";
import {
  assertTypeFn,
  DateString,
  DateTimeStrict,
  DateTimeString,
  EmailString,
  HostnameString,
  UnsafeInt,
  Int,
  Ipv4String,
  Ipv6String,
  SocialSecurityNumberNonHyphenatedString,
  SocialSecurityNumberOptionalHyphenatedString,
  SocialSecurityNumberString,
  TimeString,
  YearMonthString,
} from "../../dist/src";

export interface Foo {
  misc?: null | "" | YearMonthString | SocialSecurityNumberString;
  unsafeInt?: UnsafeInt;
  int?: Int;
  dateTimeStrict?: DateTimeStrict;
  dateTimeString?: DateTimeString;
  timeString?: TimeString;
  dateString?: DateString;
  yearMonthString?: YearMonthString;
  emailString?: EmailString;
  hostnameString?: HostnameString;
  ipv4String?: Ipv4String;
  ipv6String?: Ipv6String;
  socialSecurityNumberString?: SocialSecurityNumberString;
  socialSecurityNumberNonHyphenatedString?: SocialSecurityNumberNonHyphenatedString;
  socialSecurityNumberOptionalHyphenatedString?: SocialSecurityNumberOptionalHyphenatedString;
}

const assertFoo = assertTypeFn<Foo>();

test("Formats Valid", t => {
  const foos = [
    { misc: null },
    { misc: "" },
    { misc: "2001-01" },
    { misc: "555-55-5555" },
    { unsafeInt: 0 },
    { unsafeInt: Number.MIN_SAFE_INTEGER - 100 },
    { unsafeInt: Number.MAX_SAFE_INTEGER + 100 },
    { unsafeInt: -Infinity },
    { unsafeInt: Infinity },
    { int: 0 },
    { int: Number.MIN_SAFE_INTEGER },
    { int: Number.MAX_SAFE_INTEGER },
    { dateTimeStrict: "2018-11-13T20:20:39+00:00" },
    { dateTimeString: "2018-11-13Z" },
    { dateTimeString: "2018-11-13T20:20:39Z" },
    { dateTimeString: "2018-11-13T20:20:39.000Z" },
    { dateTimeString: "2018-11-13T20:20:39+00:00" },
    { dateTimeString: "2018-11-13T20:20:39.000+00:00" },
    { timeString: "20:20:39+00:00" },
    { dateString: "2018-11-13" },
    { yearMonthString: "2001-01" },
    { yearMonthString: "2001-12" },
    { emailString: "foo@example.com" },
    { hostnameString: "localhost" },
    { ipv4String: "127.0.0.1" },
    { ipv6String: "::1" },
    { socialSecurityNumberString: "555-55-5555" },
    { socialSecurityNumberNonHyphenatedString: "555555555" },
    { socialSecurityNumberOptionalHyphenatedString: "555-55-5555" },
    { socialSecurityNumberOptionalHyphenatedString: "555555555" },
  ];
  t.plan(foos.length);
  for (const foo of foos) {
    const coerced = { ...foo };
    try {
      assertFoo(coerced).unwrap();
    } catch (ex) {
      t.log("Value should have passed.", { Original: foo, Coerced: coerced });
      throw ex;
    }
    t.pass();
  }
});

test("Class Type Json Invalid", t => {
  const foos = [
    { misc: "x" },
    { misc: "2001-01-01" },
    { misc: "555555555" },
    { unsafeInt: NaN },
    { unsafeInt: "" },
    { unsafeInt: "x" },
    { unsafeInt: "0" }, // Coercion to 0
    { unsafeInt: "10000000000000000000" }, // Coercion
    { unsafeInt: "-10000000000000000000" }, // Coercion
    { unsafeInt: true }, // Coercion to 1
    { unsafeInt: false }, // Coercion to 0
    { unsafeInt: null }, // Coerction to 0
    { int: "0" }, // Coercion
    { int: NaN },
    { int: "" },
    { int: null }, // Coerction to 0
    { int: "x" },
    { int: "10000000000000000000" },
    { int: "-10000000000000000000" },
    { int: Number.MIN_SAFE_INTEGER - 100 },
    { int: Number.MAX_SAFE_INTEGER + 100 },
    { int: -Infinity },
    { int: Infinity },
    { dateTimeStrict: "2018-11-X3T20:20:39+00:00" },
    { dateTimeString: "2018-11-13+00" },
    { dateTimeString: "2018-11-13+00:00" },
    { dateTimeString: "2018-11-13T20:20:39" },
    { dateTimeString: "2018-11-13T20:20:39+00" },
    { dateTimeString: "2018-11-13T20:20:39.000+00" },
    { timeString: "20:20X39+00:00" },
    { dateString: "2018X11-13" },
    { yearMonthString: "2001" },
    { yearMonthString: "2001-01-01" },
    { yearMonthString: "2001-13" },
    { yearMonthString: "2001-00" },
    { yearMonthString: "2001-21" },
    { emailString: "fooexample.com" },
    { hostnameString: "/" },
    { ipv4String: "127.0.0.1.1" },
    { ipv6String: "::x" },
    { socialSecurityNumberString: "555555555" },
    { socialSecurityNumberString: "555-55-55551" },
    { socialSecurityNumberString: "555-55-555" },
    { socialSecurityNumberNonHyphenatedString: "555-55-5555" },
    { socialSecurityNumberNonHyphenatedString: "5555555551" },
    { socialSecurityNumberNonHyphenatedString: "55555555" },
    { socialSecurityNumberOptionalHyphenatedString: "555-55-55551" },
    { socialSecurityNumberOptionalHyphenatedString: "555-55-555" },
    { socialSecurityNumberOptionalHyphenatedString: "5555555551" },
    { socialSecurityNumberOptionalHyphenatedString: "55555555" },
  ];
  t.plan(foos.length);
  for (const foo of foos) {
    try {
      const coerced = { ...foo };
      assertFoo(coerced).unwrap();
      t.log("Value should have failed.", { Original: foo, Coerced: coerced });
      t.fail();
    } catch (ex) {
      t.pass();
    }
  }
});
