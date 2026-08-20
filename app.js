const listElement = document.querySelector("#settings-list");
const overviewElement = document.querySelector("#settings-overview");
const productTitleElement = document.querySelector("#product-title");
const productTaglineElement = document.querySelector("#product-tagline");
const languageButtons = document.querySelectorAll("[data-language]");
const statusElement = document.querySelector("#status");
const searchElement = document.querySelector("#setting-search");
const retryLoadButtonElement = document.querySelector("#retry-load-button");
const searchEmptyStateElement = document.querySelector("#search-empty-state");
const clearSearchButtonElement = document.querySelector("#clear-search-button");
const searchEmptyMessageElement = document.querySelector("#search-empty-message");
const introductionElement = document.querySelector("#guide-introduction");
const introTitleElement = document.querySelector("#intro-title");
const introDescriptionElement = document.querySelector("#intro-description");
const introPointWorkflowElement = document.querySelector("#intro-point-workflow");
const introPointCheckElement = document.querySelector("#intro-point-check");
const introPointStorageElement = document.querySelector("#intro-point-storage");
const introPointScopeElement = document.querySelector("#intro-point-scope");
const detailElement = document.querySelector("#setting-detail");
const detailTitleElement = document.querySelector("#detail-title");
const detailDescriptionElement = document.querySelector("#detail-description");
const detailBeforeLabelElement = document.querySelector("#detail-before-label");
const detailBeforeStateElement = document.querySelector("#detail-before-state");
const detailAfterLabelElement = document.querySelector("#detail-after-label");
const detailAfterStateElement = document.querySelector("#detail-after-state");
const detailVisualDemoElement = document.querySelector("#detail-visual-demo");
const detailVisualDemoTitleElement = document.querySelector("#detail-visual-demo-title");
const detailVisualDemoDescriptionElement = document.querySelector("#detail-visual-demo-description");
const detailVisualDemoContentElement = document.querySelector("#detail-visual-demo-content");
const detailVisualDemoMotionControlElement = document.querySelector("#detail-visual-demo-motion-control");
const detailChangePathsElement = document.querySelector("#detail-change-paths");
const detailPrerequisitesElement = document.querySelector("#detail-prerequisites");
const detailPrerequisitesListElement = document.querySelector("#detail-prerequisites-list");
const detailConflictsElement = document.querySelector("#detail-conflicts");
const detailConflictsListElement = document.querySelector("#detail-conflicts-list");
const detailStepsElement = document.querySelector("#detail-steps");
const detailRestoreStepsElement = document.querySelector("#detail-restore-steps");
const detailSourceLinksElement = document.querySelector("#detail-source-links");
const conceptLabelElement = document.querySelector("#concept-label");
const prerequisitesHeadingElement = document.querySelector("#prerequisites-heading");
const conflictsHeadingElement = document.querySelector("#conflicts-heading");
const pathHeadingElement = document.querySelector("#path-heading");
const stepsHeadingElement = document.querySelector("#steps-heading");
const restoreHeadingElement = document.querySelector("#restore-heading");
const STORAGE_KEY = "mac-setup-completed-v1";
const LANGUAGE_STORAGE_KEY = "mac-setup-language-v1";
const SUPPORTED_LANGUAGES = new Set(["zh-CN", "en"]);
const UI_TEXT = {
  "zh-CN": {
    productTitle: "MacBook 设置建议",
    tagline: "理解变化，手动调整，需要时恢复原状",
    search: "搜索 MacBook 设置建议",
    noResults: "没有找到相关设置",
    clearSearch: "清除搜索",
    retry: "重新加载",
    loadError: "设置读取失败。请通过项目提供的本地服务器或在线网页打开，而不是直接双击 index.html。",
    introTitle: "从左侧选择一项设置",
    introDescription: "这份指南聚焦访达、系统设置与实用工具。每项都说明可见变化、修改路径和恢复方法。",
    introWorkflow: "根据自己的工作习惯决定是否采用，不把建议当作统一答案。",
    introCheck: "左栏方框表示“已处理”：你已经修改，或阅读后决定保留原状态。",
    introStorage: "进度只保存在当前浏览器，不会同步到其他设备。",
    introScope: "画面是概念示意；设置名称与位置可能随 macOS 更新而变化。",
    before: "修改前",
    after: "修改后",
    concept: "概念示意",
    replay: "重新播放",
    prerequisites: "开始前",
    conflicts: "注意",
    path: "修改路径",
    steps: "如何修改",
    restore: "如何恢复？",
    sources: "来源",
    ungrouped: "未分组",
    checkbox: (title) => `标记“${title}”已处理`,
    saveError: "进度暂时无法保存；本次选择可能在刷新后丢失。",
    unsupportedVisual: "暂无视觉示意",
    projectMaterials: "项目素材",
    folders: ["01 研究", "02 设计", "03 交付"],
    pathVisible: "Macintosh HD  ›  用户  ›  项目  ›  素材",
    pathHidden: "路径栏隐藏",
    exampleFilesBefore: ["再造怡园", "Special guest menu", "自我介绍"],
    exampleFilesAfter: ["再造怡园.txt", "Special guest menu.pdf", "自我介绍.mov"],
    sameDistance: "相同手指距离",
    slow: "慢",
    lower: "较低",
    suggestedSpeed: "倒数第三格",
    fast: "快",
    dockBefore: "前三个为固定 App；分隔线后为建议或最近使用的 App",
    dockAfter: "仅保留你固定放置的 App",
    window: "窗口",
    hotDesktopTitle: "右下角：显示桌面并带文件返回",
    desktop: "桌面",
    currentApp: "当前 App",
    dropHere: "将文件放在这里",
    bottomRight: "右下角",
    hotSleepTitle: "Command + 右上角：使显示器进入睡眠",
    holdCommand: "按住 Command",
    display: "显示器",
    topRight: "右上角",
    sleeping: "进入睡眠",
    settingsApp: "系统设置",
  },
  en: {
    productTitle: "MacBook Setup Recommendations",
    tagline: "Understand the change, adjust it manually, and restore it when needed",
    search: "Search MacBook setup recommendations",
    noResults: "No matching settings",
    clearSearch: "Clear search",
    retry: "Reload",
    loadError: "Settings could not be loaded. Open this project through its local server or a hosted site instead of double-clicking index.html.",
    introTitle: "Choose a setting from the sidebar",
    introDescription: "This guide covers Finder, System Settings, and practical Mac utilities. Each item explains the visible change, where to find it, and how to restore it.",
    introWorkflow: "Decide whether each recommendation fits your workflow; these are not universal defaults.",
    introCheck: "A sidebar checkbox means handled: you changed the setting or reviewed it and kept the original state.",
    introStorage: "Progress stays in this browser and is not synced to other devices.",
    introScope: "Visuals are conceptual. Setting names and locations may change with macOS updates.",
    before: "Before",
    after: "After",
    concept: "Concept visual",
    replay: "Replay",
    prerequisites: "Before you start",
    conflicts: "Note",
    path: "Where to find it",
    steps: "How to change it",
    restore: "How to restore it",
    sources: "Sources",
    ungrouped: "Ungrouped",
    checkbox: (title) => `Mark “${title}” as handled`,
    saveError: "Progress could not be saved. This selection may be lost after a refresh.",
    unsupportedVisual: "No visual available",
    projectMaterials: "Project Assets",
    folders: ["01 Research", "02 Design", "03 Delivery"],
    pathVisible: "Macintosh HD  ›  Users  ›  Projects  ›  Assets",
    pathHidden: "Path bar hidden",
    exampleFilesBefore: ["Yiyuan Redesign", "Special guest menu", "Introduction"],
    exampleFilesAfter: ["Yiyuan Redesign.txt", "Special guest menu.pdf", "Introduction.mov"],
    sameDistance: "Same finger movement",
    slow: "Slow",
    lower: "Lower",
    suggestedSpeed: "Third from right",
    fast: "Fast",
    dockBefore: "The first three apps are pinned; suggested or recent apps appear after the divider",
    dockAfter: "Only the apps you pinned remain",
    window: "Window",
    hotDesktopTitle: "Bottom-right: show the desktop and bring a file back",
    desktop: "Desktop",
    currentApp: "Current App",
    dropHere: "Drop a file here",
    bottomRight: "Bottom-right",
    hotSleepTitle: "Command + top-right: put the display to sleep",
    holdCommand: "Hold Command",
    display: "Display",
    topRight: "Top-right",
    sleeping: "Sleeping",
    settingsApp: "System Settings",
  },
};

