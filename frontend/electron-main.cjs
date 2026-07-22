const { app, BrowserWindow, ipcMain, dialog, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const extract = require('extract-zip');
const https = require('https');
const { exec } = require('child_process');

const settingsPath = path.join(app.getPath('userData'), 'settings.json');
function loadSettings() {
    if (fs.existsSync(settingsPath)) {
        return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    return { openAtLogin: false, gameMonitor: false };
}
function saveSettings(settings) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
    app.setLoginItemSettings({ openAtLogin: settings.openAtLogin });
}
let currentSettings = loadSettings();
let gameMonitorInterval = null;
let tray = null;


function downloadFile(url, dest, onProgress) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, dest, onProgress).then(resolve).catch(reject);
            }
            
            const totalBytes = parseInt(response.headers['content-length'], 10);
            let downloadedBytes = 0;
            
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                if (onProgress && totalBytes) {
                    const percent = Math.round((downloadedBytes / totalBytes) * 100);
                    onProgress(`Downloading... ${percent}%`);
                }
            });
            
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'GerMODimo',
    backgroundColor: '#050505',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#050505',
      symbolColor: '#50C878',
      height: 32
    },
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('close', (event) => {
      if (!app.isQuitting) {
          event.preventDefault();
          mainWindow.hide();
      }
      return false;
  });
}

let isGameRunning = false;
function startTasklistPolling() {
    if (gameMonitorInterval) clearInterval(gameMonitorInterval);
    gameMonitorInterval = setInterval(() => {
        exec('tasklist', (err, stdout) => {
            const running = stdout && stdout.toLowerCase().includes('geronimo');
            if (running !== isGameRunning) {
                isGameRunning = running;
                if (mainWindow) mainWindow.webContents.send('system:gameStatus', running);
            }
            if (running && currentSettings.gameMonitor && mainWindow && !mainWindow.isVisible()) {
                mainWindow.show();
            }
        });
    }, 2000);
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(nativeImage.createEmpty());
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show GerMODimo', click: () => mainWindow.show() },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
  tray.setToolTip('GerMODimo');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());
  
  startTasklistPolling();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Helper functions for paths
// Geronimo mounts pak mods from Content\Paks\Mods (this is where community/Nexus pak mods install).
// IoStore mods ship as a triplet: .pak + .ucas + .utoc (all three must move together).
const getPaksPath = (gamePath) => path.join(gamePath, 'Geronimo', 'Content', 'Paks', 'Mods');
const PAK_EXTS = ['.pak', '.ucas', '.utoc'];
const isPakFile = (n) => PAK_EXTS.some(e => n.toLowerCase().endsWith(e));
const pakBaseName = (n) => n.replace(/\.(pak|ucas|utoc)(\.disabled)?$/i, '').replace(/\.disabled$/i, '');
const getUE4SSModsPath = (gamePath) => path.join(gamePath, 'Geronimo', 'Binaries', 'Win64', 'ue4ss', 'Mods');

// IPC Handlers
ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('dialog:openFileSelect', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Mods', extensions: ['zip','pak','ucas','utoc'] }]
    });
    if (canceled) return null;
    return filePaths[0];
});

function findGeronimoPath() {
    const { execSync } = require('child_process');
    try {
        const psScript = `
            $steamPath = (Get-ItemProperty "HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam" -ErrorAction SilentlyContinue).InstallPath;
            if (!$steamPath) { exit };
            $vdfPath = Join-Path $steamPath "steamapps\\libraryfolders.vdf";
            if (!(Test-Path $vdfPath)) { exit };
            $paths = Select-String -Path $vdfPath -Pattern '"path"\\s+"([^"]+)"' | ForEach-Object { $_.Matches.Groups[1].Value.Replace('\\\\', '\\') };
            foreach ($p in $paths) {
                $gamePaths = @(
                    Join-Path $p "steamapps\\common\\GERONIMO",
                    Join-Path $p "steamapps\\common\\GERONIMO modded"
                );
                foreach ($gp in $gamePaths) {
                    if (Test-Path (Join-Path $gp "Geronimo\\Binaries\\Win64\\Geronimo-Win64-Shipping.exe")) {
                        Write-Output $gp;
                        exit;
                    }
                }
            }
        `;
        const stdout = execSync(`powershell.exe -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`, { encoding: 'utf8' });
        const found = stdout.trim();
        if (found && fs.existsSync(found)) return found;
    } catch(e) {}
    
    // Fallbacks
    const fallbacks = [
        'C:\\Program Files (x86)\\Steam\\steamapps\\common\\GERONIMO',
        'C:\\Program Files (x86)\\Steam\\steamapps\\common\\GERONIMO modded'
    ];
    for (const p of fallbacks) {
        if (fs.existsSync(path.join(p, 'Geronimo', 'Binaries', 'Win64', 'Geronimo-Win64-Shipping.exe'))) {
            return p;
        }
    }
    return null;
}

