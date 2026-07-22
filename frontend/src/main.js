import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="titlebar-drag-region">GERMODIMO SUBSYSTEM [ACTIVE]</div>
  <nav class="sidebar">
    <div class="brand">
      <div class="brand-icon"></div>
      <h1>GERMODIMO</h1>
    </div>
    
    <div class="nav-item active" data-target="dashboard">[01] DASHBOARD</div>
    <div class="nav-item" data-target="ue4ss">[02] UE4SS SYSTEM</div>
    <div class="nav-item" data-target="mods">[03] MODULATIONS</div>
    <div class="nav-item" data-target="settings">[04] SETTINGS</div>
  </nav>

  <main class="main-content">
    <div class="header" style="margin-bottom: 2rem;">
      <h2 id="page-title">SYSTEM DASHBOARD</h2>
      <div class="status-badge" id="game-status">
        <div class="status-indicator" style="background: var(--danger); box-shadow: 0 0 8px var(--danger);"></div>
        INITIATING SCAN...
      </div>
    </div>
    
    <div id="tab-content">
        <!-- Dashboard Tab -->
        <div class="tab-pane active" id="pane-dashboard">
            <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                <button class="btn" id="btn-play-game">EXECUTE GERONIMO</button>
                <button class="btn" id="btn-backup-saves" style="flex: 1;">BACKUP SAVEDATA</button>
            </div>

            <div id="path-config" class="mod-card" style="margin-bottom: 2rem;">
                <h3>INSTALLATION PATH</h3>
                <p id="game-path-text" style="font-family: monospace; color: var(--accent); margin-bottom: 1rem; margin-top: 0.5rem;">C:\UNKNOWN_PATH</p>
                <div id="piracy-warning" style="display: none; background: rgba(255,68,68,0.1); border-left: 2px solid var(--danger); padding: 1rem; margin-bottom: 1rem; color: var(--danger);">
                    <strong>[ WARNING ]</strong> Unofficial/modified game executable detected. Subsystem instability expected.
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn" id="btn-browse">BROWSE DIRECTORY</button>
                    <button class="btn" id="btn-open-folder" style="display: none;">OPEN EXPLORER</button>
                </div>
            </div>
        </div>

        <!-- UE4SS Tab -->
        <div class="tab-pane" id="pane-ue4ss" style="display: none;">
            <div class="mod-card">
                <h3>UE4SS INJECTION ENGINE</h3>
                <p style="margin-top: 0.5rem; color: var(--text-muted);">Required subsystem for code modulations and developer console access.</p>
                <p id="ue4ss-status-text" style="font-family: monospace; margin-top: 1rem; margin-bottom: 1rem;">STATUS: <span style="color: var(--text-muted);">UNKNOWN</span></p>
                <button class="btn primary" id="btn-install-ue4ss">INSTALL UE4SS ENGINE</button>
            </div>
        </div>

        <!-- Mod Manager Tab -->
        <div class="tab-pane" id="pane-mods" style="display: none;">
            <div class="mod-card" style="margin-bottom: 1.5rem;">
                <h3>DEPLOY NEW MODULE</h3>
                <div id="dropzone" style="border: 1px dashed var(--border-color); padding: 2.5rem; text-align: center; color: var(--text-muted); cursor: pointer; transition: all 0.2s ease; margin-top: 1rem;">
                    DRAG &amp; DROP MOD (.ZIP or .PAK)<br>
                    <span style="font-size: 0.8rem; margin-top: 0.5rem; display: block;">OR CLICK TO BROWSE LOCAL FILES</span>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <input type="text" id="mod-search" placeholder="QUERY MODULE..." style="flex: 1; background: var(--bg-base); border: 1px solid var(--border-color); color: #fff; padding: 0.5rem; font-family: var(--font-mono); outline: none;">
                <select id="mod-sort" style="background: var(--bg-base); border: 1px solid var(--border-color); color: #fff; padding: 0.5rem; font-family: var(--font-mono); outline: none; cursor: pointer;">
                    <option value="name_asc">SORT: NAME (A-Z)</option>
                    <option value="enabled_first">SORT: ENABLED</option>
                    <option value="disabled_first">SORT: DISABLED</option>
                    <option value="time_desc">SORT: NEWEST</option>
                    <option value="size_desc">SORT: SIZE (MAX)</option>
                </select>
            </div>

            <div class="header" style="margin-bottom: 1rem; justify-content: space-between; border-bottom: none; padding-bottom: 0;">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <input type="checkbox" id="chk-select-all" class="tactical-checkbox">
                    <h3 id="custom-mods-title" style="font-size: 1.2rem;">CUSTOM MODULES</h3>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn danger" id="btn-delete-selected" style="display: none;">PURGE SELECTED</button>
                    <button class="btn" id="btn-refresh-mods">RESCAN</button>
                </div>
            </div>
            
            <div id="mod-list-container" style="display: flex; flex-direction: column; gap: 1rem;">
                <p style="color: var(--text-muted); font-family: var(--font-mono);">[NO MODULES DETECTED]</p>
            </div>

            <div class="collapsible-header" id="core-modules-header">
                <span>[+] CORE UE4SS MODULES</span>
            </div>
            <div class="collapsible-content" id="core-modules-container">
                <!-- Core mods go here -->
            </div>
        </div>

        <!-- Settings Tab -->
        <div class="tab-pane" id="pane-settings" style="display: none;">
            <div class="mod-card" style="margin-bottom: 2rem;">
                <h3>SYSTEM INTEGRATION</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer;">
                        <input type="checkbox" id="chk-startup" class="tactical-checkbox">
                        <div>
                            <strong>LAUNCH ON OS BOOT</strong>
                            <div style="font-size: 0.85rem; color: var(--text-muted);">Initialize subsystem silently in System Tray.</div>
                        </div>
                    </label>
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer;">
                        <input type="checkbox" id="chk-game-monitor" class="tactical-checkbox">
                        <div>
                            <strong>PROCESS MONITORING</strong>
                            <div style="font-size: 0.85rem; color: var(--text-muted);">Deploy interface automatically when Geronimo.exe is detected.</div>
                        </div>
                    </label>
                </div>
            </div>

            <div class="mod-card" style="margin-bottom: 2rem;">
                <h3>APPEARANCE</h3>
                <div style="margin-top: 1rem;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem;">COLOUR SCHEME</div>
                    <div id="theme-grid" style="display: flex; flex-wrap: wrap; gap: 0.6rem;"></div>
                </div>
                <div style="margin-top: 1.5rem;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem;">LAYOUT DENSITY</div>
                    <div id="layout-grid" style="display: flex; flex-wrap: wrap; gap: 0.6rem;"></div>
                </div>
            </div>

            <div class="mod-card" style="border-color: var(--danger-dim);">
                <h3 style="color: var(--danger);">CRITICAL OPERATIONS</h3>
                <p style="color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 1.5rem;">WARNING: ACTIONS ARE IRREVERSIBLE.</p>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn danger" id="btn-uninstall-mods">PURGE ALL MODULES</button>
                    <button class="btn danger" id="btn-uninstall-app">UNINSTALL GERMODIMO</button>
                </div>
            </div>
        </div>
    </div>
  </main>

  <!-- Config Modal Overlay -->
  <div id="config-modal" style="display: none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(5,5,5,0.9); z-index: 1000; justify-content: center; align-items: center;">
      <div class="mod-card" style="width: 500px; max-height: 80vh; display: flex; flex-direction: column; border: 1px solid var(--accent);">
          <h3 id="config-modal-title" style="margin-bottom: 1rem; color: var(--accent);">MODULE CONFIGURATION</h3>
          <div id="config-modal-content" style="overflow-y: auto; flex-grow: 1; padding-right: 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 1rem; font-family: var(--font-mono);"></div>
          <div style="display: flex; gap: 1rem; justify-content: space-between;">
              <button class="btn danger" id="btn-config-reset" style="width: auto;">RESET TO DEFAULT</button>
              <div style="display: flex; gap: 1rem;">
                  <button class="btn" id="btn-config-cancel" style="width: auto;">ABORT</button>
                  <button class="btn primary" id="btn-config-save" style="width: auto;">COMMIT CHANGES</button>
              </div>
          </div>
      </div>
  </div>
