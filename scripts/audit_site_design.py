"""Inspect every served HTML/CSS entry with only the Python/Node standard libraries.

CSS declarations must consume the finite owner. Browser acceptance independently
checks the winning computed properties and real geometry after interaction.
"""
from __future__ import annotations

import json
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

OWNER = Path("assets/site.css")
RESERVED = re.compile(r"^--(?:font-|text-|weight-|leading-|tracking-|space-|page-gutter$|width-)")
SPACING = re.compile(r"^(?:margin|padding)(?:-.+)?$|^(?:row-|column-)?gap$")
TYPE_PREFIX = {
    "font-family": "font-", "font-size": "text-", "font-weight": "weight-",
    "line-height": "leading-", "letter-spacing": "tracking-",
}
VOIDS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
PROTECTED = {"script", "style", "pre", "code", "kbd", "samp", "svg", "math"}


def split_css(value: str, delimiter: str) -> list[str]:
    """Split outside quotes and functions; declarations can contain data URLs."""
    pieces, start, depth, quote, escaped = [], 0, 0, "", False
    for index, char in enumerate(value):
        if escaped:
            escaped = False
        elif char == "\\":
            escaped = True
        elif quote:
            if char == quote:
                quote = ""
        elif char in "\"'":
            quote = char
        elif char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
        elif char == delimiter and depth == 0:
            pieces.append(value[start:index])
            start = index + 1
    pieces.append(value[start:])
    return pieces


def declarations(body: str):
    for entry in split_css(body, ";"):
        pair = split_css(entry, ":")
        if len(pair) >= 2:
            yield pair[0].strip(), ":".join(pair[1:]).strip()


def css_rules(css: str):
    css = re.sub(r"/\*[\s\S]*?\*/", "", css)
    cursor = 0
    while cursor < len(css):
        opening = css.find("{", cursor)
        if opening < 0:
            break
        selector = css[cursor:opening].strip()
        depth, quote, escaped, end = 1, "", False, opening + 1
        while end < len(css) and depth:
            char = css[end]
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif quote:
                if char == quote:
                    quote = ""
            elif char in "\"'":
                quote = char
            elif char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
            end += 1
        if depth:
            raise ValueError("Unclosed CSS block")
        body = css[opening + 1:end - 1]
        if selector.startswith(("@media", "@supports", "@layer", "@container")):
            yield from css_rules(body)
        else:
            for prop, value in declarations(body):
                yield selector, prop, value
        cursor = end


def inspect_declaration(selector: str, prop: str, value: str, tokens: set[str]) -> list[str]:
    issues = []
    value = re.sub(r"\s*!important\s*$", "", value).strip()
    refs = re.findall(r"var\(\s*(--[\w-]+)\s*\)", value)
    if RESERVED.match(prop):
        issues.append("shared token may only be defined by assets/site.css")
    if prop in TYPE_PREFIX:
        permitted = {"inherit", "normal", "0"} if prop == "letter-spacing" else {"inherit"}
        if value not in permitted and not re.fullmatch(r"var\(--" + TYPE_PREFIX[prop] + r"[\w-]+\)", value):
            issues.append("typography must consume its shared role")
    if prop == "font" and value != "inherit":
        issues.append("font shorthand must inherit the shared roles")
    if SPACING.fullmatch(prop):
        rest = re.sub(r"var\(--(?:space-[\w-]+|page-gutter)\)", "TOKEN", value)
        if not rest.split() or any(part not in {"TOKEN", "0", "auto", "normal", "inherit"} for part in rest.split()):
            issues.append("spacing must use the finite shared scale")
    if prop in {"max-width", "min-width", "max-inline-size", "min-inline-size"}:
        # Percentages and zero keep local grid/control/connector geometry; all
        # absolute reading, table and control measures have a named owner.
        connector = selector == ".tf2 .tf2-connector" and value in {"62%", "90%"}
        if value not in {"0", "none", "100%"} and not connector and not re.fullmatch(r"var\(--width-[\w-]+\)", value):
            issues.append("absolute content measure must consume a shared role")
    if prop in TYPE_PREFIX or SPACING.fullmatch(prop) or prop in {"max-width", "min-width", "max-inline-size", "min-inline-size"}:
        for token in refs:
            if token not in tokens:
                issues.append("unknown shared token " + token)
    return [f"{selector} {{{prop}: {value}}}: {issue}" for issue in issues]


