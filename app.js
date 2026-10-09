import { viewMotion, gridMotion } from "./grid-motion.js?v=20261009-release";
import { createVisuals } from "./visuals.js?v=20261009-release";
import { UI_TEXT } from "./ui-text.js?v=20261009-release";

const $ = selector => document.querySelector(selector);
const view = $("#guide-view");
const browser = $("#settings-overview");
const detail = $("#setting-detail");
const list = $("#settings-list");
const search = $("#setting-search");
const status = $("#status");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const STORAGE_KEY = "mac-setup-completed-v1";
const LANGUAGE_KEY = "mac-setup-language-v1";
const languages = new Set(["zh-CN", "en"]);
let language = initialLanguage();
let settings = [];
let selectedId = null;
let completed = readStorage(STORAGE_KEY, {});
let loadingVersion = 0;
let pendingDemonstration = null;
const foldAnimations = new Map();

const copy = {
  "zh-CN": {
    directory: "设置列表", search: "搜索设置",
    footer: "方框用于记录修改进度；设置需要在 Mac 上手动调整。",
    retry: "重新加载", loading: "正在读取设置…", error: "设置读取失败，请重新加载。",
    empty: "没有找到相关设置", clear: "清除搜索", restore: "如何恢复", visual: "示意与对比",
  },
  en: {
    directory: "Settings", search: "Search settings",
    footer: "Checkboxes record your progress. Adjust settings manually on your Mac.",
    retry: "Reload", loading: "Loading settings…", error: "Settings could not be loaded. Please retry.",
    empty: "No matching settings", clear: "Clear search", restore: "How to restore it", visual: "Visual comparison",
  },
};
const text = key => UI_TEXT[language][key];
const label = key => copy[language][key];
const visuals = createVisuals(text);

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
  } catch { return fallback; }
}

function initialLanguage() {
  const routeLanguage = new URL(location.href).searchParams.get("lang");
  if (languages.has(routeLanguage)) return routeLanguage;
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (languages.has(stored)) return stored;
  } catch { /* The URL still works without browser storage. */ }
  return "zh-CN";
}

function saveStorage(key, value) {
  try { localStorage.setItem(key, value); }
  catch {
    status.hidden = false;
    status.textContent = text("saveError");
  }
}

function element(tag, className = "", value = "") {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = value;
  return node;
}

function listOf(values, tag = "ol") {
  const node = element(tag);
  (values || []).forEach(value => node.append(element("li", "", Array.isArray(value) ? value.join("；") : String(value))));
  return node;
}

