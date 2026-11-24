"use strict";
const fs = require("node:fs");
const {formatCalendarText, formatCalendarDate} = require("../assets/calendar-date.js");
const records = JSON.parse(fs.readFileSync(0, "utf8"));
const failures = [];
for (const record of records) {
  const expected = record.iso
    ? formatCalendarDate(record.iso, record.language || "zh")
    : formatCalendarText(record.text, record.language || "zh");
  if (expected !== record.text) failures.push({source: record.source, actual: record.text, expected});
}
process.stdout.write(JSON.stringify(failures));
