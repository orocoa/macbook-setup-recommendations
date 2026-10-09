import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

// Exercise the actual preference functions without requiring a browser dependency.
const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function readStorage(");
const end = source.indexOf("function element(", start);
assert(start >= 0 && end > start, "Language preference functions must be present");

function environment(search = "", storage = {}) {
  const context = vm.createContext({
    URL,
    location: { href: `https://example.test/${search}` },
    localStorage: storage,
    languages: new Set(["zh-CN", "en"]),
    LANGUAGE_KEY: "mac-setup-language-v1",
    status: { hidden: true, textContent: "" },
    text: () => "Save unavailable",
    console: { warn() {} },
  });
  vm.runInContext(source.slice(start, end), context);
  return context;
}

test("a URL language wins over saved preferences", () => {
  assert.equal(environment("?lang=en", { getItem: () => "zh-CN" }).initialLanguage(), "en");
});

test("saved language is restored; unsupported values fall back", () => {
  assert.equal(environment("", { getItem: () => "en" }).initialLanguage(), "en");
  assert.equal(environment("", { getItem: () => "unknown" }).initialLanguage(), "zh-CN");
});

test("denied storage reads and writes never block startup or language navigation", () => {
  const unavailable = () => { throw new Error("Storage denied"); };
  const context = environment("", { getItem: unavailable, setItem: unavailable });
  assert.equal(context.initialLanguage(), "zh-CN");
  assert.doesNotThrow(() => context.saveStorage("mac-setup-language-v1", "en"));
  assert.equal(context.status.hidden, false);
});

test("available storage saves the selected language under the stable key", () => {
  let saved;
  environment("", { setItem: (...args) => { saved = args; } }).saveStorage("mac-setup-language-v1", "en");
  assert.deepEqual(saved, ["mac-setup-language-v1", "en"]);
});

test("existing production progress is read and malformed data safely falls back", () => {
  const context = environment("", { getItem: key => key === "mac-setup-completed-v1" ? '{"finder-path-bar":true}' : null });
  assert.equal(context.readStorage("mac-setup-completed-v1", {})["finder-path-bar"], true);
  for (const value of ["null", "[]", "false", "broken json"]) {
    const fallback = {};
    assert.equal(environment("", { getItem: () => value }).readStorage("mac-setup-completed-v1", fallback), fallback);
  }
});