function applyLanguage() {
  document.documentElement.lang = language;
  browser.setAttribute("aria-label", label("directory"));
  $("#guide-caption").textContent = label("footer");
  search.placeholder = document.activeElement === search ? "" : label("search");
  search.setAttribute("aria-label", label("search"));
  $("#empty-message").textContent = label("empty");
  $("#clear-search").textContent = label("clear");
  $("#retry").textContent = label("retry");
  document.querySelectorAll("[data-language]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
}

function updateRoute(id, action = "push") {
  const url = new URL(location.href);
  url.searchParams.set("lang", language);
  if (id) url.searchParams.set("setting", id);
  else url.searchParams.delete("setting");
  history[action === "replace" ? "replaceState" : "pushState"]({ setting: id }, "", url.pathname + url.search);
}

function filteredSettings() {
  const query = search.value.trim().toLowerCase();
  if (!query) return settings;
  const shortWord = /^[a-z0-9]{1,3}$/.test(query) ? new RegExp("(^|[^a-z0-9])" + query + "($|[^a-z0-9])") : null;
  const flatten = value => value === null || value === undefined ? "" : typeof value === "object" ? Object.values(value).map(flatten).join(" ") : String(value);
  return settings.filter(setting => {
    const searchable = flatten([
      setting.title, setting.master_section, setting.description, setting.before_state, setting.after_state,
      setting.change_paths, setting.steps, setting.restore_steps, setting.prerequisites, setting.conflicts, setting.search_keywords,
    ]).toLowerCase();
    return shortWord ? shortWord.test(searchable) : searchable.includes(query);
  });
}

function renderList() {
  const scroller = list.closest(".settings-list");
  const scrollTop = scroller.scrollTop;
  const focused = list.contains(document.activeElement) ? document.activeElement.dataset : null;
  const focusedSetting = focused?.setting;
  const focusedCompleted = focused?.completed;
  const visible = filteredSettings();
  $("#search-empty-state").hidden = visible.length > 0;
  const rows = [];
  let section = null;
  visible.forEach((setting, index) => {
    if (section !== setting.master_section) {
      section = setting.master_section;
      const group = element("li", "setting-group");
      group.dataset.select = "group:" + setting.id;
      group.append(element("h2", "", section));
      rows.push(group);
    }
    const row = element("li", "setting-row");
    row.dataset.select = setting.id;
    row.classList.toggle("is-selected", setting.id === selectedId);
    const next = visible[index + 1];
    row.classList.toggle("is-next-selected", next?.id === selectedId && next.master_section === setting.master_section);
    row.classList.toggle("is-group-end", Boolean(next && next.master_section !== setting.master_section));
    const button = element("button");
    button.type = "button";
    button.dataset.setting = setting.id;
    if (setting.id === selectedId) button.setAttribute("aria-current", "page");
    button.append(element("h3", "", setting.title));
    const control = element("label", "completion-control");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.completed = setting.id;
    checkbox.checked = completed[setting.id] === true;
    checkbox.setAttribute("aria-label", text("checkbox")(setting.title));
    const box = element("span", "completion-box");
    box.setAttribute("aria-hidden", "true");
    control.append(checkbox, box);
    row.append(button, control);
    rows.push(row);
  });
  list.replaceChildren(...rows);
  const focusTarget = [...list.querySelectorAll("[data-setting], [data-completed]")].find(node =>
    focusedSetting ? node.dataset.setting === focusedSetting : focusedCompleted && node.dataset.completed === focusedCompleted);
  focusTarget?.focus({ preventScroll: true });
  scroller.scrollTop = scrollTop;
}

function renderDetail(setting) {
  const header = element("header", "detail-header");
  header.dataset.rule = "recommendation";
  const overline = element("p", "detail-overline", setting.master_section);
  const title = element("h2", "", setting.title);
  title.id = "detail-title";
  title.tabIndex = -1;
  const description = element("p", "", setting.description);
  description.id = "detail-description";
  header.append(overline, title, description);

  const comparison = element("section", "detail-section comparison-copy");
  comparison.dataset.rule = "comparison";
  const phases = [];
  for (const phase of ["before", "after"]) {
    const part = element("div", "comparison-state");
    part.append(element("h3", "", setting[phase + "_label"] || text(phase)), element("p", "", setting[phase + "_state"]));
    comparison.append(part);
    phases.push(part);
  }
  const sections = [header, comparison];
  if (setting.visual_demo) {
    const demonstration = element("section", "detail-section");
    demonstration.dataset.rule = "demonstration";
    demonstration.id = "detail-visual-demo";
    const heading = element("div", "visual-demo-heading");
    const controls = element("div");
    controls.append(element("span", "concept-label", text("concept")));
    heading.append(element("h3", "", setting.visual_demo.title || label("visual")), controls);
    const description = element("p", "", setting.visual_demo.description);
    description.id = "detail-visual-demo-description";
    const content = visuals.render(setting.visual_demo, {
      before: setting.before_label || text("before"), after: setting.after_label || text("after"),
    });
    let replayRoot = content;
    if (setting.visual_demo.type === "motion_comparison") {
      const replay = element("button", "visual-demo-motion-control", text("replay"));
      replay.type = "button";
      replay.addEventListener("click", () => visuals.replayAnimations(replayRoot));
      controls.append(document.createTextNode(" "), replay);
    }
    if (content.classList.contains("visual-demo-grid")) {
      // Each state and its illustration belong to the same before/after column.
      // A shared heading introduces the comparison once, above both states.
      comparison.classList.replace("comparison-copy", "comparison-block");
      comparison.id = "detail-visual-demo";
      const overview = element("div", "comparison-heading");
      overview.dataset.rule = "comparison-heading";
      overview.append(heading, description);
      const grid = element("div", "comparison-grid");
      [...content.children].forEach((panel, index) => {
        panel.querySelector(".visual-demo-panel-title")?.remove();
        const caption = panel.querySelector(".visual-demo-caption");
        panel.classList.add("comparison-visual");
        const phase = element("div", "comparison-phase " + (index ? "is-after" : "is-before"));
        phase.append(phases[index], panel);
        if (caption) phase.append(caption);
        grid.append(phase);
      });
      comparison.replaceChildren(overview, grid);
      replayRoot = comparison;
    } else {
      demonstration.classList.add("demonstration-block");
      const overview = element("div", "demonstration-heading");
      overview.dataset.rule = "demonstration-heading";
      overview.append(heading, description);
      demonstration.append(overview, content);
      sections.push(demonstration);
    }
  }

  const instructions = element("section", "detail-section");
  instructions.dataset.rule = "instructions";
  instructions.append(element("h3", "", text("steps")));
  const paths = element("ul", "detail-paths");
  (setting.change_paths || []).forEach(path => {
    const row = element("li");
    path.forEach((step, index) => {
      if (index) row.append(document.createTextNode("  >  "));
      row.append(element("span", "", step));
    });
    paths.append(row);
  });
  instructions.append(paths, listOf(setting.steps));
  for (const [key, heading] of [["prerequisites", "prerequisites"], ["conflicts", "conflicts"]]) {
    if (!setting[key]?.length) continue;
    const notice = element("aside", "detail-notice");
    notice.append(element("h3", "", text(heading)), listOf(setting[key], "ul"));
    instructions.append(notice);
  }
  sections.push(instructions);

  if (setting.shortcut_table?.rows?.length) {
    const section = element("section", "detail-section");
    section.dataset.rule = "shortcuts";
    section.append(element("h3", "", setting.shortcut_table.title));
    const wrap = element("div", "shortcut-table-wrap");
    const table = element("table", "shortcut-table");
    const thead = element("thead");
    const tr = element("tr");
    setting.shortcut_table.headers.forEach(value => { const th = element("th", "", value); th.scope = "col"; tr.append(th); });
    thead.append(tr);
    const tbody = element("tbody");
    setting.shortcut_table.rows.forEach(values => { const row = element("tr"); values.forEach(value => row.append(element("td", "", value))); tbody.append(row); });
    table.append(thead, tbody);
    wrap.append(table);
    section.append(wrap);
    sections.push(section);
  }

  const restore = element("section", "preview-menu");
  const toggle = element("button", "preview-toggle");
  toggle.type = "button";
  toggle.dataset.disclosure = "restore-panel";
  toggle.setAttribute("aria-controls", "restore-panel");
  toggle.setAttribute("aria-expanded", "false");
  toggle.append(element("span", "", label("restore")), element("span", "fold-icon", "+"));
  const panel = element("div", "disclosure-panel");
  panel.id = "restore-panel";
  panel.hidden = true;
  const inner = element("div", "disclosure-content");
  inner.append(listOf(setting.restore_steps));
  panel.append(inner);
  restore.append(toggle, panel);
  sections.push(restore);
  const sources = element("footer", "detail-sources", text("sources"));
  setting.sources.forEach(source => {
    const a = element("a", "", source.label + " ↗");
    a.href = source.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    sources.append(a);
  });
  sections.push(sources);
  detail.replaceChildren(...sections);
  document.title = setting.title + " | " + text("productTitle");
}

function clearFoldAnimations() {
  for (const fold of [...foldAnimations.values()]) fold.finish();
}

function startDemonstration() {
  const pending = pendingDemonstration;
  if (!pending || selectedId !== pending.id) return;
  pendingDemonstration = null;
  pending.animations.forEach(animation => { animation.currentTime = 0; animation.play(); });
}

function navigate(id, { historyAction = "push", animate = true } = {}) {
  const setting = settings.find(item => item.id === id) || settings[0];
  if (!setting) return;
  const compact = view.clientWidth <= 760;
  if (animate && selectedId === setting.id && !viewMotion.active && detail.scrollTop === 0) return;
  const before = animate && selectedId && !compact ? viewMotion.capture("guide", true) : null;
  // Capture the currently painted lines before cancelling an interrupted motion.
  viewMotion.cancel();
  clearFoldAnimations();
  selectedId = setting.id;
  pendingDemonstration = null;
  detail.hidden = false;
  renderList();
  renderDetail(setting);
  // Master retains its reading position. Only Detail resets.
  detail.scrollTop = 0;
  if (historyAction) updateRoute(selectedId, historyAction);
  const demoAnimations = detail.getAnimations({ subtree: true }).filter(animation => animation.animationName?.startsWith("demo-"));
  pendingDemonstration = { id: setting.id, animations: demoAnimations };
  if (before) demoAnimations.forEach(animation => animation.pause());
  const ready = () => {
    if (selectedId !== setting.id) return;
    // Demonstrations start after their explanatory content has appeared.
    startDemonstration();
  };
  if (before) viewMotion.open(before, ready);
  else ready();
}

function togglePanel(button) {
  const panel = document.getElementById(button.dataset.disclosure);
  foldAnimations.get(panel)?.stop();
  const start = panel.hidden ? 0 : panel.getBoundingClientRect().height;
  const open = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(open));
  button.querySelector(".fold-icon").textContent = open ? "−" : "+";
  panel.hidden = false;
  panel.inert = !open;
  panel.style.height = start + "px";
  panel.style.overflow = "hidden";
  const end = open ? panel.firstElementChild.scrollHeight + parseFloat(getComputedStyle(panel).borderTopWidth) : 0;
  let animation = null;
  const finish = () => {
    animation?.cancel();
    panel.hidden = !open;
    panel.inert = !open;
    panel.style.height = "";
    panel.style.overflow = "";
    foldAnimations.delete(panel);
  };
  if (reducedMotion.matches) { finish(); return; }
  animation = panel.animate([{ height: start + "px" }, { height: end + "px" }], { duration: 420, easing: gridMotion.easing, fill: "both" });
  const fold = { finish, stop() {
    // A rapid second click reverses from the currently painted height.
    panel.style.height = panel.getBoundingClientRect().height + "px";
    animation.cancel();
    foldAnimations.delete(panel);
  } };
  foldAnimations.set(panel, fold);
  animation.finished.then(() => { if (foldAnimations.get(panel) === fold) finish(); }).catch(() => {});
}

