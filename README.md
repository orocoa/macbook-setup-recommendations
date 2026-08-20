# MacBook Setup Recommendations

[简体中文](./README.zh-CN.md)

A bilingual, visual, and interactive guide to 14 Finder, System Settings, and practical utility recommendations for a new MacBook. Each recommendation explains what changes, where to find it, how to make the change manually, and how to restore the previous behavior.

This repository contains a GitHub Pages-ready release candidate. It has not yet been published or deployed as a live website.

## What it includes

- 14 recommendations: 3 in Finder, 10 in System Settings, and 1 independent utility recommendation.
- Simplified Chinese and English content, switchable from the interface.
- Search across visible setting content, including titles, descriptions, paths, and instructions.
- A desktop Master–Detail layout: select a setting in the sidebar and read its details without leaving the page.
- A per-setting checklist stored in the browser's Local Storage.
- Before/after explanations, manual paths, steps, restore instructions, and source links.
- Static JSON content with no account, database, API, cloud sync, or backend.

## What it does not do

This guide does not detect the current state of macOS and does not change any macOS setting. Every system change is performed manually by the user in Finder or System Settings.

The checklist records only whether a recommendation has been handled. A checked item can mean that the setting was changed, or that it was reviewed and intentionally left unchanged. The checklist is not evidence of the actual macOS state.

## Local preview over HTTP

The page loads its JSON files with `fetch`, so preview it through a local HTTP server instead of opening `index.html` directly with a `file://` URL.

From this directory, run:

```bash
python3 -m http.server 4177 --bind 127.0.0.1
```

Then open:

<http://127.0.0.1:4177/>

If supported by your macOS security settings, you can also double-click `run.command`.

## Publish with GitHub Pages

This is a static site and does not require a build step. After publishing the repository to GitHub, open **Settings > Pages**, choose **Deploy from a branch**, then select **main** and **/(root)**. GitHub Pages will serve `index.html` directly.

The default `github.io` address may be unreliable on some networks. A custom domain can be connected later without changing the product architecture.

## How it works

```text
data/settings.json or data/settings.en.json
                    ↓ fetch
                  app.js
      search · selection · rendering · checklist
                    ↓ DOM
              index.html + CSS
                    ↕
       browser Local Storage for progress
```

- Chinese content is loaded from `data/settings.json`.
- English content is loaded from `data/settings.en.json`.
- The selected language is kept in the URL and Local Storage.
- The selected setting is represented in the URL so browser history can restore navigation.
- Search filters the in-memory settings; it does not modify either JSON file.
- Checklist progress stays in the current browser profile and is not uploaded or synced.

## Sources and editorial boundaries

Each recommendation includes one or more source links, primarily to Apple Support or the Mac User Guide. These sources support macOS feature behavior, requirements, and setting locations.

Some values and workflows are editorial recommendations rather than Apple defaults. For example, the suggested trackpad speed is a starting point for this guide, and the Hot Corners file-drag workflow is a manually tested combination of system features. Internal editorial metadata is kept in the JSON but is not presented as an Apple claim.

The Mos entry is an independent app recommendation, not a macOS setting or an Apple recommendation. Mos needs Accessibility permission to process mouse input, so the guide explains that permission before asking the reader to enable it.

Visuals are explanatory prototypes. Some are original HTML/CSS concept illustrations; some existing image assets have unresolved redistribution status. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) before publishing or redistributing the repository.

## Validation

Install or provide a current Node.js runtime, then run:

```bash
npm test
```

The underlying command is:

```bash
node tests/validate-data.mjs
```

The test checks both language files, required fields, unique IDs, source URLs, visual types, referenced assets, and structural parity between Chinese and English content. It does not prove that every recommendation is factually correct on every Mac or macOS release.

## Manual acceptance checks

1. Switch between Chinese and English and confirm the interface and all 14 recommendations change language.
2. Open every recommendation and confirm the detail pane starts at its title.
3. Search for known terms in both languages and verify the expected settings remain visible.
4. Check and uncheck items, refresh the page, and confirm progress is restored in the same browser.
5. Open source links and compare paths and terminology with the target macOS version.
6. Confirm conceptual visuals remain understandable when reduced motion is enabled.
7. Break a JSON path temporarily in a development copy and confirm the interface shows a load error instead of an empty page.

## Known limitations

- The guide is intended for recent macOS versions and does not document legacy versions.
- Setting names, locations, and behavior may vary by macOS version, Mac model, connected hardware, language, or account configuration.
- Personal recommendations are not universal defaults and may not fit every workflow.
- Third-party utilities can require additional permissions, have their own licenses, and change independently of macOS; verify their current release notes and permission needs before installation.
- Local Storage is browser-specific and provides no account sync, backup, or confirmation of the real system state.
- The current prototype has no production deployment, broad user study, automated browser test suite, or cross-browser compatibility matrix.
- Several Apple-, Adobe-, or user-supplied reference assets require replacement or explicit redistribution confirmation before public release.
- Original project code and documentation are provided under the MIT License. Third-party names, marks, screenshots, and reference assets are excluded; see `THIRD_PARTY_NOTICES.md`.

## Project structure

```text
index.html                  Interface structure and styles
app.js                      Data loading, language, search, routing, and state
data/settings.json          Simplified Chinese recommendations
data/settings.en.json       English recommendations
assets/                     Visual and reference assets
tests/validate-data.mjs     Static data validation
run.command                 Local preview helper
THIRD_PARTY_NOTICES.md      Asset provenance and redistribution notes
```

## Contributing

Useful contributions include corrections for recent macOS releases, clearer manual and restore steps, reliable primary sources, bilingual terminology fixes, accessible visual explanations, and reproducible user-testing findings.

Avoid adding a framework, backend, account system, database, or AI feature unless a validated product need requires it.

## Independence notice

This is an independent project. It is not an official Apple product and is not affiliated with, endorsed by, or sponsored by Apple Inc. Apple, Mac, MacBook, macOS, Finder, and related marks and interface assets belong to their respective rights holders.
