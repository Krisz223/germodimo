# GerMODimo — Nexus Mods listing (copy-paste ready)

Nexus doesn't take a repo URL — you fill in fields by hand and paste the description as BBCode.
Everything below is ready to paste. You upload it under your own Nexus account.

> **First:** Geronimo may not exist as a game on Nexus yet. If searching for it returns nothing,
> use **"Request a game"** (nexusmods.com → Games → can't find it → request) and wait for it to be
> added before you can upload. Both this manager and the mods go under that game once it exists.

---

## Fields

- **Mod name:** GerMODimo — Geronimo Mod Manager
- **Category:** Utilities (or "Modding Tools" if the game has one)
- **Version:** 1.0.0
- **Summary (short, ~1 line):**
  A desktop mod manager for Geronimo. Installs the UE4SS runtime and lets you install, enable,
  configure, and remove mods from one window.
- **Tags:** utility, mod manager, tool, UE4SS, quality of life
- **Requirements / dependencies:** none for the manager itself (it installs UE4SS for you).
- **Permissions:** it's your call, but MIT-licensed source means you can allow reuse with credit.

---

## Description (paste into the BBCode description box)

```bbc
[size=5][b]GerMODimo[/b][/size]
A desktop mod manager for [b]Geronimo[/b] (VR tactical shooter, Unreal Engine 5.7). It sets up the
UE4SS scripting runtime the game needs and lets you install, enable, configure, and remove mods from
a single window.

[i]Unofficial and community-made. Not affiliated with or endorsed by the developers or publisher of
Geronimo.[/i]

[size=4][b]Features[/b][/size]
[list]
[*][b]Game detection[/b] — finds your Geronimo install automatically, or point it at the folder.
[*][b]One-click UE4SS install[/b] — downloads and installs the scripting runtime, including the
UE 5.7 signatures this build requires. The stock UE4SS release does not work on this game; GerMODimo
handles that for you.
[*][b]Mod management[/b] — install by drag-and-drop, enable/disable, remove, set load order.
[*][b]Live configuration[/b] — edit each mod's settings with sliders, a colour picker, and a
Reset-to-Default button; changes apply in-game within about a second.
[*][b]Save-data backup[/b] — makes a timestamped copy of your Geronimo saves before you experiment.
[*][b]Launch/stop the game[/b] with optional startup and process monitoring.
[/list]

[size=4][b]Install[/b][/size]
[list=1]
[*]Download and run the installer. Windows SmartScreen may warn because it isn't code-signed —
choose [b]More info -> Run anyway[/b].
[*]Open GerMODimo, confirm the game path on the dashboard.
[*]Open the UE4SS tab and install the runtime.
[*]On the Modulations tab, drag in mod .zip files and enable them.
[*]Launch the game.
[/list]

[size=4][b]Mods[/b][/size]
Mods are published separately — see the Geronimo mods page.

[size=4][b]Source & license[/b][/size]
Open source (MIT). Source code, a full modding tutorial, and issue tracking live on GitHub:
[url=https://github.com/Krisz223/germodimo]github.com/Krisz223/germodimo[/url]
```

---

## Images to upload (Nexus media tab)

Nexus won't pull images from GitHub — upload these from `assets/` yourself:
- `assets/germodimo-demo.gif` — the walkthrough (good as the main image)
- `assets/01-dashboard.png`
- `assets/02-ue4ss.png`
- `assets/03-modulations.png`
- `assets/04-settings.png`