class Page(HTMLParser):
    def __init__(self, source: str):
        super().__init__(convert_charrefs=True)
        self.source = source
        self.stack: list[str] = []
        self.language = "zh"
        self.styles: list[str] = []
        self.links: list[str] = []
        self.inline: list[tuple[str, str]] = []
        self.calendar: list[dict] = []
        self.times: list[dict] = []
        self.current_time: dict | None = None
        self.has_main = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.language = attrs.get("lang", "zh")
        if tag == "main":
            self.has_main = True
        if tag == "link" and "stylesheet" in attrs.get("rel", "").split():
            self.links.append(attrs.get("href", ""))
        if "style" in attrs:
            self.inline.append((tag + ("#" + attrs["id"] if attrs.get("id") else ""), attrs["style"]))
        if tag == "time" and attrs.get("datetime"):
            self.current_time = {"source": self.source + " <time>", "iso": attrs["datetime"], "text": "", "language": self.language}
        if tag not in VOIDS:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag == "time" and self.current_time:
            self.current_time["text"] = self.current_time["text"].strip()
            self.times.append(self.current_time)
            self.current_time = None
        if tag in self.stack:
            self.stack = self.stack[:len(self.stack) - 1 - self.stack[::-1].index(tag)]

    def handle_data(self, data):
        if "style" in self.stack:
            self.styles.append(data)
        if any(tag in PROTECTED for tag in self.stack):
            return
        if self.current_time:
            self.current_time["text"] += data
        if data.strip():
            self.calendar.append({"source": self.source, "text": data, "language": self.language})


def calendar_failures(records: list[dict], root: Path) -> list[dict]:
    checked = subprocess.run(
        ["node", str(root / "scripts/check_calendar_text.cjs")],
        input=json.dumps(records, ensure_ascii=False), text=True, capture_output=True, check=True,
    )
    return json.loads(checked.stdout)


def validate_design(root: Path, pages) -> dict:
    expected = {Path(page).as_posix() for page in pages}
    discovered = {page.relative_to(root).as_posix() for page in root.rglob("*.html")
                  if not any(part in {".git", "node_modules", "test-results", "playwright-report", "reports", "dist", ".public-build", ".astro"} for part in page.relative_to(root).parts)}
    errors = []
    if discovered != expected:
        errors.append(f"HTML route inventory differs: missing={sorted(expected-discovered)}, unregistered={sorted(discovered-expected)}")
    owner = (root / OWNER).read_text(encoding="utf-8")
    tokens = {prop for _, prop, _ in css_rules(owner) if RESERVED.match(prop)}
    required = {"--font-body", "--font-code", "--text-body", "--text-hero", "--weight-heading", "--leading-body", "--space-panel", "--space-section", "--page-gutter", "--width-content", "--width-reading"}
    if not required <= tokens:
        errors.append("design owner missing roles: " + ", ".join(sorted(required - tokens)))
    records, declarations_count, linked = [], 0, set()
    for name in sorted(discovered):
        path = root / name
        page = Page(name)
        page.feed(path.read_text(encoding="utf-8"))
        if page.links.count("/assets/site.css") != 1:
            errors.append(name + ": must link the single design owner exactly once")
        if not page.has_main:
            errors.append(name + ": missing semantic main content")
        records.extend(page.calendar + page.times)
        css_blocks = [(name + " <style>", css) for css in page.styles]
        for href in page.links:
            if href == "/assets/site.css":
                continue
            url = urlsplit(href)
            if url.scheme or url.netloc:
                errors.append(name + ": external CSS cannot own the site contract: " + href)
                continue
            stylesheet = (root / url.path.lstrip("/") if url.path.startswith("/") else path.parent / url.path).resolve()
            if not stylesheet.is_relative_to(root.resolve()) or not stylesheet.is_file():
                errors.append(name + ": broken local stylesheet " + href)
            elif href == "/assets/vendor/leaflet/leaflet.css":
                # Pinned third-party map geometry is not the product typography owner.
                if not stylesheet.read_text(encoding="utf-8").startswith("/* required styles"):
                    errors.append(name + ": unexpected Leaflet CSS artifact")
                continue
            elif stylesheet not in linked:
                linked.add(stylesheet)
                css_blocks.append((stylesheet.relative_to(root).as_posix(), stylesheet.read_text(encoding="utf-8")))
        for source, css in css_blocks:
            if re.search(r"@import\b", css, re.IGNORECASE):
                errors.append(source + ": link local stylesheets explicitly so every entry is audited")
            for selector, prop, value in css_rules(css):
                declarations_count += 1
                errors.extend(source + ": " + issue for issue in inspect_declaration(selector, prop, value, tokens))
        for selector, css in page.inline:
            for prop, value in declarations(css):
                declarations_count += 1
                errors.extend(name + " inline: " + issue for issue in inspect_declaration(selector, prop, value, tokens))
    for failure in calendar_failures(records, root):
        errors.append(f"{failure['source']}: nonstandard date {failure['actual']!r}; expected {failure['expected']!r}")
    if errors:
        raise SystemExit("Design contract failed:\n" + "\n".join(errors))
    summary = {"routes": len(discovered), "inspected_declarations": declarations_count, "calendar_text_nodes": len(records)}
    print("PASS: every HTML route consumes the design owner; source/date guard " + json.dumps(summary))
    return summary
