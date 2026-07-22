# Changelog

## 1.1.1

### Fixed
- **Theme/layout buttons restyled.** They were rendering as plain light-coloured browser buttons
  that clashed with the interface. They are now dark tactical chips with a glowing colour dot, and
  the selected one is tinted in the active accent.
- **Layout density now actually changes the layout.** Previously it only scaled text. It now
  adjusts card padding, page margins, list spacing, button sizes and heading sizes — Comfortable,
  Compact and Dense are meaningfully different.


## 1.1.0

### Added
- **Colour themes** — four schemes selectable in Settings → Appearance: Night Vision (default),
  Amber CRT, Ice Blue, and Crimson. Applied instantly and remembered between sessions.
- **Layout density** — Comfortable / Compact / Dense, for fitting more modules on screen.

### Changed — pak mod support
- **Fixed the pak install location.** Pak mods now install to `Geronimo\Content\Paks\Mods\`,
  which is where Geronimo actually mounts them. They were previously going to `~mods\`, where the
  game does not pick them up.
- **IoStore mods are now supported properly.** Modern pak mods ship as a three-file set
  (`.pak` + `.ucas` + `.utoc`). GerMODimo now treats that set as a single mod — it installs,
  lists, enables/disables, and removes all three together instead of only handling the `.pak`.
- **Drag and drop accepts pak files directly.** You can drop a `.pak`, `.ucas`, or `.utoc`
  straight onto the drop zone (no zip required); any sibling files belonging to the same mod are
  installed alongside it, so a mod can't end up half-installed. The file browser accepts them too.
- Mod list now shows the combined size of a pak mod's files.

## 1.0.0
- Initial release: game detection, one-click UE4SS install, drag-and-drop mod management,
  live mod configuration, and save-data backup.
