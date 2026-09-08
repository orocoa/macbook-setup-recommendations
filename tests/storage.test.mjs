import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

// Exercise the actual preference functions without requiring a browser dependency.
const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function getInitialLanguage()");
const end = source.indexOf("function textFor(", start);
assert(start >= 0 && end > start, "Language preference functions must be present");

function environment(search = "", storage = {}) {
  const context = vm.createContext({
    URLSearchParams,
    window: { location: { search } },
    localStorage: storage,
    SUPPORTED_LANGUAGES: new Set(["zh-CN", "en"]),
    LANGUAGE_STORAGE_KEY: "mac-setup-language-v1",
    activeLanguage: "en",
    console: { warn() {} },
  });
  vm.runInContext(source.slice(start, end), context);
  return context;
}

test("a URL language wins over saved preferences", () => {
  assert.equal(environment("?lang=en", { getItem: () => "zh-CN" }).getInitialLanguage(), "en");
});

test("saved language is restored; unsupported values fall back", () => {
  assert.equal(environment("", { getItem: () => "en" }).getInitialLanguage(), "en");
  assert.equal(environment("", { getItem: () => "unknown" }).getInitialLanguage(), "zh-CN");
});

test("denied storage reads and writes never block startup or language navigation", () => {
  const unavailable = () => { throw new Error("Storage denied"); };
  const context = environment("", { getItem: unavailable, setItem: unavailable });
  assert.equal(context.getInitialLanguage(), "zh-CN");
  assert.doesNotThrow(() => context.saveLanguagePreference());
});

test("available storage saves the selected language under the stable key", () => {
  let saved;
  environment("", { setItem: (...args) => { saved = args; } }).saveLanguagePreference();
  assert.deepEqual(saved, ["mac-setup-language-v1", "en"]);
});