let selectedSetting = null;
let allSettings = [];
let searchTerm = "";
let activeLanguage = getInitialLanguage();
let completedBySettingId = loadCompletedState();
let detailTransitionTimer = null;

languageButtons.forEach((button) => {
  button.addEventListener("click", () => changeLanguage(button.dataset.language));
});

detailVisualDemoMotionControlElement.addEventListener("click", () => {
  const currentVisual = detailVisualDemoContentElement.firstElementChild;
  if (!currentVisual) {
    return;
  }
  detailVisualDemoContentElement.replaceChildren(currentVisual.cloneNode(true));
});

searchElement.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  const visibleSettings = getVisibleSettings();

  if (selectedSetting && !visibleSettings.some((setting) => setting.id === selectedSetting.id)) {
    showList({ replaceHistory: true });
    return;
  }

  renderList(visibleSettings);
  syncSelectedListItem();
});

retryLoadButtonElement.addEventListener("click", () => window.location.reload());

clearSearchButtonElement.addEventListener("click", () => {
  searchElement.value = "";
  searchTerm = "";
  renderList(getVisibleSettings());
  searchElement.focus();
});

window.addEventListener("popstate", () => {
  const routeLanguage = new URLSearchParams(window.location.search).get("lang");
  if (SUPPORTED_LANGUAGES.has(routeLanguage) && routeLanguage !== activeLanguage) {
    activeLanguage = routeLanguage;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLanguage);
    applyInterfaceLanguage();
    loadSettings({ preserveRoute: true });
    return;
  }

  const settingFromUrl = getSettingFromUrl();

  if (settingFromUrl) {
    if (!getVisibleSettings().some((setting) => setting.id === settingFromUrl.id)) {
      searchElement.value = "";
      searchTerm = "";
      renderList(getVisibleSettings());
    }
    showDetail(settingFromUrl, { pushHistory: false });
    return;
  }

  showList();
});

