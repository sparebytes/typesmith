// See https://json-schema.org/understanding-json-schema/reference/string.html

//
// Date and Time
//

/**
 * Date and time together, for example, 2018-11-13T20:20:39+00:00
 * @format date-time
 */
export type DateTimeStrict = string;

/**
 * Date and time together. For the date to be valid it must parsable by javascript `new Date(...)`.
 * 
 * Valid:
 * - 2001-12-31Z
 * - 2001-12-31T00:00:00Z
 * - 2001-12-31T00:00:00.000Z
 * - 2001-12-31T00:00:00+00:00
 * - 2001-12-31T00:00:00.000+00:00
 * Invalid:
 * - 2001-12-31+00
 * - 2001-12-31+00:00
 * - 2001-12-31T00:00:00
 * - 2001-12-31T00:00:00+00
 * - 2001-12-31T00:00:00.000+00
 *          
 * @pattern ^\d{4}-[01]\d-[0-3]\d(?:Z|T[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|\+[0-2]\d\:[0-5]\d?))$
 */
export type DateTimeString = string;

/**
 * New in draft 7 Time, for example, 20:20:39+00:00
 * @format time
 */
export type TimeString = string;

/**
 * New in draft 7 Date, for example, 2018-11-13
 * @format date
 */
export type DateString = string;

/**
 * Year and month without a day.
 * Valid:
 * - 2001-01
 * - 2001-12
 * Invalid:
 * - 2001
 * - 2001-01-01
 * - 2001-13
 * - 2001-00
 * - 2001-21
 * @pattern ^\d{4}-(0[1-9]|1[0-2])$
 */
export type YearMonthString = string;

//
// Email addresses
//

/**
 * Internet email address, see RFC 5322, section 3.4.1
 * @format email
 */
export type EmailString = string;

//
// Hostnames
//

/**
 * Internet host name, see RFC 1034, section 3.1
 * @format hostname
 */
export type HostnameString = string;


//
// IP Addresses
//

/**
 * IPv4 address, according to dotted-quad ABNF syntax as defined in RFC 2673, section 3.2
 * @format ipv4
 */
export type Ipv4String = string;

/**
 * IPv6 address, as defined in RFC 2373, section 2.2
 * @format ipv6
 */
export type Ipv6String = string;


//
// People
//

/**
 * @pattern ^\d{3}-\d{2}-\d{4}$
 */
export type SocialSecurityNumberString = string

/**
 * @pattern ^\d{9}$
 */
export type SocialSecurityNumberNonHyphenatedString = string

/**
 * @pattern ^\d{3}-?\d{2}-?\d{4}$
 */
export type SocialSecurityNumberOptionalHyphenatedString = string

//
// Unsupported
//

// id-hostname is not supported by ajv
// /**
//  * New in draft 7 An internationalized Internet host name, see RFC5890, section 2.3.2.3
//  * @format idn-hostname
//  */
// export type IdnHostnameString = string;

// id-email is not supported by ajv
// /**
//  * New in draft 7 The internationalized form of an Internet email address, see RFC 6531
//  * @format idn-email
//  */
// export type IdnEmailString = string;
