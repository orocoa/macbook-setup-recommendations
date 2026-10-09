// Existing Mac Setup illustrations, reused in this local style experiment.
export function createVisuals(textFor) {
  function replayAnimations(root) {
    root.getAnimations({ subtree: true }).forEach(animation => {
      animation.currentTime = 0;
      animation.play();
    });
  }
  function render(visualDemo, labels = {}) {
    if (!visualDemo) return null;
    if (["official_reference", "concept_reference"].includes(visualDemo.type)) return createReferenceVisual(visualDemo);
    if (visualDemo.type === "workflow") return createWorkflowVisual(visualDemo);
    const grid = document.createElement("div");
    grid.className = "visual-demo-grid";
    if (visualDemo.variant === "folders-on-top") {
      grid.append(
        createVisualDemoPanel(labels.before, visualDemo.before_rows),
        createVisualDemoPanel(labels.after, visualDemo.after_rows, { isAfter: true }),
      );
    } else {
      grid.append(
        createVisualScenePanel(labels.before, visualDemo, "before"),
        createVisualScenePanel(labels.after, visualDemo, "after", { isAfter: true }),
      );
    }
    return grid;
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
  if (visualDemo.variant === "hot-corners") return workflow;
  workflow.append(createDemoElement("p", "workflow-primary-caption", visualDemo.primary_caption));
  workflow.append(createDemoElement("p", "workflow-secondary-caption", visualDemo.secondary_caption));
  return workflow;
}

function createReferenceVisual(visualDemo) {
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
  // Workflow scenes contain replay controls, so they must remain accessible.
  if (variant !== "hot-corners") scene.setAttribute("aria-hidden", "true");

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
  const label = createDemoElement("span", "demo-action-label", textFor(phase === "after" ? "lightTap" : "pressRequired"));
  trackpad.append(finger, ripple);
  scene.append(trackpad, label, createDemoElement("span", "demo-result-pill", `✓ ${textFor("selected")}`));
}

function createTrackingSpeedScene(scene, phase) {
  const gestureTrack = createDemoElement("div", "demo-gesture-track");
  gestureTrack.append(createDemoElement("span", "demo-gesture-finger"));
  const screenTrack = createDemoElement("div", "demo-screen-track");
  screenTrack.append(
    createDemoElement("span", "demo-pointer-start"),
    createDemoElement("span", "demo-pointer-end"),
    createMacSystemCursor("demo-pointer"),
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
  // Controls stay accessible; only the illustrative screens are hidden from AT.
  scene.removeAttribute("aria-hidden");
  const desktopBlock = createDemoElement("section", "demo-hot-animation-block");
  desktopBlock.append(createDemoElement("p", "demo-hot-animation-title", textFor("hotDesktopTitle")));
  const screen = createDemoElement("div", "demo-hot-corner-screen");
  screen.setAttribute("aria-hidden", "true");
  const desktop = createDemoElement("div", "demo-hot-desktop");
  desktop.append(createDemoElement("span", "demo-hot-desktop-label", textFor("desktop")), createDemoElement("span", "demo-hot-desktop-file", textFor("exampleFilesAfter")[0]));
  const app = createDemoElement("div", "demo-hot-app");
  const uploadZone = createDemoElement("span", "demo-hot-upload-zone");
  uploadZone.append(createDemoElement("span", "demo-hot-drop-hint", textFor("dropHere")), createDemoElement("span", "demo-hot-loaded", `✓ ${textFor("fileLoaded")}`));
  app.append(createDemoElement("span", "demo-hot-app-title", textFor("currentApp")), uploadZone);
  const cursor = createMacSystemCursor("demo-hot-cursor");
  const draggedFile = createDemoElement("span", "demo-hot-dragged-file", textFor("exampleFilesAfter")[0]);
  // One moving parent keeps the grabbed file attached to the same cursor point.
  const pointerGroup = createDemoElement("div", "demo-hot-pointer-group");
  pointerGroup.append(draggedFile, cursor);
  const corner = createDemoElement("span", "demo-hot-corner", textFor("bottomRight"));
  screen.append(desktop, app, pointerGroup, corner);
  desktopBlock.append(screen, createDemoElement("p", "demo-motion-description", textFor("hotDesktopFlow")));
  addMotionControl(desktopBlock, screen, textFor("hotDesktopTitle"));

  const sleepBlock = createDemoElement("section", "demo-hot-animation-block");
  sleepBlock.append(createDemoElement("p", "demo-hot-animation-title", textFor("hotSleepTitle")));
  const sleep = createDemoElement("div", "demo-hot-sleep");
  sleep.setAttribute("aria-hidden", "true");
  const command = createDemoElement("span", "demo-hot-sleep-command");
  command.append(createDemoElement("kbd", "demo-command-key", "⌘"), createDemoElement("span", "", textFor("holdCommand")));
  const sleepScreen = createDemoElement("div", "demo-hot-sleep-screen");
  sleepScreen.append(createDemoElement("span", "demo-hot-sleep-title", textFor("display")), createDemoElement("span", "demo-hot-sleep-corner", textFor("topRight")), createMacSystemCursor("demo-hot-sleep-cursor"), createDemoElement("span", "demo-hot-sleep-state", textFor("sleeping")));
  sleep.append(command, createDemoElement("span", "demo-sleep-arrow", "→"), sleepScreen);
  sleepBlock.append(sleep);
  addMotionControl(sleepBlock, sleep, textFor("hotSleepTitle"));

  scene.append(desktopBlock, sleepBlock);
}

function addMotionControl(block, animationRoot, title) {
  // Inserting the scene starts its one-shot CSS animations; this button only replays them.
  const button = createDemoElement("button", "visual-demo-motion-control", textFor("replay"));
  button.type = "button";
  button.setAttribute("aria-label", `${textFor("replay")}: ${title}`);
  button.addEventListener("click", () => {
    replayAnimations(animationRoot);
  });
  block.append(button);
}

function createInputSourceScene(scene, phase) {
  const documents = createDemoElement("div", "demo-documents");
  const chinese = createDemoElement("div", "demo-document doc-cn");
  chinese.append(createDemoElement("span", "demo-document-title", textFor("chineseDocument")), createDemoElement("span", "demo-document-sample", "你好"), createDemoElement("span", "demo-document-input", textFor("pinyin")));
  const english = createDemoElement("div", "demo-document doc-en");
  english.append(createDemoElement("span", "demo-document-title", textFor("englishDocument")), createDemoElement("span", "demo-document-sample", "Hello"), createDemoElement("span", "demo-document-input", phase === "after" ? "ABC" : textFor("pinyin")));
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
  const file = createDemoElement("span", "demo-drag-file", textFor("exampleFilesAfter")[0]);
  const target = createDemoElement("span", "demo-drop-folder");
  target.append(createDemoElement("span", "demo-drop-folder-label", textFor("setupFolder")));
  if (phase === "after") {
    target.append(createDemoElement("span", "demo-drop-tap", textFor("tapToDrop")));
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
  const label = createDemoElement("span", "demo-app-label", labels[app]);

  // The release uses text labels; no missing or unlicensed app icons are fetched.
  icon.append(label);
  return icon;
}

function createMacSystemCursor(className) {
  const cursor = document.createElement("img");
  cursor.className = className;
  cursor.src = "./assets/original/pointer.svg";
  cursor.alt = "";
  cursor.setAttribute("aria-hidden", "true");
  return cursor;
}

function createFileIcon(kind, iconAsset = "") {
  const icon = createDemoElement("span", `file-icon kind-${kind}`);
  if (iconAsset || kind === "pdf") {
    const image = document.createElement("img");
    image.className = "file-icon-image";
    image.src = iconAsset || "./assets/original/pdf.svg";
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

  return { render, replayAnimations };
}
