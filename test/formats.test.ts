import test from "ava";
import {
  assertTypeFn,
  DateString,
  DateTimeStrict,
  DateTimeString,
  EmailString,
  HostnameString,
  Ipv4String,
  Ipv6String,
  TimeString,
} from "../dist";

export interface Foo {
  dateTimeStrict?: DateTimeStrict;
  dateTimeString?: DateTimeString;
  timeString?: TimeString;
  dateString?: DateString;
  emailString?: EmailString;
  hostnameString?: HostnameString;
  ipv4String?: Ipv4String;
  ipv6String?: Ipv6String;
}

const assertFoo = assertTypeFn<Foo>();

test("Formats Valid", t => {
  const foos = [
    {
      dateTimeStrict: "2018-11-13T20:20:39+00:00",
      dateTimeString: "2018-11-13T20:20:39+00:00",
      timeString: "20:20:39+00:00",
      dateString: "2018-11-13",
      emailString: "foo@example.com",
      hostnameString: "localhost",
      ipv4String: "127.0.0.1",
      ipv6String: "::1",
    },
    { dateTimeString: "2018-11-13Z" },
    { dateTimeString: "2018-11-13T20:20:39Z" },
    { dateTimeString: "2018-11-13T20:20:39.000Z" },
    { dateTimeString: "2018-11-13T20:20:39+00:00" },
    { dateTimeString: "2018-11-13T20:20:39.000+00:00" },
    { timeString: "20:20:39+00:00" },
    { dateString: "2018-11-13" },
    { emailString: "foo@example.com" },
    { hostnameString: "localhost" },
    { ipv4String: "127.0.0.1" },
    { ipv6String: "::1" },
  ];
  for (const foo of foos) {
    try {
      assertFoo(foo).unwrap();
    } catch (ex) {
      console.error("value:", foo);
      throw ex;
    }
    t.pass();
  }
});

test("Class Type Json Invalid", t => {
  const foos = [
    { dateTimeStrict: "2018-11-X3T20:20:39+00:00" },
    { dateTimeString: "2018-11-13+00" },
    { dateTimeString: "2018-11-13+00:00" },
    { dateTimeString: "2018-11-13T20:20:39" },
    { dateTimeString: "2018-11-13T20:20:39+00" },
    { dateTimeString: "2018-11-13T20:20:39.000+00" },
    { timeString: "20:20X39+00:00" },
    { dateString: "2018X11-13" },
    { emailString: "fooexample.com" },
    { hostnameString: "/" },
    { ipv4String: "127.0.0.1.1" },
    { ipv6String: "::x" },
  ];
  for (const foo of foos) {
    t.throws(() => assertFoo(foo).unwrap());
  }
});