async function loadSettings({ preserveRoute = false } = {}) {
  try {
    const dataFile = activeLanguage === "en" ? "settings.en.json" : "settings.json";
    const response = await fetch(`./data/${dataFile}`);

    if (!response.ok) {
      throw new Error(`Settings request failed: ${response.status}`);
    }

    allSettings = await response.json();
    validateSettings(allSettings);
    pruneCompletedState();
    statusElement.hidden = true;
    retryLoadButtonElement.hidden = true;
    if (preserveRoute) {
      const settingFromUrl = getSettingFromUrl();
      renderList(getVisibleSettings());
      if (settingFromUrl) {
        showDetail(settingFromUrl, { pushHistory: false });
      } else {
        showList();
      }
    } else {
      initializeRoute();
    }
  } catch (error) {
    statusElement.textContent = textFor("loadError");
    statusElement.hidden = false;
    retryLoadButtonElement.hidden = false;
    console.error(error);
  }
}

function getInitialLanguage() {
  const routeLanguage = new URLSearchParams(window.location.search).get("lang");
  if (SUPPORTED_LANGUAGES.has(routeLanguage)) {
    return routeLanguage;
  }

  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (SUPPORTED_LANGUAGES.has(savedLanguage)) {
    return savedLanguage;
  }

  return "zh-CN";
}

function textFor(key) {
  return UI_TEXT[activeLanguage][key];
}

function applyInterfaceLanguage() {
  document.documentElement.lang = activeLanguage;
  productTitleElement.textContent = textFor("productTitle");
  productTaglineElement.textContent = textFor("tagline");
  searchElement.placeholder = textFor("search");
  searchElement.setAttribute("aria-label", textFor("search"));
  retryLoadButtonElement.textContent = textFor("retry");
  searchEmptyMessageElement.textContent = textFor("noResults");
  clearSearchButtonElement.textContent = textFor("clearSearch");
  introTitleElement.textContent = textFor("introTitle");
  introDescriptionElement.textContent = textFor("introDescription");
  introPointWorkflowElement.textContent = textFor("introWorkflow");
  introPointCheckElement.textContent = textFor("introCheck");
  introPointStorageElement.textContent = textFor("introStorage");
  introPointScopeElement.textContent = textFor("introScope");
  conceptLabelElement.textContent = textFor("concept");
  detailVisualDemoMotionControlElement.textContent = textFor("replay");
  prerequisitesHeadingElement.textContent = textFor("prerequisites");
  conflictsHeadingElement.textContent = textFor("conflicts");
  pathHeadingElement.textContent = textFor("path");
  stepsHeadingElement.textContent = textFor("steps");
  restoreHeadingElement.textContent = textFor("restore");
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === activeLanguage));
  });
}

async function changeLanguage(language) {
  if (!SUPPORTED_LANGUAGES.has(language) || language === activeLanguage) {
    return;
  }

  activeLanguage = language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLanguage);
  searchTerm = "";
  searchElement.value = "";
  applyInterfaceLanguage();
  updateRoute({ settingId: selectedSetting?.id ?? null, replace: true });
  await loadSettings({ preserveRoute: true });
}

function getVisibleSettings() {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return allSettings.filter((setting) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = getSearchableText([
      setting.title,
      setting.description,
      setting.before_state,
      setting.after_state,
      setting.change_paths,
      setting.steps,
      setting.restore_steps,
      setting.prerequisites,
      setting.conflicts,
      setting.search_keywords,
    ]).toLowerCase();

    return matchesSearch(searchableText, normalizedSearchTerm);
  });
}

function matchesSearch(searchableText, normalizedSearchTerm) {
  if (/^[a-z0-9]{1,3}$/.test(normalizedSearchTerm)) {
    const escapedTerm = normalizedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const shortWordPattern = new RegExp(`(^|[^a-z0-9])${escapedTerm}($|[^a-z0-9])`);
    return shortWordPattern.test(searchableText);
  }

  return searchableText.includes(normalizedSearchTerm);
}

function getSearchableText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((item) => getSearchableText(item)).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => getSearchableText(item))
      .join(" ");
  }

  return String(value);
}

function renderList(settings) {
  searchEmptyStateElement.hidden = settings.length > 0;
  const masterSections = groupSettingsByMasterSection(settings);
  const sectionElements = masterSections.map((section) => {
    const sectionItem = document.createElement("li");
    sectionItem.className = "master-area";

    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "master-area-title";
    sectionTitle.textContent = section.title;

    const settingList = document.createElement("ul");
    settingList.className = "master-setting-items";
    section.settings.forEach((setting) => settingList.append(createMasterItem(setting)));

    sectionItem.append(sectionTitle, settingList);
    return sectionItem;
  });

  listElement.replaceChildren(...sectionElements);
}

