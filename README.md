# MacBook Setup Recommendations

[简体中文](./README.zh-CN.md)

A bilingual, visual, and interactive guide to 15 Finder, System Settings, utility, and shortcut recommendations for a new MacBook. Each recommendation explains what changes, where to find it, how to make the change manually, and how to restore the previous behavior.

## Open the guide

[Open MacBook Setup Recommendations](http://macsetup.kai-nex.com/)

No download or installation is required. For the intended experience, open it in a browser on a MacBook.

## Product case & ownership

An independent project by [KAI](https://github.com/orocoa), built with AI-assisted development. I own the problem definition, content structure, bilingual interaction design, implementation process, validation, and release.

The product goal is to turn scattered setup advice into a guide people can understand, act on, and reverse. I kept the implementation static: the task needs readable instructions and a local checklist, not an account or a model call. A completed checklist means the user handled a recommendation; it does not claim to detect or change macOS settings.

The delivered result is a public, bilingual guide with 15 recommendations and documented data/storage checks. Broad user research and measured onboarding improvements have not been established. A useful next study would observe new Mac users finding, understanding, and completing a setting without assistance. This is a product-delivery and information-design project; AI assisted its development, but it is not an AI-powered application.

## What it includes

- 15 recommendations: 4 in Finder, 9 in System Settings, 1 independent utility recommendation, and 1 built-in shortcut recommendation.
- Simplified Chinese and English content, switchable from the interface.
- Search across visible setting content, including titles, descriptions, paths, and instructions.
- A white paper/black grid, viewport-height Master–Detail layout with independent scrolling. Selecting a setting preserves the Master position and resets Detail to its title. Narrow screens use two stacked scrolling panes.
- A fixed language header and explanatory footer, a visible search field, and restore instructions that expand downward from the + control.
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

## Sources and editorial boundaries

Each recommendation includes one or more source links, primarily to Apple Support or the Mac User Guide. These sources support macOS feature behavior, requirements, and setting locations.

Some values and workflows are editorial recommendations rather than Apple defaults. For example, the suggested trackpad speed is a starting point for this guide, and the Hot Corners file-drag workflow is a manually tested combination of system features. Internal editorial metadata is kept in the JSON but is not presented as an Apple claim.

The Mos entry is an independent app recommendation, not a macOS setting or an Apple recommendation. Mos needs Accessibility permission to process mouse input, so the guide explains that permission before asking the reader to enable it.

Website visuals are original HTML/CSS concepts and SVG illustrations, not system screenshots. Historical reference images remain in Git but are excluded from the published website by `_config.yml`. Other redistribution must follow [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) before publishing or redistributing the repository.

## Validation

Install or provide a current Node.js runtime, then run:

```bash
npm test
```

The underlying command is:

```bash
node tests/validate-data.mjs
node --test tests/storage.test.mjs tests/search.test.mjs
```

The test checks both language files, required fields, unique IDs, source URLs, visual types, referenced assets, and structural parity between Chinese and English content. It does not prove that every recommendation is factually correct on every Mac or macOS release.

Preference tests also cover restoring a saved language, URL precedence, legacy checklist compatibility, and unavailable or malformed browser storage. Production retains `mac-setup-completed-v1` and `mac-setup-language-v1`, preserving existing records on the same origin.

## Known limitations

- The guide is intended for recent macOS versions and does not document legacy versions.
- Setting names, locations, and behavior may vary by macOS version, Mac model, connected hardware, language, or account configuration.
- Personal recommendations are not universal defaults and may not fit every workflow.
- Third-party utilities can require additional permissions, have their own licenses, and change independently of macOS; verify their current release notes and permission needs before installation.
- Local Storage is browser-specific and provides no account sync, backup, or confirmation of the real system state.
- The current version has not undergone broad user research or a complete cross-browser compatibility review.
- Apple-, Adobe-, or user-supplied reference assets remain subject to their respective rights and are not covered by the MIT License.
- Original project code and documentation are provided under the MIT License. Third-party names, marks, screenshots, and reference assets are excluded; see `THIRD_PARTY_NOTICES.md`.

## Project structure

```text
index.html                  Interface structure
styles.css                  Visual styles, motion, and reduced-motion alternatives
app.js                      Data loading, language, search, routing, and state
data/settings.json          Simplified Chinese recommendations
data/settings.en.json       English recommendations
grid-motion.js              Black grid-line transition motion
visuals.js / visuals.css     Concept illustrations and interactive demonstrations
ui-text.js                  Bilingual interface copy
assets/original/            Original SVGs used by the published website
assets/                     Retained historical reference assets
_config.yml                 Pages exclusions for historical reference images
tests/validate-data.mjs     Static data validation
tests/storage.test.mjs      Language preference and storage-failure regression tests
tests/search.test.mjs      Short-word and bilingual search regression tests
run.command                 Local preview helper
THIRD_PARTY_NOTICES.md      Asset provenance and redistribution notes
```

## Contributing

Useful contributions include corrections for recent macOS releases, clearer manual and restore steps, reliable primary sources, bilingual terminology fixes, accessible visual explanations, and reproducible user-testing findings.

Avoid adding a framework, backend, account system, database, or AI feature unless a validated product need requires it.

## Independence notice

This is an independent project. It is not an official Apple product and is not affiliated with, endorsed by, or sponsored by Apple Inc. Apple, Mac, MacBook, macOS, Finder, and related marks and interface assets belong to their respective rights holders.
