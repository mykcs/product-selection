import unittest
import contextlib
import io
import shutil
import tempfile
from pathlib import Path

from audit_site_design import Page, calendar_failures, css_rules, inspect_declaration, validate_design

ROOT = Path(__file__).resolve().parents[1]
TOKENS = {prop for _, prop, _ in css_rules((ROOT / "assets/site.css").read_text()) if prop.startswith("--")}


class DesignContract(unittest.TestCase):
    def test_shared_values_and_geometry(self):
        for prop, value in [("font-size", "var(--text-body)"), ("padding", "0 var(--space-panel)"), ("margin", "0 auto"), ("max-width", "var(--width-reading)")]:
            self.assertEqual(inspect_declaration("main p", prop, value, TOKENS), [])
        self.assertEqual(inspect_declaration(".tf2 .tf2-connector", "max-width", "62%", TOKENS), [])

    def test_literal_calc_and_unknown_owner_fail(self):
        for prop, value in [("font-size", "17px"), ("line-height", "1.6"), ("padding", "calc(18px)"), ("margin", "-1px 19px"), ("font-size", "var(--text-new-role)"), ("max-width", "70ch"), ("--text-body", "17px")]:
            self.assertTrue(inspect_declaration("main p", prop, value, TOKENS), (prop, value))

    def test_nested_media_is_checked_without_exempting_a_whole_page(self):
        rules = list(css_rules('@media(max-width:760px){p{padding:19px;font-size:var(--text-body)}}'))
        self.assertEqual(len(rules), 2)
        self.assertTrue(inspect_declaration(*rules[0], TOKENS))

    def test_visible_dates_fail_while_machine_data_and_code_stay_exact(self):
        page = Page("fixture.html")
        page.feed('<html lang="zh"><main><p data-source="2026-10-13">2026-10-13; October 13, 2026; 2026 年 10 月 13 日</p><code>2026-10-13</code><script>const source="2026-10-13"</script><p>/archive/2026-10-13.csv</p></main></html>')
        failures = calendar_failures(page.calendar, ROOT)
        self.assertEqual(len(failures), 1)
        self.assertIn("2026年10月13日", failures[0]["expected"])

    def test_time_machine_value_and_display_cannot_disagree(self):
        page = Page("fixture.html")
        page.feed('<time datetime="2026-10-13">2026年10月14日</time>')
        self.assertEqual(len(calendar_failures(page.times, ROOT)), 1)

    def test_orphan_page_and_unregistered_new_route_fail_the_actual_guard(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for file in ["assets/site.css", "assets/calendar-date.js", "scripts/check_calendar_text.cjs"]:
                (root / file).parent.mkdir(exist_ok=True)
                shutil.copyfile(ROOT / file, root / file)
            good = '<html lang="zh"><link rel="stylesheet" href="/assets/site.css"><main><h1>标题</h1><p>正文</p></main></html>'
            (root / "index.html").write_text(good)
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(validate_design(root, [Path("index.html")])["routes"], 1)
            (root / "index.html").write_text(good.replace('<link rel="stylesheet" href="/assets/site.css">', ''))
            with self.assertRaisesRegex(SystemExit, "single design owner"):
                validate_design(root, [Path("index.html")])
            (root / "index.html").write_text(good)
            (root / "unregistered.html").write_text(good)
            with self.assertRaisesRegex(SystemExit, "unregistered"):
                validate_design(root, [Path("index.html")])


if __name__ == "__main__":
    unittest.main()
