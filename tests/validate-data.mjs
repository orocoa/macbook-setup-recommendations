import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const localeFiles = {
  "zh-CN": new URL("../data/settings.json", import.meta.url),
  en: new URL("../data/settings.en.json", import.meta.url),
};
const supportedVisualVariants = new Set([
  "finder-path-bar",
  "file-extensions",
  "tracking-speed",
  "dock-recents",
  "hot-corners",
  "menu-bar",
  "input-source-by-document",
  "folders-on-top",
]);
const supportedVisualTypes = new Set(["state_comparison", "motion_comparison", "workflow", "official_reference", "concept_reference"]);
const requiredTextFields = ["id", "master_section", "title", "description", "before_state", "after_state"];
const requiredArrayFields = ["change_paths", "steps", "restore_steps", "sources"];

const settingsByLocale = Object.fromEntries(
  await Promise.all(
    Object.entries(localeFiles).map(async ([locale, url]) => [locale, JSON.parse(await readFile(url, "utf8"))]),
  ),
);

for (const [locale, settings] of Object.entries(settingsByLocale)) {
  assert(Array.isArray(settings), `${locale} 数据根节点必须是数组`);
  assert(settings.length > 0, `${locale} 至少需要一条设置`);

  const ids = new Set();
  for (const [index, setting] of settings.entries()) {
    const label = setting?.id || `${locale} 第 ${index + 1} 条设置`;
    assert(setting && typeof setting === "object" && !Array.isArray(setting), `${label} 必须是对象`);

    for (const field of requiredTextFields) {
      assert(typeof setting[field] === "string" && setting[field].trim(), `${label} 缺少 ${field}`);
    }
    for (const field of requiredArrayFields) {
      assert(Array.isArray(setting[field]) && setting[field].length > 0, `${label} 的 ${field} 必须是非空数组`);
    }

    assert(!ids.has(setting.id), `${locale} 的 ${setting.id} 重复`);
    ids.add(setting.id);
    assert(Number.isFinite(setting.master_order), `${label} 的 master_order 必须是数字`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(setting._editorial?.last_verified || ""), `${label} 缺少内部 _editorial.last_verified`);

    for (const source of setting.sources) {
      assert(typeof source.label === "string" && source.label.trim(), `${label} 的来源缺少 label`);
      assert(/^https:\/\//.test(source.url || ""), `${label} 的来源必须是独立 HTTPS URL`);
    }

    if (setting.shortcut_table !== undefined) {
      const table = setting.shortcut_table;
      assert(table && typeof table === "object" && !Array.isArray(table), `${label} 的 shortcut_table 必须是对象`);
      assert(typeof table.title === "string" && table.title.trim(), `${label} 的 shortcut_table 缺少 title`);
      assert(Array.isArray(table.headers) && table.headers.length > 0, `${label} 的 shortcut_table 缺少 headers`);
      assert(Array.isArray(table.rows) && table.rows.length > 0, `${label} 的 shortcut_table 缺少 rows`);
      for (const row of table.rows) {
        assert(Array.isArray(row) && row.length === table.headers.length, `${label} 的 shortcut_table 行列数不一致`);
        assert(row.every((cell) => typeof cell === "string" && cell.trim()), `${label} 的 shortcut_table 不能包含空单元格`);
      }
    }

    assert(setting.visual_demo === null || typeof setting.visual_demo === "object", `${label} 的 visual_demo 必须是对象或 null`);
    if (!setting.visual_demo) continue;
    assert(supportedVisualTypes.has(setting.visual_demo.type), `${label} 使用了未实现的视觉类型`);
    if (["official_reference", "concept_reference"].includes(setting.visual_demo.type)) {
      assert(typeof setting.visual_demo.image_src === "string" && setting.visual_demo.image_src, `${label} 缺少 image_src`);
      assert(typeof setting.visual_demo.alt === "string" && setting.visual_demo.alt, `${label} 缺少 alt`);
      const pageUrl = new URL("../index.html", localeFiles[locale]);
      await access(new URL(setting.visual_demo.image_src, pageUrl));
    } else {
      assert(supportedVisualVariants.has(setting.visual_demo.variant), `${label} 使用了未实现的视觉示意`);
    }
  }
}

const chineseSettings = settingsByLocale["zh-CN"];
const englishSettings = settingsByLocale.en;
assert.equal(chineseSettings.length, englishSettings.length, "中英文设置数量必须一致");

const chineseById = new Map(chineseSettings.map((setting) => [setting.id, setting]));
for (const englishSetting of englishSettings) {
  const chineseSetting = chineseById.get(englishSetting.id);
  assert(chineseSetting, `英文设置 ${englishSetting.id} 在中文数据中不存在`);
  assert.equal(englishSetting.master_order, chineseSetting.master_order, `${englishSetting.id} 的排序必须一致`);
  assert.equal(englishSetting.visual_demo?.type ?? null, chineseSetting.visual_demo?.type ?? null, `${englishSetting.id} 的视觉类型必须一致`);
  assert.equal(englishSetting.visual_demo?.variant ?? null, chineseSetting.visual_demo?.variant ?? null, `${englishSetting.id} 的视觉变体必须一致`);
  assert.equal(englishSetting.shortcut_table?.headers.length ?? null, chineseSetting.shortcut_table?.headers.length ?? null, `${englishSetting.id} 的快捷键表结构必须一致`);
  assert.equal(englishSetting.shortcut_table?.rows.length ?? null, chineseSetting.shortcut_table?.rows.length ?? null, `${englishSetting.id} 的快捷键表行数必须一致`);
}

console.log(`数据检查通过：${chineseSettings.length} 条设置，中英文 id 与视觉结构一致。`);
