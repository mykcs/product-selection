"use strict";
const assert = require("node:assert/strict");
const {formatCalendarDate: date, formatCalendarText: text, splitCalendarText: split} = require("../assets/calendar-date.js");

assert.equal(date("2026-10-13"), "2026年10月13日");
assert.equal(date("2026.10.13"), "2026年10月13日");
assert.equal(date("2026 年 10 月 13 日"), "2026年10月13日");
assert.equal(date("October 13, 2026", "en"), "2026-10-13");
assert.equal(date("2026-10"), "2026年10月");
assert.equal(date("June 2027", "en"), "2027-06");
assert.equal(date("2024-02-29"), "2024年2月29日");
for (const invalid of ["2026-02-29", "2026-13-01", "2026-04-31", "9月22日", "Fall 2027", "2026"]) {
  assert.throws(() => date(invalid), RangeError, invalid);
}
assert.equal(text("快照 2026-10-13；有效至 2026.12.31。"), "快照 2026年10月13日；有效至 2026年12月31日。");
assert.equal(text("2026 年 10 月 13 日 / October 13, 2026 / 2026-10"), "2026年10月13日 / 2026年10月13日 / 2026年10月");
assert.equal(text("September 2026", "en"), "2026-09");
for (const unchanged of [
  "actual-route-20261013", "source_2026-10-13", "v2026-10-13", "2026-10-13.csv",
  "https://example.com/2026-10-13/report", "/evidence/2026-10-13.json", "October 13, 2026.pdf",
  "2026-10-13T23:30:00-07:00", "2026-10-13T00:00:00Z", "2026-10-13-raw",
  "2026", "9月22日", "Fall 2027", "2026-02-29", "HK$7,000", "1 USD ≈ 6.7114 CNY"
]) assert.equal(text(unchanged), unchanged, unchanged);
assert.deepEqual(split("快照 2026-10-13"), [{text:"快照 "},{text:"2026年10月13日",iso:"2026-10-13"}]);
console.log("PASS: calendar precision, validity, language and identifier boundaries");
