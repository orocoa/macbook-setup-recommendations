# MacBook Setup Recommendations

[简体中文](./README.zh-CN.md)

A bilingual, visual, and interactive guide to 15 Finder, System Settings, utility, and shortcut recommendations for a new MacBook. Each recommendation explains what changes, where to find it, how to make the change manually, and how to restore the previous behavior.

## Open the guide

[Open MacBook Setup Recommendations](https://kai-nex.github.io/macbook-setup-recommendations/)

No download or installation is required. For the intended experience, open it in a browser on a MacBook.

## What it includes

- 15 recommendations: 4 in Finder, 9 in System Settings, 1 independent utility recommendation, and 1 built-in shortcut recommendation.
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
node --test tests/storage.test.mjs
```

The test checks both language files, required fields, unique IDs, source URLs, visual types, referenced assets, and structural parity between Chinese and English content. It does not prove that every recommendation is factually correct on every Mac or macOS release.

Preference tests also cover restoring a saved language, URL precedence, and safe behavior when browser storage is unavailable.

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
assets/                     Visual and reference assets
tests/validate-data.mjs     Static data validation
tests/storage.test.mjs      Language preference and storage-failure regression tests
run.command                 Local preview helper
THIRD_PARTY_NOTICES.md      Asset provenance and redistribution notes
```

## Contributing

Useful contributions include corrections for recent macOS releases, clearer manual and restore steps, reliable primary sources, bilingual terminology fixes, accessible visual explanations, and reproducible user-testing findings.

Avoid adding a framework, backend, account system, database, or AI feature unless a validated product need requires it.

## Independence notice

This is an independent project. It is not an official Apple product and is not affiliated with, endorsed by, or sponsored by Apple Inc. Apple, Mac, MacBook, macOS, Finder, and related marks and interface assets belong to their respective rights holders.