function validateSettings(settings) {
  if (!Array.isArray(settings)) {
    throw new Error("设置数据根节点必须是数组。");
  }

  const settingIds = new Set();
  settings.forEach((setting, index) => {
    if (!setting || typeof setting !== "object") {
      throw new Error(`第 ${index + 1} 条设置不是对象。`);
    }
    if (typeof setting.id !== "string" || !setting.id.trim() || settingIds.has(setting.id)) {
      throw new Error(`第 ${index + 1} 条设置缺少唯一 id。`);
    }
    if (typeof setting.title !== "string" || !setting.title.trim()) {
      throw new Error(`${setting.id} 缺少标题。`);
    }
    ["change_paths", "steps", "restore_steps"].forEach((fieldName) => {
      if (!Array.isArray(setting[fieldName])) {
        throw new Error(`${setting.id} 的 ${fieldName} 必须是数组。`);
      }
    });
    if (!Array.isArray(setting.sources) || setting.sources.length === 0) {
      throw new Error(`${setting.id} 缺少结构化来源。`);
    }
    setting.sources.forEach((source) => {
      if (!source?.label || !/^https:\/\//.test(source.url || "")) {
        throw new Error(`${setting.id} 包含无效来源。`);
      }
    });
    settingIds.add(setting.id);
  });
}

function groupSettingsByMasterSection(settings) {
  const sections = [];

  settings.forEach((setting) => {
    const sectionTitle = setting.master_section || textFor("ungrouped");

    let section = sections.find((candidate) => candidate.title === sectionTitle);
    if (!section) {
      section = { title: sectionTitle, settings: [] };
      sections.push(section);
    }

    section.settings.push(setting);
  });

  sections.forEach((section) => {
    section.settings.sort((first, second) => first.master_order - second.master_order);
  });

  return sections;
}

function createMasterItem(setting) {
  const listItem = document.createElement("li");
  listItem.className = "master-item";
  listItem.dataset.settingId = setting.id;
  listItem.classList.toggle("is-selected", selectedSetting?.id === setting.id);

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = setting.title;
  button.addEventListener("click", () => showDetail(setting));

  const completionCheckbox = document.createElement("input");
  completionCheckbox.type = "checkbox";
  completionCheckbox.checked = completedBySettingId[setting.id] === true;
  completionCheckbox.dataset.settingId = setting.id;
  completionCheckbox.setAttribute("aria-label", textFor("checkbox")(setting.title));
  completionCheckbox.addEventListener("change", (event) => {
    completedBySettingId[setting.id] = event.target.checked;
    saveCompletedState();
    syncCompletionControls();
  });

  const completionControl = document.createElement("label");
  completionControl.className = "completion-control";
  completionControl.title = textFor("checkbox")(setting.title);
  completionControl.append(completionCheckbox);

  listItem.append(button, completionControl);
  return listItem;
}

function pruneCompletedState() {
  const currentSettingIds = new Set(allSettings.map((setting) => setting.id));
  const currentStateEntries = Object.entries(completedBySettingId);
  const validStateEntries = currentStateEntries.filter(([settingId]) => currentSettingIds.has(settingId));

  if (validStateEntries.length === currentStateEntries.length) {
    return;
  }

  completedBySettingId = Object.fromEntries(validStateEntries);
  saveCompletedState();
}

function loadCompletedState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) {
      return {};
    }
    const parsedState = JSON.parse(savedState);
    if (!parsedState || typeof parsedState !== "object" || Array.isArray(parsedState)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsedState).filter(([, value]) => typeof value === "boolean"),
    );
  } catch (error) {
    console.warn("完成状态读取失败，将从空状态开始。", error);
    return {};
  }
}

function saveCompletedState() {
  try {
    const stateAsText = JSON.stringify(completedBySettingId);
    localStorage.setItem(STORAGE_KEY, stateAsText);
  } catch (error) {
    statusElement.textContent = textFor("saveError");
    statusElement.hidden = false;
    console.warn("完成状态保存失败。", error);
  }
}

function showList({ replaceHistory = false } = {}) {
  window.clearTimeout(detailTransitionTimer);
  selectedSetting = null;
  overviewElement.hidden = false;
  introductionElement.hidden = false;
  detailElement.hidden = true;
  detailElement.removeAttribute("aria-busy");

  if (replaceHistory) {
    updateRoute({ settingId: null, replace: true });
  }

  renderList(getVisibleSettings());
  document.title = textFor("productTitle");
}

function showDetail(setting, { pushHistory = true } = {}) {
  if (pushHistory && selectedSetting?.id === setting.id) {
    detailElement.scrollTop = 0;
    return;
  }
  selectedSetting = setting;

  if (pushHistory) {
    updateRoute({ settingId: selectedSetting.id });
  }

  overviewElement.hidden = false;
  introductionElement.hidden = true;
  detailElement.hidden = false;
  syncSelectedListItem();
  detailElement.setAttribute("aria-busy", "true");
  window.clearTimeout(detailTransitionTimer);

  const renderSelectedDetail = () => {
    if (selectedSetting?.id !== setting.id) {
      return;
    }

    renderDetailContent(setting);
    detailElement.removeAttribute("aria-busy");
  };

  detailTransitionTimer = window.setTimeout(renderSelectedDetail, 180);
}

