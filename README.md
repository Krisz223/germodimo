# GerMODimo

A desktop **mod manager** for **Geronimo** (VR tactical shooter, Unreal Engine 5.7), built with
Electron. It sets up the UE4SS scripting runtime the game needs and manages your mods from one
tactical-looking window.

> ⚠️ Fan-made and **not affiliated with or endorsed by** the developers or publisher of Geronimo.
> See [DISCLAIMER.md](DISCLAIMER.md).

---

## What it does

- **Finds the game** automatically (Steam library scan) or by manual folder pick.
- **Installs UE4SS** for you — the *experimental* build plus the UE 5.7 AOB signatures required by
  this game's 5.7.4 engine (stock UE4SS does not work on it). Downloaded from UE4SS's official
  GitHub releases; nothing proprietary is bundled.
- **Manages mods** — drag-and-drop `.zip` install, enable/disable toggles, delete, load-order for
  `.pak` mods, separates your custom mods from the core UE4SS modules.
- **Live config editor** — per-mod settings with sliders, a color picker, and a **Reset to Default**
  button. Writes each mod's `config.json`, which mods re-read live in-game.
- **Launch / kill game**, **back up save data**, optional launch-on-boot and process monitoring.

Companion mods: **[geronimo-mods](https://github.com/Krisz223/geronimo-mods)**.

---

## Build from source

Requires [Node.js](https://nodejs.org) (18+).

```bash
# frontend (the Electron app)
cd frontend
npm install
npm run dev      # run in development
npm run build    # produce a packaged installer in frontend/release/
```

The `backend/` folder is an optional helper service and is not required to run the app.

## How mods are installed by it

- **UE4SS Lua mods** → `...\GERONIMO\Geronimo\Binaries\Win64\ue4ss\Mods\`, toggled via `mods.txt`.
- **`.pak` mods** → `...\Geronimo\Content\Paks\~mods\`.

## Safety

- No game files or copyrighted assets are included or redistributed.
- UE4SS is fetched from its official source at install time, not shipped here.
- Single-player use recommended.

## License

Original code is [MIT](LICENSE). Geronimo and all related trademarks belong to their respective owners.