`

// Core UE4SS Mods that should be grouped
const CORE_MODS = [
    'BPModLoaderMod', 
    'CheatManagerEnablerMod', 
    'ConsoleBindings', 
    'Keybinds', 
    'LineTraceMod',
    'ActorDumperMod',
    'BPML_GenericFunctions',
    'ConsoleCommandsMod',
    'ConsoleEnablerMod',
    'JSBLuaProfilerMod',
    'SplitScreenMod'
];

let currentGamePath = null;
let currentEditingMod = null;
let currentConfigData = null;
let loadedMods = [];

// Tab Logic
const navItems = document.querySelectorAll('.nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');
const pageTitle = document.getElementById('page-title');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        tabPanes.forEach(pane => pane.style.display = 'none');
        
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        document.getElementById('pane-' + targetId).style.display = 'block';
        
        if(targetId === 'dashboard') pageTitle.textContent = "SYSTEM DASHBOARD";
        else if(targetId === 'ue4ss') pageTitle.textContent = "UE4SS ENGINE STATUS";
        else if(targetId === 'mods') pageTitle.textContent = "MODULE MANAGEMENT";
        else if(targetId === 'settings') pageTitle.textContent = "SYSTEM SETTINGS";

        if (targetId === 'mods') loadMods();
        if (targetId === 'settings') loadSettings();
    });
});

// Collapsible Core Mods
const coreModsHeader = document.getElementById('core-modules-header');
const coreModsContainer = document.getElementById('core-modules-container');
coreModsHeader.addEventListener('click', () => {
    const isOpen = coreModsContainer.classList.contains('open');
    if (isOpen) {
        coreModsContainer.classList.remove('open');
        coreModsHeader.innerHTML = '<span>[+] CORE UE4SS MODULES</span>';
    } else {
        coreModsContainer.classList.add('open');
        coreModsHeader.innerHTML = '<span>[-] CORE UE4SS MODULES</span>';
    }
});

// Electron IPC Integration
const gameStatusBadge = document.getElementById('game-status');
const gamePathText = document.getElementById('game-path-text');
const btnBrowse = document.getElementById('btn-browse');
const btnOpenFolder = document.getElementById('btn-open-folder');
const btnPlayGame = document.getElementById('btn-play-game');
const btnBackupSaves = document.getElementById('btn-backup-saves');
const piracyWarning = document.getElementById('piracy-warning');
const ue4ssStatusText = document.getElementById('ue4ss-status-text');
const btnInstallUE4SS = document.getElementById('btn-install-ue4ss');

async function checkGameStatus(customPath = null) {
    if (!window.electronAPI) return;
    
    gameStatusBadge.innerHTML = '<div class="status-indicator" style="background: #e2b340; box-shadow: 0 0 8px #e2b340;"></div> SCANNING...';
    
    const result = await window.electronAPI.checkGame(customPath);
    
    if (result.found) {
        currentGamePath = result.path;
        gameStatusBadge.innerHTML = '<div class="status-indicator" style="background: var(--accent); box-shadow: 0 0 8px var(--accent);"></div> TARGET ACQUIRED';
        gamePathText.textContent = result.path;
        btnOpenFolder.style.display = 'block';
        piracyWarning.style.display = result.isCracked ? 'block' : 'none';
        
        if (result.ue4ssInstalled) {
            ue4ssStatusText.innerHTML = `STATUS: <span style="color: var(--accent);">ACTIVE</span>`;
            btnInstallUE4SS.textContent = "UPDATE / REINSTALL UE4SS";
        } else {
            ue4ssStatusText.innerHTML = `STATUS: <span style="color: var(--danger);">OFFLINE</span>`;
            btnInstallUE4SS.textContent = "INSTALL UE4SS ENGINE";
        }
    } else {
        currentGamePath = null;
        gameStatusBadge.innerHTML = '<div class="status-indicator" style="background: var(--danger); box-shadow: 0 0 8px var(--danger);"></div> TARGET NOT FOUND';
        gamePathText.textContent = "MANUAL DIRECTORY SELECTION REQUIRED.";
        btnOpenFolder.style.display = 'none';
        piracyWarning.style.display = 'none';
        btnInstallUE4SS.textContent = "INSTALL UE4SS ENGINE";
    }
}

btnBrowse.addEventListener('click', async () => {
    if (window.electronAPI) {
        const selectedPath = await window.electronAPI.openDirectory();
        if (selectedPath) checkGameStatus(selectedPath);
    }
});

btnOpenFolder.addEventListener('click', () => {
    if (window.electronAPI && currentGamePath) {
        window.electronAPI.openFolder(currentGamePath);
    }
});

let isGameProcessRunning = false;

if (window.electronAPI && window.electronAPI.onGameStatusChange) {
    window.electronAPI.onGameStatusChange((running) => {
        isGameProcessRunning = running;
        if (running) {
            btnPlayGame.textContent = "KILL GERONIMO";
            btnPlayGame.classList.add('danger');
            btnPlayGame.classList.remove('primary');
        } else {
            btnPlayGame.textContent = "EXECUTE GERONIMO";
            btnPlayGame.classList.remove('danger');
            btnPlayGame.classList.add('primary');
        }
    });
}

btnPlayGame.addEventListener('click', async () => {
    if (window.electronAPI && currentGamePath) {
        if (isGameProcessRunning) {
            await window.electronAPI.killGame();
        } else {
            window.electronAPI.launchGame(currentGamePath);
        }
    }
});

btnBackupSaves.addEventListener('click', async () => {
    if (window.electronAPI) {
        btnBackupSaves.textContent = "EXECUTING BACKUP...";
        const res = await window.electronAPI.backupSaves();
        if (res.success) {
            alert("SAVEDATA ARCHIVED AT:\n" + res.path);
        } else {
            alert("BACKUP FAILURE: " + res.error);
        }
        btnBackupSaves.textContent = "BACKUP SAVEDATA";
    }
});

if (window.electronAPI && window.electronAPI.onInstallProgress) {
    window.electronAPI.onInstallProgress((msg) => {
        btnInstallUE4SS.textContent = msg.toUpperCase();
    });
}

btnInstallUE4SS.addEventListener('click', async () => {
    if (!currentGamePath) return alert("TARGET DIRECTORY REQUIRED.");
    btnInstallUE4SS.textContent = "ESTABLISHING CONNECTION...";
    btnInstallUE4SS.disabled = true;
    
    const res = await window.electronAPI.installUE4SS(currentGamePath);
    if (res.success) {
        alert("UE4SS DEPLOYMENT SUCCESSFUL.");
        checkGameStatus(currentGamePath);
    } else {
        alert("DEPLOYMENT FAILURE: " + res.error);
    }
    btnInstallUE4SS.disabled = false;
});

// Mod Manager Logic
const modListContainer = document.getElementById('mod-list-container');
const btnRefreshMods = document.getElementById('btn-refresh-mods');
const chkSelectAll = document.getElementById('chk-select-all');
const btnDeleteSelected = document.getElementById('btn-delete-selected');

function updateBulkDeleteButton() {
    const checkboxes = document.querySelectorAll('.mod-checkbox');
    const anyChecked = Array.from(checkboxes).some(c => c.checked);
    btnDeleteSelected.style.display = anyChecked ? 'block' : 'none';
}

chkSelectAll.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.mod-checkbox');
    checkboxes.forEach(c => c.checked = e.target.checked);
    updateBulkDeleteButton();
});

btnDeleteSelected.addEventListener('click', async () => {
    if(!confirm("WARNING: PERMANENTLY PURGE SELECTED MODULES?")) return;
    
    const checkboxes = document.querySelectorAll('.mod-checkbox:checked');
    const modsToDelete = Array.from(checkboxes).map(c => JSON.parse(c.dataset.mod));
    
    btnDeleteSelected.textContent = "PURGING...";
    for (const mod of modsToDelete) {
        await window.electronAPI.deleteMod(currentGamePath, mod.name, mod.type);
    }
    chkSelectAll.checked = false;
    btnDeleteSelected.textContent = "PURGE SELECTED";
    btnDeleteSelected.style.display = 'none';
    loadMods();
});

let savedScroll = 0;

async function loadMods() {
    const mainContent = document.querySelector('.main-content');
    savedScroll = mainContent ? mainContent.scrollTop : 0;

    if (!currentGamePath || !window.electronAPI) return;
    
    loadedMods = await window.electronAPI.listMods(currentGamePath);
    renderMods();
}

function renderMods() {
    if (!loadedMods || loadedMods.length === 0) {
        modListContainer.innerHTML = '<p style="color: var(--text-muted); font-family: var(--font-mono);">[NO MODULES DETECTED]</p>';
        chkSelectAll.checked = false;
        btnDeleteSelected.style.display = 'none';
        document.getElementById('custom-mods-title').textContent = 'CUSTOM MODULES (0)';
        return;
    }

    const searchInput = document.getElementById('mod-search').value.toLowerCase();
    const sortValue = document.getElementById('mod-sort').value;

    let filteredMods = loadedMods.filter(mod => mod.name.toLowerCase().includes(searchInput));

    filteredMods.sort((a, b) => {
        if (sortValue === 'name_asc') return a.name.localeCompare(b.name);
        if (sortValue === 'enabled_first') return (a.enabled === b.enabled) ? 0 : a.enabled ? -1 : 1;
        if (sortValue === 'disabled_first') return (a.enabled === b.enabled) ? 0 : a.enabled ? 1 : -1;
        if (sortValue === 'time_desc') return b.installTime - a.installTime;
        if (sortValue === 'size_desc') return b.size - a.size;
        return 0;
    });

    modListContainer.innerHTML = '';
    coreModsContainer.innerHTML = '';
    
    let customCount = 0;
    let coreCount = 0;
    const lowerCoreMods = CORE_MODS.map(c => c.toLowerCase());

    filteredMods.forEach(mod => {
        const isCore = lowerCoreMods.includes(mod.name.toLowerCase());
        if (isCore) coreCount++;
        else customCount++;

        const modEl = document.createElement('div');
        modEl.className = 'mod-card';
        modEl.style.padding = '0.8rem 1rem';
        modEl.style.display = 'flex';
        modEl.style.justifyContent = 'space-between';
        modEl.style.alignItems = 'center';

        const leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.alignItems = 'center';
        leftDiv.style.gap = '1rem';

        if (!isCore) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'tactical-checkbox mod-checkbox';
            checkbox.dataset.mod = JSON.stringify(mod);
            checkbox.addEventListener('change', updateBulkDeleteButton);
            leftDiv.appendChild(checkbox);
        }

        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `
            <h4 style="margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-mono); letter-spacing: 0px;">
                ${mod.name} 
                <span style="font-size: 0.7rem; color: var(--text-muted); padding: 0.1rem 0.4rem; border: 1px solid var(--border-color);">${mod.type.toUpperCase()}</span>
            </h4>
        `;

        leftDiv.appendChild(infoDiv);

        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '0.5rem';
        controlsDiv.style.alignItems = 'center';

        // Load Order arrows for Pak mods
        if (mod.type === 'pak') {
            const btnUp = document.createElement('button');
            btnUp.className = 'btn';
            btnUp.style.padding = '0.3rem 0.6rem';
            btnUp.textContent = 'PRIO UP';
            btnUp.onclick = async () => {
                await window.electronAPI.moveModPriority(currentGamePath, mod.name, 'up');
                loadMods();
            };
            const btnDown = document.createElement('button');
            btnDown.className = 'btn';
            btnDown.style.padding = '0.3rem 0.6rem';
            btnDown.textContent = 'PRIO DN';
            btnDown.onclick = async () => {
                await window.electronAPI.moveModPriority(currentGamePath, mod.name, 'down');
                loadMods();
            };
            controlsDiv.appendChild(btnUp);
            controlsDiv.appendChild(btnDown);
        }

        if (mod.hasConfig) {
            const btnConfig = document.createElement('button');
            btnConfig.className = 'btn';
            btnConfig.style.padding = '0.3rem 0.8rem';
            btnConfig.textContent = 'CONFIG';
            btnConfig.onclick = () => openConfigModal(mod);
            controlsDiv.appendChild(btnConfig);
        }

        const btnToggle = document.createElement('button');
        btnToggle.className = mod.enabled ? 'btn primary' : 'btn';
        btnToggle.style.width = '100px';
        btnToggle.style.padding = '0.3rem 0.8rem';
        btnToggle.textContent = mod.enabled ? 'ENABLED' : 'DISABLED';
        if(!mod.enabled) {
            btnToggle.style.background = 'transparent';
            btnToggle.style.color = 'var(--text-muted)';
        }
        btnToggle.onclick = async () => {
            const res = await window.electronAPI.toggleMod(currentGamePath, mod.name, mod.type, !mod.enabled);
            if(res && !res.success) alert("TOGGLE ERROR: " + res.error);
            loadMods();
        };
        controlsDiv.appendChild(btnToggle);

        if (!isCore) {
            const btnDel = document.createElement('button');
            btnDel.className = 'btn danger';
            btnDel.style.padding = '0.3rem 0.8rem';
            btnDel.textContent = 'DELETE';
            btnDel.onclick = async () => {
                if(confirm(`PURGE ${mod.name}?`)) {
                    await window.electronAPI.deleteMod(currentGamePath, mod.name, mod.type);
                    loadMods();
                }
            };
            controlsDiv.appendChild(btnDel);
        }

        modEl.appendChild(leftDiv);
        modEl.appendChild(controlsDiv);
        
        if (isCore) {
            coreModsContainer.appendChild(modEl);
        } else {
            modListContainer.appendChild(modEl);
        }
    });

    document.getElementById('custom-mods-title').textContent = `CUSTOM MODULES (${customCount})`;
    
    const isOpen = coreModsContainer.classList.contains('open');
    coreModsHeader.innerHTML = `<span>[${isOpen ? '-' : '+'}] CORE UE4SS MODULES (${coreCount})</span>`;

    if (customCount === 0) {
        modListContainer.innerHTML = '<p style="color: var(--text-muted); font-family: var(--font-mono);">[NO MODULES MATCH QUERY]</p>';
    }
    if (coreCount === 0) {
        coreModsHeader.style.display = 'none';
        coreModsContainer.style.display = 'none';
    } else {
        coreModsHeader.style.display = 'flex';
    }

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTop = savedScroll;
    }
}

document.getElementById('mod-search').addEventListener('input', renderMods);
document.getElementById('mod-sort').addEventListener('change', renderMods);

btnRefreshMods.addEventListener('click', loadMods);

// Drag and Drop Logic
const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--accent)';
    dropzone.style.background = 'var(--accent-dim)';
});

dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border-color)';
    dropzone.style.background = 'transparent';
});

dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border-color)';
    dropzone.style.background = 'transparent';
    
    if (!currentGamePath) return alert("TARGET DIRECTORY REQUIRED.");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        let filePath = files[0].path;
        if (!filePath && window.electronAPI.getPathForFile) {
            filePath = window.electronAPI.getPathForFile(files[0]);
        }
        
        if (!filePath || !filePath.toLowerCase().endsWith('.zip')) {
            alert("ONLY .ZIP ARCHIVES ARE SUPPORTED.");
            return;
        }

        dropzone.innerHTML = '[ EXTRACTING ARCHIVE... ]';
        const result = await window.electronAPI.installMod(currentGamePath, filePath);
        
        if (result.success) {
            loadMods();
        } else {
            alert("EXTRACTION FAILED: " + result.error);
        }
        dropzone.innerHTML = 'DRAG &amp; DROP MOD (.ZIP or .PAK)<br><span style="font-size: 0.8rem; margin-top: 0.5rem; display: block;">OR CLICK TO BROWSE LOCAL FILES</span>';
    }
});

dropzone.addEventListener('click', async () => {
    if (!currentGamePath) return alert("TARGET DIRECTORY REQUIRED.");
    const selectedPath = await window.electronAPI.openFileSelect();
    if (selectedPath) {
        dropzone.innerHTML = '[ EXTRACTING ARCHIVE... ]';
        const result = await window.electronAPI.installMod(currentGamePath, selectedPath);
        if (result.success) {
            loadMods();
        } else {
            alert("EXTRACTION FAILED: " + result.error);
        }
        dropzone.innerHTML = 'DRAG &amp; DROP MOD (.ZIP or .PAK)<br><span style="font-size: 0.8rem; margin-top: 0.5rem; display: block;">OR CLICK TO BROWSE LOCAL FILES</span>';
    }
});

// Config Modal Logic
const configModal = document.getElementById('config-modal');
const configModalContent = document.getElementById('config-modal-content');
const btnConfigCancel = document.getElementById('btn-config-cancel');
const btnConfigSave = document.getElementById('btn-config-save');

async function openConfigModal(mod) {
    currentEditingMod = mod;
    configModal.style.display = 'flex';
    document.getElementById('config-modal-title').textContent = `CONFIG: ${mod.name}`;
    configModalContent.innerHTML = '<p>READING REGISTRY...</p>';

    const config = await window.electronAPI.readModConfig(currentGamePath, mod.name, mod.type);
    if (!config.success) {
        configModalContent.innerHTML = `<p style="color: var(--danger)">I/O ERROR: ${config.error}</p>`;
        return;
    }

    renderConfigFields(config.data);
}

function renderConfigFields(data) {
    currentConfigData = data;
    configModalContent.innerHTML = '';

    // ColorR/ColorG/ColorB trio collapses into one native color picker.
    const keys = Object.keys(currentConfigData);
    const hasColorTrio = ['ColorR', 'ColorG', 'ColorB'].every(k => keys.includes(k));
    const toHex = v => Math.max(0, Math.min(255, Math.round(Number(v) || 0))).toString(16).padStart(2, '0');

    const styleField = (el) => {
        el.style.background = 'var(--bg-base)';
        el.style.border = '1px solid var(--border-color)';
        el.style.color = '#fff';
        el.style.padding = '0.4rem';
        el.style.fontFamily = 'var(--font-mono)';
    };

    for (const [key, value] of Object.entries(currentConfigData)) {
        if (hasColorTrio && (key === 'ColorG' || key === 'ColorB')) continue; // folded into the picker

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.paddingBottom = '0.5rem';
        row.style.borderBottom = '1px solid var(--border-color)';

        const label = document.createElement('span');
        label.textContent = key;

        let input;
        if (hasColorTrio && key === 'ColorR') {
            // One picker drives the whole trio.
            label.textContent = 'LIGHT COLOR';
            input = document.createElement('input');
            input.type = 'color';
            input.value = '#' + toHex(currentConfigData.ColorR) + toHex(currentConfigData.ColorG) + toHex(currentConfigData.ColorB);
            input.dataset.colorTrio = '1';
            input.style.width = '80px';
            input.style.height = '34px';
            input.style.border = '1px solid var(--border-color)';
            input.style.background = 'var(--bg-base)';
            input.style.cursor = 'pointer';
        } else if (typeof value === 'boolean' || value === 'true' || value === 'false') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = value === true || value === 'true';
            input.className = 'tactical-checkbox';
            input.dataset.key = key;
        } else if (!isNaN(value)) {
            if (/bright|intensity|multiplier|volume|scale|alpha|opacity/i.test(key)) {
                // Slider + synced manual number box.
                input = document.createElement('div');
                input.style.display = 'flex';
                input.style.alignItems = 'center';
                input.style.gap = '0.6rem';

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '0';
                slider.max = '2';
                slider.step = '0.01';
                slider.value = value;
                slider.style.width = '160px';
                slider.style.accentColor = 'var(--accent)';
                slider.style.cursor = 'pointer';

                const num = document.createElement('input');
                num.type = 'number';
                num.step = '0.01';
                num.value = value;
                num.dataset.key = key;
                num.style.width = '70px';
                styleField(num);

                slider.addEventListener('input', () => { num.value = slider.value; });
                num.addEventListener('input', () => { slider.value = num.value; });

                input.appendChild(slider);
                input.appendChild(num);
            } else {
                input = document.createElement('input');
                input.type = 'number';
                input.value = value;
                input.dataset.key = key;
                styleField(input);
            }
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = value;
            input.dataset.key = key;
            styleField(input);
        }

        row.appendChild(label);
        row.appendChild(input);
        configModalContent.appendChild(row);
    }
}

btnConfigCancel.onclick = () => {
    configModal.style.display = 'none';
    currentEditingMod = null;
};

const btnConfigReset = document.getElementById('btn-config-reset');
btnConfigReset.onclick = async () => {
    if (!currentEditingMod) return;
    const res = await window.electronAPI.readModDefaults(currentGamePath, currentEditingMod.name, currentEditingMod.type);
    if (!res.success) { alert("NO DEFAULTS: " + res.error); return; }
    // Revert the fields to stock AND persist immediately.
    renderConfigFields(res.data);
    const saved = await window.electronAPI.saveModConfig(currentGamePath, currentEditingMod.name, currentEditingMod.type, res.data);
    if (!saved.success) alert("I/O ERROR: " + saved.error);
};

btnConfigSave.onclick = async () => {
    if (!currentEditingMod || !currentConfigData) return;

    const inputs = configModalContent.querySelectorAll('input');
    const newConfig = { ...currentConfigData };

    inputs.forEach(input => {
        if (input.dataset.colorTrio) {
            // "#rrggbb" -> ColorR/ColorG/ColorB (0-255)
            const hex = input.value.replace('#', '');
            newConfig.ColorR = parseInt(hex.slice(0, 2), 16);
            newConfig.ColorG = parseInt(hex.slice(2, 4), 16);
            newConfig.ColorB = parseInt(hex.slice(4, 6), 16);
            return;
        }
        const key = input.dataset.key;
        if (!key) return; // slider half of a slider+number pair carries no key
        if (input.type === 'checkbox') {
            newConfig[key] = input.checked;
        } else if (input.type === 'number') {
            newConfig[key] = parseFloat(input.value);
        } else {
            newConfig[key] = input.value;
        }
    });

    const result = await window.electronAPI.saveModConfig(currentGamePath, currentEditingMod.name, currentEditingMod.type, newConfig);
    
    if (result.success) {
        configModal.style.display = 'none';
    } else {
        alert("I/O ERROR: " + result.error);
    }
};

// Settings Logic
const chkStartup = document.getElementById('chk-startup');
const chkGameMonitor = document.getElementById('chk-game-monitor');
const btnUninstallMods = document.getElementById('btn-uninstall-mods');
const btnUninstallApp = document.getElementById('btn-uninstall-app');

const THEMES = {
    'nightvision': { label: 'NIGHT VISION', accent: '#50C878', bgBase: '#050505', bgPanel: '#0d0d0d', bgCard: '#141414', border: '#222222', text: '#e0e0e0', muted: '#888888' },
    'amber':       { label: 'AMBER CRT',    accent: '#f0a83c', bgBase: '#0a0803', bgPanel: '#12100a', bgCard: '#1a1610', border: '#2a2416', text: '#ece4d4', muted: '#8a8070' },
    'ice':         { label: 'ICE BLUE',     accent: '#5fb4e6', bgBase: '#04070a', bgPanel: '#0b1016', bgCard: '#111820', border: '#1d2833', text: '#dce8f2', muted: '#7d8f9e' },
    'crimson':     { label: 'CRIMSON',      accent: '#e05a5a', bgBase: '#080404', bgPanel: '#110b0b', bgCard: '#1a1111', border: '#2b1c1c', text: '#f0dede', muted: '#94807f' },
};

const LAYOUTS = {
    'comfortable': { label: 'COMFORTABLE', scale: '1',    pad: '1.5rem', gap: '1rem'   },
    'compact':     { label: 'COMPACT',     scale: '0.92', pad: '1rem',   gap: '0.6rem' },
    'dense':       { label: 'DENSE',       scale: '0.85', pad: '0.7rem', gap: '0.4rem' },
};

function applyTheme(key) {
    const t = THEMES[key] || THEMES.nightvision;
    const r = document.documentElement.style;
    r.setProperty('--accent', t.accent);
    r.setProperty('--accent-dim', hexToRgba(t.accent, 0.2));
    r.setProperty('--bg-base', t.bgBase);
    r.setProperty('--bg-panel', t.bgPanel);
    r.setProperty('--bg-card', t.bgCard);
    r.setProperty('--border-color', t.border);
    r.setProperty('--text-main', t.text);
    r.setProperty('--text-muted', t.muted);
    localStorage.setItem('gm_theme', key);
    renderAppearance();
}

function applyLayout(key) {
    const l = LAYOUTS[key] || LAYOUTS.comfortable;
    const r = document.documentElement.style;
    r.setProperty('--ui-scale', l.scale);
    r.setProperty('--ui-pad', l.pad);
    r.setProperty('--ui-gap', l.gap);
    document.body.dataset.layout = key;
    localStorage.setItem('gm_layout', key);
    renderAppearance();
}

function hexToRgba(hex, a) {
    const n = parseInt(hex.replace('#',''), 16);
    return `rgba(${(n>>16)&255}, ${(n>>8)&255}, ${n&255}, ${a})`;
}

function chipHtml(active, label, accent) {
    return `<button class="btn-secondary appearance-chip" style="${active ? `border-color:${accent}; color:${accent};` : ''}">${label}</button>`;
}

function renderAppearance() {
    const tg = document.getElementById('theme-grid');
    const lg = document.getElementById('layout-grid');
    if (!tg || !lg) return;
    const curT = localStorage.getItem('gm_theme') || 'nightvision';
    const curL = localStorage.getItem('gm_layout') || 'comfortable';
    tg.innerHTML = Object.entries(THEMES).map(([k, t]) =>
        `<button class="btn-secondary appearance-chip" data-theme="${k}" style="${k === curT ? `border-color:${t.accent}; color:${t.accent};` : ''}">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${t.accent};margin-right:0.5rem;"></span>${t.label}
        </button>`).join('');
    lg.innerHTML = Object.entries(LAYOUTS).map(([k, l]) =>
        `<button class="btn-secondary appearance-chip" data-layout="${k}" style="${k === curL ? 'border-color:var(--accent); color:var(--accent);' : ''}">${l.label}</button>`).join('');
    tg.querySelectorAll('[data-theme]').forEach(b => b.onclick = () => applyTheme(b.dataset.theme));
    lg.querySelectorAll('[data-layout]').forEach(b => b.onclick = () => applyLayout(b.dataset.layout));
}

// restore saved appearance on boot
applyTheme(localStorage.getItem('gm_theme') || 'nightvision');
applyLayout(localStorage.getItem('gm_layout') || 'comfortable');

async function loadSettings() {
    renderAppearance();
    if(!window.electronAPI) return;
    const settings = await window.electronAPI.getSettings();
    chkStartup.checked = settings.openAtLogin;
    chkGameMonitor.checked = settings.gameMonitor;
}

chkStartup.addEventListener('change', async (e) => {
    await window.electronAPI.setSetting('openAtLogin', e.target.checked);
});

chkGameMonitor.addEventListener('change', async (e) => {
    await window.electronAPI.setSetting('gameMonitor', e.target.checked);
});

btnUninstallMods.addEventListener('click', async () => {
    if(confirm("DANGER: PERMANENT PURGE OF ALL CUSTOM DATA. PROCEED?")) {
        await window.electronAPI.uninstallAllMods(currentGamePath);
        alert("PURGE COMPLETE.");
        loadMods();
    }
});

btnUninstallApp.addEventListener('click', async () => {
    if(confirm("WARNING: UNINSTALL GERMODIMO OS PROTOCOL?")) {
        await window.electronAPI.uninstallApp();
    }
});

// Initial Check
checkGameStatus();