function renderDetailContent(setting) {
  detailTitleElement.textContent = setting.title;
  detailDescriptionElement.textContent = setting.description;
  detailBeforeLabelElement.textContent = setting.before_label || textFor("before");
  detailBeforeStateElement.textContent = formatDetailValue(setting.before_state);
  detailAfterLabelElement.textContent = setting.after_label || textFor("after");
  detailAfterStateElement.textContent = formatDetailValue(setting.after_state);
  renderVisualDemo(setting.visual_demo, {
    beforeLabel: setting.before_label || textFor("before"),
    afterLabel: setting.after_label || textFor("after"),
  });
  renderOptionalList(detailPrerequisitesElement, detailPrerequisitesListElement, setting.prerequisites);
  renderOptionalList(detailConflictsElement, detailConflictsListElement, setting.conflicts);
  renderChangePaths(setting.change_paths);
  renderDetailList(detailStepsElement, setting.steps);
  renderDetailList(detailRestoreStepsElement, setting.restore_steps);
  renderSources(setting.sources);
  detailElement.scrollTop = 0;
  document.title = `${setting.title} | ${textFor("productTitle")}`;
}

function renderOptionalList(sectionElement, listElement, values) {
  const hasValues = Array.isArray(values) && values.length > 0;
  sectionElement.hidden = !hasValues;
  renderDetailList(listElement, hasValues ? values : []);
}

function renderSources(sources) {
  const sourceNodes = [];
  sources.forEach((source, index) => {
    if (index > 0) {
      sourceNodes.push(document.createTextNode(" · "));
    }
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = source.label;
    sourceNodes.push(link);
  });

  const sourceSeparator = activeLanguage === "zh-CN" ? "：" : ": ";
  detailSourceLinksElement.replaceChildren(document.createTextNode(`${textFor("sources")}${sourceSeparator}`), ...sourceNodes);
}

function getSettingFromUrl() {
  const settingId = new URLSearchParams(window.location.search).get("setting");
  return allSettings.find((setting) => setting.id === settingId) ?? null;
}

function initializeRoute() {
  const settingFromUrl = getSettingFromUrl();

  if (settingFromUrl) {
    updateRoute({ settingId: settingFromUrl.id, replace: true });
    renderList(getVisibleSettings());
    showDetail(settingFromUrl, { pushHistory: false });
    return;
  }

  updateRoute({ settingId: null, replace: true });
  showList();
}

function updateRoute({ settingId = null, replace = false } = {}) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", activeLanguage);
  if (settingId) {
    url.searchParams.set("setting", settingId);
  } else {
    url.searchParams.delete("setting");
  }

  const state = settingId ? { route: "detail", settingId } : { route: "list" };
  history[replace ? "replaceState" : "pushState"](state, "", `${url.pathname}${url.search}`);
}

function renderChangePaths(paths) {
  const pathItems = paths.map((path) => {
    const listItem = document.createElement("li");
    listItem.className = "change-path";

    path.forEach((step, index) => {
      const pathStep = document.createElement("span");
      pathStep.className = "change-path-step";
      pathStep.textContent = step;
      listItem.append(pathStep);

      if (index < path.length - 1) {
        const separator = document.createElement("span");
        separator.className = "change-path-separator";
        separator.textContent = ">";
        listItem.append(separator);
      }
    });

    return listItem;
  });

  detailChangePathsElement.replaceChildren(...pathItems);
}

function renderVisualDemo(visualDemo, labels = {}) {
  if (!visualDemo) {
    detailVisualDemoElement.hidden = true;
    detailVisualDemoMotionControlElement.hidden = true;
    detailVisualDemoContentElement.replaceChildren();
    return;
  }

  detailVisualDemoElement.hidden = false;
  detailVisualDemoTitleElement.textContent = visualDemo.title;
  detailVisualDemoDescriptionElement.textContent = visualDemo.description;
  detailVisualDemoMotionControlElement.hidden = !["motion_comparison", "workflow"].includes(visualDemo.type);

  if (visualDemo.type === "official_reference") {
    detailVisualDemoContentElement.replaceChildren(createOfficialReferenceVisual(visualDemo));
    return;
  }

  if (visualDemo.type === "workflow") {
    detailVisualDemoContentElement.replaceChildren(createWorkflowVisual(visualDemo));
    return;
  }

  const grid = document.createElement("div");
  grid.className = "visual-demo-grid";

  if (visualDemo.variant === "folders-on-top") {
    grid.append(
      createVisualDemoPanel(labels.beforeLabel || textFor("before"), visualDemo.before_rows),
      createVisualDemoPanel(labels.afterLabel || textFor("after"), visualDemo.after_rows, { isAfter: true }),
    );
  } else {
    grid.append(
      createVisualScenePanel(labels.beforeLabel || textFor("before"), visualDemo, "before"),
      createVisualScenePanel(labels.afterLabel || textFor("after"), visualDemo, "after", { isAfter: true }),
    );
  }

  detailVisualDemoContentElement.replaceChildren(grid);
}

