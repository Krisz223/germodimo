# Changelog

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
