/* Calendar display only. No Date parsing, timezone conversion or source-data
   mutation. Unknown precision, identifiers, URLs and filenames stay intact. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SiteCalendar = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const months = new Map(monthNames.flatMap((name, index) => [[name.toLowerCase(), index + 1], [name.slice(0, 3).toLowerCase(), index + 1]]));
  const pad = value => String(value).padStart(2, "0");
  function valid(year, month, day) {
    if (!Number.isInteger(year) || year < 1 || year > 9999 || month < 1 || month > 12) return false;
    if (day === undefined) return true;
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return day >= 1 && day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  }
  function parts(value) {
    let match = String(value).match(/^(\d{4})(?:[-./](\d{1,2})(?:[-./](\d{1,2}))?|\s*年\s*(\d{1,2})\s*月(?:\s*(\d{1,2})\s*日)?)$/);
    let year, month, day;
    if (match) {
      year = Number(match[1]); month = Number(match[2] || match[4]);
      day = match[3] || match[5] ? Number(match[3] || match[5]) : undefined;
    } else {
      match = String(value).match(/^([A-Za-z]+)\s+(?:(\d{1,2}),?\s+)?(\d{4})$/);
      if (!match || !months.has(match[1].toLowerCase())) return null;
      year = Number(match[3]); month = months.get(match[1].toLowerCase()); day = match[2] ? Number(match[2]) : undefined;
    }
    return valid(year, month, day) ? {year, month, day} : null;
  }
  function formatCalendarDate(value, language = "zh") {
    const date = parts(value);
    if (!date) throw new RangeError("Expected a valid calendar date or year-month value");
    if (language.toLowerCase().startsWith("zh")) return `${date.year}年${date.month}月${date.day === undefined ? "" : `${date.day}日`}`;
    return `${String(date.year).padStart(4, "0")}-${pad(date.month)}${date.day === undefined ? "" : `-${pad(date.day)}`}`;
  }
  const names = monthNames.map(name => `${name.slice(0,3)}(?:${name.slice(3)})?`).join("|");
  const expression = new RegExp(`(?<![A-Za-z0-9_./-])(?:\\d{4}[-./]\\d{1,2}[-./]\\d{1,2}|\\d{4}\\s*年\\s*\\d{1,2}\\s*月\\s*\\d{1,2}\\s*日|(?:${names})\\s+\\d{1,2},?\\s+\\d{4}|\\d{4}[-./]\\d{1,2}(?![-./]\\d)|\\d{4}\\s*年\\s*\\d{1,2}\\s*月(?!\\s*\\d)|(?:${names})\\s+\\d{4})(?![A-Za-z0-9_/-]|\\.[A-Za-z0-9])`, "gi");
  function splitCalendarText(value, language = "zh") {
    const text = String(value), result = [];
    let end = 0;
    for (const match of text.matchAll(expression)) {
      const date = parts(match[0]);
      if (!date) continue;
      if (match.index > end) result.push({text: text.slice(end, match.index)});
      result.push({text: formatCalendarDate(match[0], language), iso: formatCalendarDate(match[0], "en")});
      end = match.index + match[0].length;
    }
    if (end < text.length) result.push({text: text.slice(end)});
    return result;
  }
  const formatCalendarText = (value, language = "zh") => splitCalendarText(value, language).map(part => part.text).join("");
  return Object.freeze({formatCalendarDate, formatCalendarText, splitCalendarText});
});
