# Changelog

## 1.3.1

### Changed / fixed
- **Softer palette** — the manila paper is less bright and the ink is a warm dark sepia instead of
  near-black, easier on the eyes.
- **Readable card buttons** — Config, Delete and priority controls on mod cards are larger and
  higher-contrast (they were too small).
- **Separate sections** for **Script Modules** and **Pak Modules** in the mod list.
- **Restored the old look** — a new **Classic (Tactical)** paper stock brings back the dark
  night-vision terminal theme (Settings → Appearance).
- **Window controls** (minimise / maximise / close) now match the dossier colours.


## 1.3.0

### Added
- **Brand-new "Field Dossier" interface.** A complete visual redesign — GerMODimo now looks like a
  printed operations file. Binder-tab navigation, a document-style header, a stamped Execute button,
  and mods presented as manila **file cards** (paperclip, type tab, rubber-stamp Enabled/Filed, a
  thumbnail plate). Same features throughout — install, toggle, config, delete, pak support.
- **Paper stocks** (Settings → Appearance): Manila (default), Blueprint, and Carbon — three colour
  treatments of the dossier look, remembered between sessions.
- **Updates**
  - **Automatic update checks** — a new Settings toggle checks GitHub on launch (and every few hours)
    and raises a **Windows notification** when a new version ships.
  - **Manual "Check for updates"** button in Settings, showing your current version and the latest.
  - **One-click update** — when an update is found, an "Update now" banner downloads the new installer
    and launches it for you.

### Changed
- The old tactical-terminal theme and the sidebar-layout options have been replaced by the dossier
  design and its paper stocks.

## 1.2.0

### Added
- **Interface layouts** — the navigation physically rearranges, under
  **Settings → Appearance → Interface Layout**:
  - **Sidebar Left** — the original layout.
  - **Sidebar Right** — navigation moves to the right edge; nav items and the active indicator
    mirror with it.
  - **Top Bar** — navigation becomes a horizontal bar across the top with underline indicators,
    and content uses the full window width.
- **Colour themes** — Night Vision (default), Amber CRT, Ice Blue, Crimson. Applied instantly and
  remembered between sessions.

### Changed — pak mod support
- **Fixed the pak install location.** Pak mods now install to `Geronimo\Content\Paks\Mods\`.
  They previously went to `~mods\`, which the game does not mount — so pak mods installed through
  GerMODimo never loaded.
- **IoStore mods are now supported.** Modern pak mods ship as a `.pak` + `.ucas` + `.utoc` set.
  GerMODimo treats that set as a single mod — installing, listing, enabling/disabling and removing
  all three together instead of only handling the `.pak`.
- **Drag and drop accepts pak files directly** — drop a `.pak`, `.ucas` or `.utoc` (no zip needed)
  and any sibling files belonging to the same mod are installed with it, so a mod can't end up
  half-installed. The file browser accepts them too.
- Pak mods now report their combined size in the list.

## 1.0.0
- Initial release: game detection, one-click UE4SS install, drag-and-drop mod management,
  live mod configuration, and save-data backup.