function createVisualScenePanel(title, visualDemo, phase, { isAfter = false } = {}) {
  const panel = document.createElement("section");
  panel.className = "visual-demo-panel visual-scene-panel";
  panel.classList.toggle("is-after", isAfter);

  const panelTitle = createDemoElement("p", "visual-demo-panel-title", title);
  const scene = createVisualScene(visualDemo.variant, phase);
  const caption = createDemoElement(
    "p",
    "visual-demo-caption",
    phase === "before" ? visualDemo.before_caption : visualDemo.after_caption,
  );

  panel.append(panelTitle, scene, caption);
  return panel;
}

function createWorkflowVisual(visualDemo) {
  const workflow = document.createElement("section");
  workflow.className = `workflow-visual workflow-${visualDemo.variant}`;
  workflow.append(createVisualScene(visualDemo.variant, "workflow"));
  workflow.append(createDemoElement("p", "workflow-primary-caption", visualDemo.primary_caption));
  workflow.append(createDemoElement("p", "workflow-secondary-caption", visualDemo.secondary_caption));
  return workflow;
}

function createOfficialReferenceVisual(visualDemo) {
  const figure = document.createElement("figure");
  figure.className = "official-reference-visual";
  const image = document.createElement("img");
  image.src = visualDemo.image_src;
  image.alt = visualDemo.alt;
  const caption = createDemoElement("figcaption", "official-reference-caption", visualDemo.caption);
  figure.append(image, caption);
  return figure;
}

function createVisualScene(variant, phase) {
  const scene = document.createElement("div");
  scene.className = `demo-scene demo-${variant} is-${phase}`;
  scene.setAttribute("aria-hidden", "true");

  const sceneBuilders = {
    "finder-path-bar": createFinderPathScene,
    "file-extensions": createFileExtensionsScene,
    "tap-to-click": createTapToClickScene,
    "tracking-speed": createTrackingSpeedScene,
    "dock-recents": createDockRecentsScene,
    "dock-minimize": createDockMinimizeScene,
    "hot-corners": createHotCornersScene,
    "input-source-by-document": createInputSourceScene,
    "watch-unlock": createWatchUnlockScene,
    "three-finger-drag": createThreeFingerDragScene,
  };

  const builder = sceneBuilders[variant];
  if (!builder) {
    scene.append(createDemoElement("span", "demo-unsupported", textFor("unsupportedVisual")));
    return scene;
  }

  builder(scene, phase);
  return scene;
}

function createFinderPathScene(scene, phase) {
  const windowMock = createDemoElement("div", "demo-window");
  const toolbar = createDemoElement("div", "demo-window-toolbar");
  toolbar.append(createDemoElement("span", "demo-window-dot"), createDemoElement("span", "demo-window-title", textFor("projectMaterials")));

  const body = createDemoElement("div", "demo-finder-body");
  textFor("folders").forEach((name) => {
    const folder = createDemoElement("span", "demo-finder-folder", name);
    body.append(folder);
  });

  const path = createDemoElement(
    "div",
    `demo-path-bar ${phase === "after" ? "is-visible" : "is-hidden"}`,
    phase === "after" ? textFor("pathVisible") : textFor("pathHidden"),
  );
  windowMock.append(toolbar, body, path);
  scene.append(windowMock);
}

function createFileExtensionsScene(scene, phase) {
  const names = phase === "after" ? textFor("exampleFilesAfter") : textFor("exampleFilesBefore");
  const kinds = ["text", "pdf", "video"];
  const list = createDemoElement("div", "demo-file-list");
  names.forEach((name, index) => {
    const row = createDemoElement("div", "demo-file-row");
    row.append(createFileIcon(kinds[index]));
    row.append(createDemoElement("span", "demo-file-name", name));
    list.append(row);
  });
  scene.append(list);
}

function createTapToClickScene(scene, phase) {
  const trackpad = createDemoElement("div", "demo-trackpad");
  const finger = createDemoElement("span", "demo-finger");
  const ripple = createDemoElement("span", "demo-click-ripple");
  const label = createDemoElement("span", "demo-action-label", phase === "after" ? "仅需轻触" : "需要压力");
  trackpad.append(finger, ripple);
  scene.append(trackpad, label, createDemoElement("span", "demo-result-pill", "✓ 已选择"));
}

function createTrackingSpeedScene(scene, phase) {
  const gestureTrack = createDemoElement("div", "demo-gesture-track");
  gestureTrack.append(createDemoElement("span", "demo-gesture-finger"));
  const screenTrack = createDemoElement("div", "demo-screen-track");
  screenTrack.append(
    createDemoElement("span", "demo-pointer-start"),
    createDemoElement("span", "demo-pointer-end"),
    createDemoElement("span", "demo-pointer", "➤"),
  );
  const scale = createDemoElement("div", "demo-speed-scale");
  scale.append(createDemoElement("span", "", textFor("slow")), createDemoElement("span", "", phase === "after" ? textFor("suggestedSpeed") : textFor("lower")), createDemoElement("span", "", textFor("fast")));
  scene.append(createDemoElement("span", "demo-track-label", textFor("sameDistance")), gestureTrack, screenTrack, scale);
}

