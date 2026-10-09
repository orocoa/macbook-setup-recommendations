import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function filteredSettings(");
const end = source.indexOf("function renderList(", start);
assert(start >= 0 && end > start);
const data = await Promise.all(["settings.json", "settings.en.json"].map(async name =>
  JSON.parse(await readFile(new URL(`../data/${name}`, import.meta.url), "utf8"))));

function searchIds(settings, query) {
  const context = vm.createContext({ settings, search: { value: query } });
  vm.runInContext(source.slice(start, end), context);
  return Array.from(context.filteredSettings(), setting => setting.id);
}

test("Mos matches its app entry in both languages without matching most", () => {
  for (const settings of data) {
    assert.deepEqual(searchIds(settings, " Mos "), ["mos-separate-mouse-scroll-direction"]);
  }
});

test("longer partial words, Chinese content, empty input and literal punctuation remain searchable", () => {
  assert(searchIds(data[1], "track").includes("trackpad-tracking-speed"));
  assert(searchIds(data[0], "触控板").includes("trackpad-tracking-speed"));
  assert.equal(searchIds(data[0], "  ").length, 15);
  assert.deepEqual(searchIds(data[1], "[not a setting]"), []);
});