async function load() {
  const version = ++loadingVersion;
  window.demoReady = false;
  status.hidden = false;
  status.textContent = label("loading");
  $("#retry").hidden = true;
  try {
    const response = await fetch("./data/" + (language === "en" ? "settings.en.json" : "settings.json"), { cache: "no-cache" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (version !== loadingVersion) return;
    const ids = new Set();
    if (!Array.isArray(data)) throw new Error("Settings must be an array");
    for (const item of data) {
      if (!item.id || !item.title || ids.has(item.id)) throw new Error("Missing or duplicate setting identity");
      ids.add(item.id);
    }
    const order = new Map();
    data.forEach(setting => { if (!order.has(setting.master_section)) order.set(setting.master_section, order.size); });
    settings = data.sort((a, b) => order.get(a.master_section) - order.get(b.master_section) || a.master_order - b.master_order);
    status.hidden = true;
    navigate(new URL(location.href).searchParams.get("setting"), { historyAction: "replace", animate: false });
    window.demoReady = true;
  } catch (error) {
    if (version !== loadingVersion) return;
    status.hidden = false;
    status.textContent = label("error");
    $("#retry").hidden = false;
    console.error(error);
  }
}

document.addEventListener("click", async event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.setting) navigate(button.dataset.setting);
  else if (button.hasAttribute("data-disclosure")) togglePanel(button);
  else if (button.id === "clear-search") { search.value = ""; renderList(); search.focus(); }
  else if (button.id === "retry") load();
  else if (button.dataset.language && language !== button.dataset.language) {
    viewMotion.cancel();
    language = button.dataset.language;
    saveStorage(LANGUAGE_KEY, language);
    search.value = "";
    applyLanguage();
    updateRoute(selectedId, "replace");
    await load();
  }
});
list.addEventListener("change", event => {
  const checkbox = event.target.closest("[data-completed]");
  if (!checkbox) return;
  completed[checkbox.dataset.completed] = checkbox.checked;
  saveStorage(STORAGE_KEY, JSON.stringify(completed));
});
search.addEventListener("focus", () => { search.placeholder = ""; });
search.addEventListener("click", () => { search.placeholder = ""; });
search.addEventListener("blur", () => { search.placeholder = label("search"); });
search.addEventListener("input", () => {
  viewMotion.cancel();
  startDemonstration();
  renderList();
});
window.addEventListener("popstate", () => {
  const routeLanguage = new URL(location.href).searchParams.get("lang");
  if (languages.has(routeLanguage) && routeLanguage !== language) { language = routeLanguage; applyLanguage(); load(); }
  else navigate(new URL(location.href).searchParams.get("setting"), { historyAction: null });
});
window.addEventListener("resize", () => { clearFoldAnimations(); startDemonstration(); });
detail.addEventListener("scroll", () => {
  if (!viewMotion.active) startDemonstration();
}, { passive: true });
reducedMotion.addEventListener("change", () => { viewMotion.cancel(); clearFoldAnimations(); startDemonstration(); });
applyLanguage();
load();