function createDockRecentsScene(scene, phase) {
  const dock = createDemoElement("div", "demo-dock");
  const fixedApps = ["app-store", "pages", "keynote"];
  fixedApps.forEach((app) => dock.append(createDockAppIcon(app)));
  if (phase === "before") {
    const separator = createDemoElement("span", "demo-dock-separator");
    separator.setAttribute("role", "separator");
    dock.append(separator);
    ["safari", "settings"].forEach((app) => dock.append(createDockAppIcon(app)));
  }
  scene.append(dock, createDemoElement("span", "demo-dock-note", phase === "before" ? textFor("dockBefore") : textFor("dockAfter")));
}

function createDockMinimizeScene(scene, phase) {
  const desktop = createDemoElement("div", "demo-mini-desktop");
  [1, 2, 3].forEach((number) => desktop.append(createDemoElement("span", `demo-mini-window window-${number}`, `${textFor("window")} ${number}`)));
  const dock = createDemoElement("div", "demo-mini-dock");
  const appIcon = createDemoElement("span", "demo-mini-app", "A");
  dock.append(appIcon);
  if (phase === "before") {
    [1, 2, 3].forEach((number) => dock.append(createDemoElement("span", `demo-window-thumb thumb-${number}`, String(number))));
  } else {
    appIcon.append(createDemoElement("span", "demo-window-count", "3"));
  }
  desktop.append(dock);
  scene.append(desktop);
}

function createHotCornersScene(scene) {
  const desktopBlock = createDemoElement("section", "demo-hot-animation-block");
  desktopBlock.append(createDemoElement("p", "demo-hot-animation-title", textFor("hotDesktopTitle")));
  const screen = createDemoElement("div", "demo-hot-corner-screen");
  const desktop = createDemoElement("div", "demo-hot-desktop");
  desktop.append(createDemoElement("span", "demo-hot-desktop-label", textFor("desktop")), createDemoElement("span", "demo-hot-desktop-file", textFor("exampleFilesAfter")[0]));
  const app = createDemoElement("div", "demo-hot-app");
  app.append(createDemoElement("span", "demo-hot-app-title", textFor("currentApp")), createDemoElement("span", "demo-hot-upload-zone", textFor("dropHere")));
  const cursor = createMacSystemCursor("demo-hot-cursor");
  const draggedFile = createDemoElement("span", "demo-hot-dragged-file", textFor("exampleFilesAfter")[0]);
  const corner = createDemoElement("span", "demo-hot-corner", textFor("bottomRight"));
  screen.append(desktop, app, draggedFile, cursor, corner);
  desktopBlock.append(screen);

  const sleepBlock = createDemoElement("section", "demo-hot-animation-block");
  sleepBlock.append(createDemoElement("p", "demo-hot-animation-title", textFor("hotSleepTitle")));
  const sleep = createDemoElement("div", "demo-hot-sleep");
  const command = createDemoElement("span", "demo-hot-sleep-command");
  command.append(createDemoElement("kbd", "demo-command-key", "⌘"), createDemoElement("span", "", textFor("holdCommand")));
  const sleepScreen = createDemoElement("div", "demo-hot-sleep-screen");
  sleepScreen.append(createDemoElement("span", "demo-hot-sleep-title", textFor("display")), createDemoElement("span", "demo-hot-sleep-corner", textFor("topRight")), createMacSystemCursor("demo-hot-sleep-cursor"), createDemoElement("span", "demo-hot-sleep-state", textFor("sleeping")));
  sleep.append(command, createDemoElement("span", "demo-sleep-arrow", "→"), sleepScreen);
  sleepBlock.append(sleep);

  scene.append(desktopBlock, sleepBlock);
}

function createInputSourceScene(scene, phase) {
  const documents = createDemoElement("div", "demo-documents");
  const chinese = createDemoElement("div", "demo-document doc-cn");
  chinese.append(createDemoElement("span", "demo-document-title", "再造怡园"), createDemoElement("span", "demo-document-sample", "你好"), createDemoElement("span", "demo-document-input", "拼音"));
  const english = createDemoElement("div", "demo-document doc-en");
  english.append(createDemoElement("span", "demo-document-title", "Special guest menu"), createDemoElement("span", "demo-document-sample", phase === "after" ? "Hello" : "你好"), createDemoElement("span", "demo-document-input", phase === "after" ? "ABC" : "拼音"));
  documents.append(chinese, english);
  scene.append(documents);
}

function createWatchUnlockScene(scene) {
  const flow = createDemoElement("div", "demo-watch-flow");
  const watch = createDemoElement("div", "demo-watch-device");
  watch.append(createDemoElement("span", "demo-watch-check", "✓"));
  const waves = createDemoElement("div", "demo-proximity-waves", ")))");
  const mac = createDemoElement("div", "demo-mac-device");
  const lockState = createDemoElement("span", "demo-lock-state");
  lockState.append(createDemoElement("span", "demo-lock-glyph"));
  mac.append(lockState, createDemoElement("span", "demo-unlock-state", "✓"));
  flow.append(watch, waves, mac);
  scene.append(flow);
}