ipcMain.handle('system:checkGame', async (event, customPath) => {
    const checkPath = customPath || findGeronimoPath();
    
    try {
        if (!checkPath || !fs.existsSync(checkPath)) return { found: false };
        
        const exePath = path.join(checkPath, 'Geronimo', 'Binaries', 'Win64', 'Geronimo-Win64-Shipping.exe');
        if (!fs.existsSync(exePath)) return { found: false };
        
        const binariesPath = path.join(checkPath, 'Geronimo', 'Binaries', 'Win64');
        const isCracked = fs.existsSync(path.join(binariesPath, 'steam_emu.ini')) || 
                          fs.existsSync(path.join(binariesPath, 'steam_api64.cdx'));
        
        const ue4ssExists = fs.existsSync(path.join(binariesPath, 'ue4ss', 'UE4SS.dll'));
        
        return {
            found: true,
            path: checkPath,
            ue4ssInstalled: ue4ssExists,
            isCracked: isCracked
        };
    } catch(e) {
        return { found: false, error: e.message };
    }
});

ipcMain.handle('mod:openFolder', async (event, folderPath) => {
    if (fs.existsSync(folderPath)) {
        await shell.openPath(folderPath);
        return true;
    }
    return false;
});

ipcMain.handle('mod:installUE4SS', async (event, gamePath) => {
    const reportProgress = (msg) => event.sender.send('mod:installProgress', msg);
    try {
        // GERONIMO is UE 5.7.4 — stable v3.0.1 does not work, experimental build required.
        // Zip layout: dwmapi.dll + ue4ss\ at root, so extracting into Win64 lands everything correctly.
        const ue4ssUrl = 'https://github.com/UE4SS-RE/RE-UE4SS/releases/download/experimental-latest/UE4SS_v3.0.1-1012-gc838a8ac.zip';
        const tempZipPath = path.join(app.getPath('temp'), 'UE4SS_temp.zip');
        const binariesPath = path.join(gamePath, 'Geronimo', 'Binaries', 'Win64');
        const ue4ssDir = path.join(binariesPath, 'ue4ss');

        // Preserve tuned settings on reinstall — the zip would overwrite UE4SS-settings.ini.
        // (Custom UE4SS_Signatures isn't in the zip, so extraction leaves it alone.)
        const settingsIni = path.join(ue4ssDir, 'UE4SS-settings.ini');
        const savedSettings = fs.existsSync(settingsIni) ? fs.readFileSync(settingsIni) : null;

        reportProgress('Fetching UE4SS (experimental) from GitHub...');
        await downloadFile(ue4ssUrl, tempZipPath, reportProgress);

        reportProgress('Extracting ZIP archive...');
        await extract(tempZipPath, { dir: binariesPath });

        if (savedSettings) {
            reportProgress('Restoring existing UE4SS-settings.ini...');
            fs.writeFileSync(settingsIni, savedSettings);
        }

        // GERONIMO (UE 5.7.4) needs custom AOB signatures — the stock scan fails without them.
        // Pull the "Far Far West" config (also UE 5.7) from UE4SS's zCustomGameConfigs:
        // its FName_Constructor.lua + GNatives.lua make the scan succeed, and its
        // UE4SS-settings.ini carries the 5.7 engine override + tuned hooks.
        const sigDir = path.join(ue4ssDir, 'UE4SS_Signatures');
        const haveSigs = fs.existsSync(path.join(sigDir, 'FName_Constructor.lua'));
        if (!haveSigs || !savedSettings) {
            reportProgress('Fetching UE 5.7 signatures (Far Far West config)...');
            const cfgUrl = 'https://github.com/UE4SS-RE/RE-UE4SS/releases/download/experimental-latest/zCustomGameConfigs.zip';
            const cfgZip = path.join(app.getPath('temp'), 'ue4ss_cfg.zip');
            const cfgDir = path.join(app.getPath('temp'), 'ue4ss_cfg_extract');
            await downloadFile(cfgUrl, cfgZip, reportProgress);
            if (fs.existsSync(cfgDir)) fs.rmSync(cfgDir, { recursive: true, force: true });
            await extract(cfgZip, { dir: cfgDir });
            const ffw = path.join(cfgDir, 'Far Far West');

            if (!haveSigs) {
                reportProgress('Installing UE 5.7 signatures...');
                fs.mkdirSync(sigDir, { recursive: true });
                for (const sig of ['FName_Constructor.lua', 'GNatives.lua']) {
                    const src = path.join(ffw, 'UE4SS_Signatures', sig);
                    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(sigDir, sig));
                }
            }
            // Only lay down the 5.7 settings on a fresh install — never clobber user tuning.
            if (!savedSettings) {
                const srcIni = path.join(ffw, 'UE4SS-settings.ini');
                if (fs.existsSync(srcIni)) fs.copyFileSync(srcIni, settingsIni);
            }
            fs.rmSync(cfgDir, { recursive: true, force: true });
            if (fs.existsSync(cfgZip)) fs.unlinkSync(cfgZip);
        }

        reportProgress('Cleaning up temporary files...');
        if (fs.existsSync(tempZipPath)) {
            fs.unlinkSync(tempZipPath);
        }

        reportProgress('Finalizing Mod directory structure...');
        const modsPath = getUE4SSModsPath(gamePath);
        if(!fs.existsSync(modsPath)) fs.mkdirSync(modsPath, { recursive: true });
        if(!fs.existsSync(path.join(modsPath, 'mods.txt'))) {
            fs.writeFileSync(path.join(modsPath, 'mods.txt'), '');
        }

        return { success: true };
    } catch(e) {
        return { success: false, error: e.message };
    }
});

