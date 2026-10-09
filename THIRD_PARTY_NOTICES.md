# Third-Party and Reference Asset Notices

This file documents the provenance currently known for image assets in `assets/`. It is an inventory and caution notice, not a license grant. The repository's MIT License applies only to original project material and does not override the rights described here.

The public redistribution permission for every historical PNG asset listed below remains to be confirmed. None of these assets is automatically covered by any future license selected for the project's source code. The October 2026 website uses original HTML/CSS illustrations and the original SVG assets listed below. `_config.yml` excludes the historical PNG files and app-icon slots from the GitHub Pages build. The files remain in Git to preserve the source record; this does not establish redistribution permission. Any other package or repository redistribution must exclude these historical files or obtain and record permission for that use.

## Original assets used by the October 2026 website

`assets/original/folder.svg`, `pdf.svg`, and `pointer.svg` are original generic vector illustrations authored for this release. `menu-bar-zh-CN.svg` and `menu-bar-en.svg` are original explanatory diagrams, based on documented menu-bar roles rather than a copied screenshot. These five files are covered by the project MIT License. Apple and Adobe logos are not embedded in them. The diagrams are concepts, not exact system screenshots.

The Dock illustrations use text labels; the website does not request or distribute third-party app-icon artwork.

## Historical prototype assets (excluded from the published site)

### `assets/adobe-pdf-icon.png`

- Description: Adobe PDF logo used in the Finder file-type concept illustration.
- Known source: image supplied by the project owner during prototype development; the original download URL and license record were not preserved.
- Rights context: depicts Adobe branding and artwork.
- Redistribution status: public redistribution permission is unconfirmed.
- Code-license boundary: this file does not belong to, and must not be assumed to be covered by, any future license for the project code.
- Before release: replace it with an original generic PDF/document icon or confirm and document an applicable Adobe permission.

### `assets/apple-finder-folder-user-reference.png`

- Description: Finder-style blue folder image currently displayed in Finder concept illustrations.
- Known source: screenshot/reference image supplied by the project owner from macOS during prototype development.
- Rights context: depicts Apple interface artwork.
- Redistribution status: public redistribution permission is unconfirmed.
- Code-license boundary: this file does not belong to, and must not be assumed to be covered by, any future license for the project code.
- Before release: replace it with an original folder illustration or obtain and document permission for public redistribution.

### `assets/apple-menu-bar-official-reference.png`

- Description: menu bar structure image displayed in the menu bar recommendation.
- Known source: user-supplied capture/reference derived from Apple Support, [Customize the menu bar on Mac](https://support.apple.com/zh-cn/guide/mac-help/mchl4af84660/mac).
- Rights context: Apple Support documentation and interface artwork remain subject to Apple's rights and terms.
- Redistribution status: the source page is public, but permission to copy and redistribute the extracted image inside this repository is unconfirmed.
- Code-license boundary: this file does not belong to, and must not be assumed to be covered by, any future license for the project code.
- Before release: link to the Apple Support page without bundling the image, create an original explanatory diagram, or obtain and document permission.

### `assets/apple-system-cursor.png`

- Description: macOS cursor image used in the Hot Corners and tracking-speed concept animations.
- Known source: extracted from a local macOS system/interface resource during prototype development; no separate redistribution license was recorded.
- Rights context: Apple system artwork.
- Redistribution status: public redistribution permission is unconfirmed.
- Code-license boundary: this file does not belong to, and must not be assumed to be covered by, any future license for the project code.
- Before release: replace it with an original generic cursor illustration or obtain and document permission.

## Reference assets retained in the repository

These files are retained as design references and are not currently required by the running interface. Keeping a file as a reference does not grant permission to publish it.

### `assets/apple-dock-icons-reference.png`

- Description: screenshot of a macOS Dock containing Apple app icons.
- Known source: screenshot supplied by the project owner during prototype development.
- Rights context: depicts Apple app icons and macOS interface artwork.
- Redistribution status: public redistribution permission is unconfirmed.
- Code-license boundary: this file does not belong to, and must not be assumed to be covered by, any future license for the project code.
- Before release: remove it from the public package, replace it with original placeholder artwork, or obtain and document permission.

### `assets/apple-finder-folder-reference.png`

- Description: earlier Finder folder screenshot retained as a visual reference.
- Known source: screenshot supplied by the project owner during prototype development.
- Rights context: depicts Apple interface artwork.
- Redistribution status: public redistribution permission is unconfirmed.
- Code-license boundary: this file does not belong to, and must not be assumed to be covered by, any future license for the project code.
- Before release: remove it from the public package, replace it with an original reference, or obtain and document permission.

### `assets/apple-menu-bar-reference.png`

- Description: screenshot of a macOS menu bar retained as a layout reference.
- Known source: screenshot supplied by the project owner during prototype development.
- Rights context: depicts macOS interface elements and may include third-party status icons.
- Redistribution status: public redistribution permission is unconfirmed.
- Code-license boundary: this file does not belong to, and must not be assumed to be covered by, any future license for the project code.
- Before release: remove it from the public package, replace it with an original reference, or obtain and document permission from all relevant rights holders.

## Reserved app-icon slots

`assets/app-icons/` currently contains placement instructions but no bundled app-icon PNG files. If images are added later, record each filename, creator or source URL, license or permission, modifications, and whether public redistribution is allowed. Apple app icons, third-party app icons, and screenshots should not be assumed to be reusable merely because they are publicly visible.

## Trademarks and independence

Apple, Mac, MacBook, macOS, Finder, and related names and artwork are trademarks or property of Apple Inc. Adobe and the Adobe PDF logo are trademarks or property of Adobe. Other names and marks belong to their respective owners.

This independent project is not affiliated with, endorsed by, or sponsored by Apple Inc. or Adobe.

## Interface inspiration

- The custom checklist control structure originated from a Uiverse checkbox shared by MattiaCode-IT. This project removes the example text and spacing, fits the control into the existing Master list, and keeps the native HTML checkbox keyboard-accessible. The October 2026 paper-grid release uses a native checkbox with a simple square and check mark.