function createThreeFingerDragScene(scene, phase) {
  const stage = createDemoElement("div", `demo-three-finger-stage ${phase === "after" ? "is-three-finger" : "is-press-drag"}`);
  const trackpad = createDemoElement("div", "demo-drag-trackpad");
  const touchGroup = createDemoElement("div", "demo-drag-touch-group");
  const fingerCount = phase === "after" ? 3 : 1;
  for (let index = 0; index < fingerCount; index += 1) {
    touchGroup.append(createDemoElement("span", `demo-drag-finger finger-${index + 1}`));
  }
  trackpad.append(touchGroup);
  const file = createDemoElement("span", "demo-drag-file", "再造怡园.txt");
  const target = createDemoElement("span", "demo-drop-folder");
  target.append(createDemoElement("span", "demo-drop-folder-label", "项目文件夹"));
  if (phase === "after") {
    target.append(createDemoElement("span", "demo-drop-tap", "轻点放下"));
  }
  stage.append(trackpad, file, target);
  scene.append(stage);
}

function createDockAppIcon(app) {
  const labels = {
    "app-store": "App Store",
    pages: "Pages",
    keynote: "Keynote",
    safari: "Safari",
    settings: textFor("settingsApp"),
  };
  const icon = createDemoElement("span", "demo-app-icon");
  icon.title = labels[app];
  icon.setAttribute("aria-label", labels[app]);

  const image = document.createElement("img");
  image.className = "demo-app-icon-image";
  image.src = `./assets/app-icons/${app}.png`;
  image.alt = "";
  image.addEventListener("error", () => image.remove());
  icon.append(image);
  return icon;
}

function createMacSystemCursor(className) {
  const cursor = document.createElement("img");
  cursor.className = className;
  cursor.src = "./assets/apple-system-cursor.png";
  cursor.alt = "";
  cursor.setAttribute("aria-hidden", "true");
  return cursor;
}

function createFileIcon(kind, iconAsset = "") {
  const icon = createDemoElement("span", `file-icon kind-${kind}`);
  if (iconAsset || kind === "pdf") {
    const image = document.createElement("img");
    image.className = "file-icon-image";
    image.src = iconAsset || "./assets/adobe-pdf-icon.png";
    image.alt = "";
    icon.append(image);
  } else if (kind === "text") {
    icon.append(createDocumentTextIcon());
  } else if (kind === "video") {
    icon.append(createDemoElement("span", "file-icon-play", "▶"));
  } else if (kind === "image") {
    icon.append(createDemoElement("span", "file-icon-image-glyph", "▧"));
  }
  return icon;
}

function createDemoElement(tagName, className = "", textContent = "") {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function createVisualDemoPanel(title, rows, { isAfter = false } = {}) {
  const panel = document.createElement("section");
  panel.className = "visual-demo-panel";
  panel.classList.toggle("is-after", isAfter);

  const panelTitle = document.createElement("p");
  panelTitle.className = "visual-demo-panel-title";
  panelTitle.textContent = title;

  const list = document.createElement("ul");
  list.className = "visual-demo-list";
  rows.forEach((row) => list.append(createVisualDemoRow(row)));

  panel.append(panelTitle, list);
  return panel;
}

function createVisualDemoRow(row) {
  const item = document.createElement("li");
  item.className = "visual-demo-row";
  item.classList.add(`is-${row.kind}`);

  const icon = createFileIcon(row.kind, row.icon_asset);
  icon.setAttribute("aria-hidden", "true");

  const name = document.createElement("span");
  name.className = "visual-demo-name";
  name.textContent = row.name;

  const type = document.createElement("span");
  type.className = "visual-demo-type";
  type.textContent = row.type;

  item.append(icon, name, type);
  return item;
}

function createDocumentTextIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("visual-demo-document-text-icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M8 13h8",
    "M8 17h6",
  ].forEach((d) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.append(path);
  });

  return svg;
}

function syncCompletionControls() {
  const listCheckboxes = listElement.querySelectorAll("input[type='checkbox']");
  listCheckboxes.forEach((checkbox) => {
    checkbox.checked = completedBySettingId[checkbox.dataset.settingId] === true;
  });

}

function syncSelectedListItem() {
  const listItems = listElement.querySelectorAll(".master-item");
  listItems.forEach((listItem) => {
    const isSelected = listItem.dataset.settingId === selectedSetting?.id;
    listItem.classList.toggle("is-selected", isSelected);
    const button = listItem.querySelector("button");
    if (isSelected) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

function formatDetailValue(value) {
  if (Array.isArray(value)) {
    return value.join("；");
  }

  return String(value ?? "unknown");
}

function renderDetailList(element, values) {
  const items = Array.isArray(values) ? values : [values];
  const listItems = items.map((value) => {
    const listItem = document.createElement("li");
    listItem.textContent = formatDetailValue(value);
    return listItem;
  });

  element.replaceChildren(...listItems);
}

applyInterfaceLanguage();
loadSettings();