// Helper for folder size
function getFolderSize(folderPath) {
    let totalSize = 0;
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                totalSize += getFolderSize(path.join(folderPath, file.name));
            } else {
                totalSize += fs.statSync(path.join(folderPath, file.name)).size;
            }
        }
    }
    return totalSize;
}

// Germodimo Mod Manager Core
ipcMain.handle('mod:listMods', async (event, gamePath) => {
    const mods = [];
    try {
        // Scan for Pak mods
        const paksDir = getPaksPath(gamePath);
        if (fs.existsSync(paksDir)) {
            const files = fs.readdirSync(paksDir);
            // group the IoStore triplet (.pak/.ucas/.utoc) into ONE mod entry
            const seen = new Set();
            for (const file of files) {
                if (!(isPakFile(file) || file.endsWith('.disabled'))) continue;
                const base = pakBaseName(file);
                if (seen.has(base)) continue;
                seen.add(base);
                const group = files.filter(f => pakBaseName(f) === base);
                const size = group.reduce((s, f) => {
                    try { return s + fs.statSync(path.join(paksDir, f)).size; } catch { return s; }
                }, 0);
                const stats = fs.statSync(path.join(paksDir, file));
                mods.push({
                    name: base,
                    type: 'pak',
                    enabled: !group.some(f => f.endsWith('.disabled')),
                    hasConfig: false,
                    size,
                    installTime: stats.mtimeMs
                });
            }
        }

        // Scan for UE4SS Scripts
        const scriptsDir = getUE4SSModsPath(gamePath);
        if (fs.existsSync(scriptsDir)) {
            const modsTxtPath = path.join(scriptsDir, 'mods.txt');
            let enabledMods = [];
            if (fs.existsSync(modsTxtPath)) {
                const content = fs.readFileSync(modsTxtPath, 'utf8');
                enabledMods = content.split('\n').filter(l => l.includes('1')).map(l => l.split(':')[0].trim());
            }

            const folders = fs.readdirSync(scriptsDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
            for (const folder of folders) {
                // Ignore standard UE4SS internal folders if they exist
                if (folder.name === 'shared' || folder.name === 'docs') continue;
                
                const modPath = path.join(scriptsDir, folder.name);
                // A mod is "configurable" if it ships a config.json (the UI's editable source).
                const hasConfig = fs.existsSync(path.join(modPath, 'config.json'));
                const stats = fs.statSync(modPath);
                
                mods.push({
                    name: folder.name,
                    type: 'script',
                    enabled: enabledMods.includes(folder.name),
                    hasConfig: hasConfig,
                    size: getFolderSize(modPath),
                    installTime: stats.mtimeMs
                });
            }
        }
        return mods;} catch(e) {
        console.error("Error listing mods:", e);
    }
    return mods;
});

ipcMain.handle('mod:installMod', async (event, { gamePath, modPath }) => {
    try {
        const tempExtractedPath = path.join(app.getPath('temp'), 'germodimo_extract_' + Date.now());
        
        if (modPath.endsWith('.zip')) {
            await extract(modPath, { dir: tempExtractedPath });
            
            // Very naive installation logic for MVP
            // Route .pak files to Paks folder, and folders containing main.lua to Scripts folder
            const processDirectory = (currentDir) => {
                const items = fs.readdirSync(currentDir, { withFileTypes: true });
                for (const item of items) {
                    const itemPath = path.join(currentDir, item.name);
                    if (item.isDirectory()) {
                        // Check if it's a Lua script mod folder
                        if (fs.existsSync(path.join(itemPath, 'Scripts', 'main.lua')) || fs.existsSync(path.join(itemPath, 'main.lua'))) {
                            const target = path.join(getUE4SSModsPath(gamePath), item.name);
                            if(!fs.existsSync(target)) fs.mkdirSync(target, {recursive: true});
                            // copy directory logic would go here
                            fs.cpSync(itemPath, target, { recursive: true });
                        } else {
                            processDirectory(itemPath); // recurse
                        }
                    } else if (isPakFile(item.name)) {
                        // copies .pak/.ucas/.utoc — IoStore mods need all three
                        const target = getPaksPath(gamePath);
                        if(!fs.existsSync(target)) fs.mkdirSync(target, {recursive: true});
                        fs.copyFileSync(itemPath, path.join(target, item.name));
                    }
                }
            };
            processDirectory(tempExtractedPath);
            fs.rmSync(tempExtractedPath, { recursive: true, force: true });
            return { success: true };
        }
        // bare pak files can be dropped directly (.pak / .ucas / .utoc)
        if (isPakFile(modPath)) {
            const target = getPaksPath(gamePath);
            if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
            const base = pakBaseName(path.basename(modPath));
            const srcDir = path.dirname(modPath);
            // grab any sibling members of the same triplet so the mod isn't installed half-broken
            let copied = 0;
            for (const f of fs.readdirSync(srcDir)) {
                if (isPakFile(f) && pakBaseName(f) === base) {
                    fs.copyFileSync(path.join(srcDir, f), path.join(target, f));
                    copied++;
                }
            }
            return { success: true, note: `${copied} pak file(s) installed` };
        }
        return { success: false, error: "Unsupported file. Drop a .zip, or a .pak/.ucas/.utoc." };
    } catch(e) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('mod:toggleMod', async (event, { gamePath, modName, modType, enable }) => {
    try {
        if (modType === 'pak') {
            const paksDir = getPaksPath(gamePath);
            // toggle EVERY file of the triplet (.pak/.ucas/.utoc)
            const group = fs.readdirSync(paksDir).filter(f => pakBaseName(f) === modName);
            for (const f of group) {
                const from = path.join(paksDir, f);
                const to = enable
                    ? path.join(paksDir, f.replace(/\.disabled$/i, ''))
                    : (f.endsWith('.disabled') ? from : path.join(paksDir, f + '.disabled'));
                if (from !== to && fs.existsSync(from)) fs.renameSync(from, to);
            }
        } else if (modType === 'script') {
            const modsTxtPath = path.join(getUE4SSModsPath(gamePath), 'mods.txt');
            if (fs.existsSync(modsTxtPath)) {
                let lines = fs.readFileSync(modsTxtPath, 'utf8').split('\n');
                let found = false;
                lines = lines.map(line => {
                    if (line.trim().toLowerCase().startsWith(modName.toLowerCase())) {
                        found = true;
                        return `${modName} : ${enable ? '1' : '0'}`;
                    }
                    return line;
                });
                if (!found) lines.push(`${modName} : ${enable ? '1' : '0'}`);
                fs.writeFileSync(modsTxtPath, lines.join('\n'));
            } else {
                fs.writeFileSync(modsTxtPath, `${modName} : ${enable ? '1' : '0'}`);
            }
        }
        return { success: true };
    } catch(e) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('mod:readConfig', async (event, { gamePath, modName, modType }) => {
    try {
        if (modType === 'script') {
            const modPath = path.join(getUE4SSModsPath(gamePath), modName);
            const jsonConfig = path.join(modPath, 'config.json');
            
            // config.json is the single source of truth the UI edits.
            if (fs.existsSync(jsonConfig)) {
                const raw = fs.readFileSync(jsonConfig, 'utf8');
                // Capture stock defaults the first time we ever read this mod's config,
                // so "Reset to Default" always has something to revert to.
                const defPath = path.join(modPath, 'config.default.json');
                if (!fs.existsSync(defPath)) fs.writeFileSync(defPath, raw);
                return { success: true, data: JSON.parse(raw), format: 'json' };
            }
            return { success: false, error: "This mod has no config.json." };
        }
        return { success: false, error: "Only script mods currently support config editing." };
    } catch(e) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('mod:readConfigDefaults', async (event, { gamePath, modName, modType }) => {
    try {
        if (modType !== 'script') return { success: false, error: "No defaults for this mod type." };
        const modPath = path.join(getUE4SSModsPath(gamePath), modName);
        const defPath = path.join(modPath, 'config.default.json');
        if (fs.existsSync(defPath)) {
            return { success: true, data: JSON.parse(fs.readFileSync(defPath, 'utf8')) };
        }
        // Fallback: nothing captured yet — treat current config as the baseline.
        const jsonConfig = path.join(modPath, 'config.json');
        if (fs.existsSync(jsonConfig)) {
            return { success: true, data: JSON.parse(fs.readFileSync(jsonConfig, 'utf8')) };
        }
        return { success: false, error: "No defaults found." };
    } catch(e) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('mod:saveConfig', async (event, { gamePath, modName, modType, configData }) => {
    try {
        if (modType === 'script') {
            const modPath = path.join(getUE4SSModsPath(gamePath), modName);
            const jsonConfig = path.join(modPath, 'config.json');
            
            if (fs.existsSync(jsonConfig)) {
                fs.writeFileSync(jsonConfig, JSON.stringify(configData, null, 2));

                // Auto-generate config.lua INTO Scripts/ so the mod can `require("config")`.
                // (UE4SS resolves requires from the mod's Scripts/ folder, not the mod root.)
                let luaStr = 'return {\n';
                for (let k in configData) {
                    if (typeof configData[k] === 'string') luaStr += `  ${k} = "${configData[k]}",\n`;
                    else luaStr += `  ${k} = ${configData[k]},\n`;
                }
                luaStr += '}\n';
                const scriptsDir = path.join(modPath, 'Scripts');
                if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });
                fs.writeFileSync(path.join(scriptsDir, 'config.lua'), luaStr);

                return { success: true };
            }
        }
        return { success: true };
    } catch(e) {
        return { success: false, error: e.message };
    }
});

// Advanced Features IPC Handlers
ipcMain.handle('system:launchGame', async (event, gamePath) => {
    const exePath = path.join(gamePath, 'Geronimo', 'Binaries', 'Win64', 'Geronimo-Win64-Shipping.exe');
    if (fs.existsSync(exePath)) {
        exec(`"${exePath}"`);
        return { success: true };
    }
    return { success: false, error: "Executable not found" };
});

ipcMain.handle('system:killGame', async () => {
    exec('taskkill /IM Geronimo-Win64-Shipping.exe /F');
    return { success: true };
});

ipcMain.handle('system:backupSaves', async (event) => {
    try {
        const localAppData = process.env.LOCALAPPDATA;
        const savesPath = path.join(localAppData, 'Geronimo', 'Saved', 'SaveGames');
        if (!fs.existsSync(savesPath)) return { success: false, error: "Saves not found" };
        
        const backupPath = path.join(app.getPath('userData'), `SaveBackup_${Date.now()}`);
        fs.cpSync(savesPath, backupPath, { recursive: true });
        return { success: true, path: backupPath };
    } catch(e) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('mod:deleteMod', async (event, { gamePath, modName, modType }) => {
    try {
        if (modType === 'pak') {
            const paksDir = getPaksPath(gamePath);
            // remove every file of the triplet (.pak/.ucas/.utoc, enabled or .disabled)
            for (const f of fs.readdirSync(paksDir)) {
                if (pakBaseName(f) === modName) {
                    try { fs.unlinkSync(path.join(paksDir, f)); } catch {}
                }
            }
        } else if (modType === 'script') {
            const scriptsDir = getUE4SSModsPath(gamePath);
            const modDir = path.join(scriptsDir, modName);
            if (fs.existsSync(modDir)) fs.rmSync(modDir, { recursive: true, force: true });
            
            const modsTxtPath = path.join(scriptsDir, 'mods.txt');
            if (fs.existsSync(modsTxtPath)) {
                let lines = fs.readFileSync(modsTxtPath, 'utf8').split('\n');
                lines = lines.filter(l => !l.startsWith(modName + ' :'));
                fs.writeFileSync(modsTxtPath, lines.join('\n'));
            }
        }
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
});

ipcMain.handle('mod:moveModPriority', async (event, { gamePath, modName, direction }) => {
    try {
        const paksDir = getPaksPath(gamePath);
        if (!fs.existsSync(paksDir)) return { success: false };
        let files = fs.readdirSync(paksDir).filter(f => f.endsWith('.pak') || f.endsWith('.disabled'));
        files.sort();
        
        const idx = files.findIndex(f => f.startsWith(modName));
        if (idx === -1) return { success: false };
        
        let targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= files.length) return { success: false };
        
        const temp = files[idx];
        files[idx] = files[targetIdx];
        files[targetIdx] = temp;
        
        files.forEach((file, i) => {
            const ext = file.endsWith('.pak') ? '.pak' : '.disabled';
            let cleanName = file.replace(/^\d+_/, '').replace('.pak', '').replace('.disabled', '');
            const newName = `${i.toString().padStart(2, '0')}_${cleanName}${ext}`;
            if (file !== newName) {
                fs.renameSync(path.join(paksDir, file), path.join(paksDir, `TEMP_${newName}`));
            }
        });
        
        const tempFiles = fs.readdirSync(paksDir).filter(f => f.startsWith('TEMP_'));
        tempFiles.forEach(f => fs.renameSync(path.join(paksDir, f), path.join(paksDir, f.replace('TEMP_', ''))));
        
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
});

ipcMain.handle('settings:get', async () => {
    return currentSettings;
});

ipcMain.handle('settings:set', async (event, { key, value }) => {
    currentSettings[key] = value;
    saveSettings(currentSettings);
    return { success: true };
});

ipcMain.handle('system:uninstallAllMods', async (event, gamePath) => {
    try {
        const paksDir = getPaksPath(gamePath);
        if (fs.existsSync(paksDir)) fs.rmSync(paksDir, { recursive: true, force: true });

        // New experimental layout: whole ue4ss\ folder + the dwmapi.dll proxy loader.
        const binariesPath = path.join(gamePath, 'Geronimo', 'Binaries', 'Win64');
        const ue4ssDir = path.join(binariesPath, 'ue4ss');
        if (fs.existsSync(ue4ssDir)) fs.rmSync(ue4ssDir, { recursive: true, force: true });
        if (fs.existsSync(path.join(binariesPath, 'dwmapi.dll'))) fs.unlinkSync(path.join(binariesPath, 'dwmapi.dll'));

        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
});

ipcMain.handle('system:uninstallApp', async () => {
    const uninstallerPath = path.join(path.dirname(app.getPath('exe')), 'Uninstall Germodimo.exe');
    if (fs.existsSync(uninstallerPath)) {
        exec(`"${uninstallerPath}"`);
        app.isQuitting = true;
        app.quit();
    }
    return { success: true };
});
