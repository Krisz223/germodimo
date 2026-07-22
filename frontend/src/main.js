import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="titlebar-drag-region">GERMODIMO — OPERATIONS FILE // 2019620</div>

  <nav class="sidebar">
    <div class="brand"><div class="brand-icon"></div><h1>GERMODIMO</h1></div>
    <div class="nav-item active" data-target="dashboard"><span class="n">01</span>Dashboard</div>
    <div class="nav-item" data-target="ue4ss"><span class="n">02</span>UE4SS</div>
    <div class="nav-item" data-target="mods"><span class="n">03</span>Modules</div>
    <div class="nav-item" data-target="settings"><span class="n">04</span>Settings</div>
    <div class="rail-foot">Property of<br>the Operator<br>— do not copy —</div>
  </nav>

  <main class="main-content">
    <div class="header">
      <h2 id="page-title">Dashboard</h2>
      <div class="status-badge" id="game-status">
        <div class="status-indicator" style="background: var(--stamp)"></div> Initiating scan…
      </div>
    </div>

    <div id="tab-content">

      <!-- Dashboard -->
      <div class="tab-pane active" id="pane-dashboard">
        <div id="update-banner">
          <div class="ub-txt"><b>Update available.</b> <span id="ub-version"></span></div>
          <button class="btn primary" id="btn-update-now" style="padding:.45rem .9rem">Update now</button>
          <button class="btn" id="btn-update-dismiss" style="padding:.45rem .8rem">Later</button>
        </div>

        <div style="display:flex; gap:1rem; margin-bottom:1.4rem; flex-wrap:wrap;">
          <button class="btn primary" id="btn-play-game">▸ Execute Geronimo</button>
          <button class="btn" id="btn-backup-saves" style="flex:1;">Backup Savedata</button>
        </div>

        <div id="path-config" class="mod-card">
          <h3>Installation Path</h3>
          <p id="game-path-text">C:\\UNKNOWN_PATH</p>
          <div id="piracy-warning" style="display:none; border-left:3px solid var(--stamp); background:var(--danger-dim); padding:.7rem .9rem; margin:.8rem 0; color:var(--stamp); font-family:var(--type); font-size:.8rem;">
            <strong>[ WARNING ]</strong> Unofficial/modified executable detected. Instability expected.
          </div>
          <div style="display:flex; gap:.8rem; margin-top:.9rem;">
            <button class="btn" id="btn-browse">Browse Directory</button>
            <button class="btn" id="btn-open-folder" style="display:none;">Open Explorer</button>
          </div>
        </div>
      </div>

      <!-- UE4SS -->
      <div class="tab-pane" id="pane-ue4ss" style="display:none;">
        <div class="mod-card">
          <h3>UE4SS Injection Engine</h3>
          <p style="color:var(--ink2); margin:.6rem 0; font-size:.9rem;">Required runtime for script modules and the developer console.</p>
          <p id="ue4ss-status-text" style="margin:.8rem 0;">Status: <span style="color:var(--olive)">Unknown</span></p>
          <button class="btn primary" id="btn-install-ue4ss">Install UE4SS Engine</button>
        </div>
      </div>

      <!-- Mods -->
      <div class="tab-pane" id="pane-mods" style="display:none;">
        <div class="mod-card" style="margin-bottom:1.3rem;">
          <h3>Deploy New Module</h3>
          <div id="dropzone" style="padding:2.2rem 1rem; text-align:center; cursor:pointer; margin-top:.9rem;">
            Drag &amp; drop a mod (.zip or .pak)<br>
            <span style="font-size:.7rem; display:block; margin-top:.4rem;">or click to browse files</span>
          </div>
        </div>

        <div style="display:flex; gap:.8rem; margin-bottom:1rem;">
          <input type="text" id="mod-search" placeholder="Search modules…" style="flex:1; padding:.5rem .7rem; outline:none;">
          <select id="mod-sort" style="padding:.5rem; outline:none; cursor:pointer;">
            <option value="name_asc">Sort: Name A–Z</option>
            <option value="enabled_first">Sort: Enabled</option>
            <option value="disabled_first">Sort: Disabled</option>
            <option value="time_desc">Sort: Newest</option>
            <option value="size_desc">Sort: Size</option>
          </select>
        </div>

        <div class="header" style="border-bottom:1px solid var(--line); padding-bottom:.5rem; margin-bottom:1rem; align-items:center;">
          <div style="display:flex; gap:.8rem; align-items:center;">
            <input type="checkbox" id="chk-select-all" class="tactical-checkbox">
            <h3 id="custom-mods-title" style="font-size:.82rem; letter-spacing:.14em; text-transform:uppercase; color:var(--olive); font-family:var(--type); border:none; padding:0;">Installed Modules</h3>
          </div>
          <div style="display:flex; gap:.6rem;">
            <button class="btn danger" id="btn-delete-selected" style="display:none; padding:.35rem .8rem; font-size:.72rem;">Purge Selected</button>
            <button class="btn" id="btn-refresh-mods" style="padding:.35rem .8rem; font-size:.72rem;">Rescan</button>
          </div>
        </div>

        <div id="mod-list-container"><p style="font-family:var(--type); color:var(--olive);">[ no modules detected ]</p></div>

        <div class="collapsible-header" id="core-modules-header"><span>[+] Core UE4SS Modules</span></div>
        <div class="collapsible-content" id="core-modules-container"></div>
      </div>

      <!-- Settings -->
      <div class="tab-pane" id="pane-settings" style="display:none;">
        <div class="mod-card" style="margin-bottom:1.4rem;">
          <h3>System Integration</h3>
          <div style="display:flex; flex-direction:column; gap:1rem; margin-top:1rem;">
            <label style="display:flex; align-items:center; gap:1rem; cursor:pointer;">
              <input type="checkbox" id="chk-startup" class="tactical-checkbox">
              <div><strong>Launch on OS boot</strong><div style="font-size:.82rem; color:var(--ink2);">Start silently in the system tray.</div></div>
            </label>
            <label style="display:flex; align-items:center; gap:1rem; cursor:pointer;">
              <input type="checkbox" id="chk-game-monitor" class="tactical-checkbox">
              <div><strong>Process monitoring</strong><div style="font-size:.82rem; color:var(--ink2);">Show the window automatically when Geronimo launches.</div></div>
            </label>
          </div>
        </div>

        <div class="mod-card" style="margin-bottom:1.4rem;">
          <h3>Updates</h3>
          <div style="display:flex; flex-direction:column; gap:1rem; margin-top:1rem;">
            <label style="display:flex; align-items:center; gap:1rem; cursor:pointer;">
              <input type="checkbox" id="chk-auto-update" class="tactical-checkbox">
              <div><strong>Check for updates automatically</strong><div style="font-size:.82rem; color:var(--ink2);">Checks GitHub on launch and notifies you when a new version ships.</div></div>
            </label>
            <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
              <button class="btn" id="btn-check-update" style="padding:.45rem .9rem;">Check for updates</button>
              <span id="update-status" style="font-family:var(--type); font-size:.78rem; color:var(--ink2);">Current version: <b id="cur-version">—</b></span>
            </div>
          </div>
        </div>

        <div class="mod-card" style="margin-bottom:1.4rem;">
          <h3>Appearance</h3>
          <div style="margin-top:1rem;">
            <div style="font-family:var(--type); font-size:.66rem; letter-spacing:.14em; text-transform:uppercase; color:var(--olive); margin-bottom:.6rem;">Paper Stock</div>
            <div id="theme-grid" style="display:flex; flex-wrap:wrap; gap:.6rem;"></div>
          </div>
        </div>

        <div class="mod-card" style="border-color:var(--stamp);">
          <h3 style="color:var(--stamp); border-color:var(--danger-dim);">Critical Operations</h3>
          <p style="color:var(--ink2); font-family:var(--type); font-size:.78rem; margin:.5rem 0 1.1rem;">Warning: these actions cannot be undone.</p>
          <div style="display:flex; gap:.8rem; flex-wrap:wrap;">
            <button class="btn danger" id="btn-uninstall-mods">Purge All Modules</button>
            <button class="btn danger" id="btn-uninstall-app">Uninstall GerMODimo</button>
          </div>
        </div>
      </div>

    </div>
  </main>

  <!-- Config modal -->
  <div id="config-modal" style="display:none; position:fixed; inset:0; z-index:1000; justify-content:center; align-items:center;">
    <div class="mod-card" style="max-height:80vh; display:flex; flex-direction:column;">
      <h3 id="config-modal-title" style="margin-bottom:1rem;">Module Configuration</h3>
      <div id="config-modal-content" style="overflow-y:auto; flex:1; padding-right:.8rem; margin-bottom:1rem; display:flex; flex-direction:column; gap:.9rem;"></div>
      <div style="display:flex; gap:1rem; justify-content:space-between;">
        <button class="btn danger" id="btn-config-reset">Reset to default</button>
        <div style="display:flex; gap:.8rem;">
          <button class="btn" id="btn-config-cancel">Cancel</button>
          <button class="btn primary" id="btn-config-save">Save changes</button>
        </div>
      </div>
    </div>
  </div>
`

const CORE_MODS = ['BPModLoaderMod','CheatManagerEnablerMod','ConsoleBindings','Keybinds','LineTraceMod','ActorDumperMod','BPML_GenericFunctions','ConsoleCommandsMod','ConsoleEnablerMod','JSBLuaProfilerMod','SplitScreenMod'];

let currentGamePath = null;
let currentEditingMod = null;
let currentConfigData = null;
let loadedMods = [];

// ---------- Tabs ----------
const navItems = document.querySelectorAll('.nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');
const pageTitle = document.getElementById('page-title');
const TITLES = { dashboard:'Dashboard', ue4ss:'UE4SS Engine', mods:'Module Management', settings:'Settings' };

navItems.forEach(item => item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    tabPanes.forEach(p => p.style.display = 'none');
    item.classList.add('active');
    const t = item.getAttribute('data-target');
    document.getElementById('pane-' + t).style.display = 'block';
    pageTitle.textContent = TITLES[t] || 'Dashboard';
    if (t === 'mods') loadMods();
    if (t === 'settings') loadSettings();
}));

// ---------- Collapsible core mods ----------
const coreModsHeader = document.getElementById('core-modules-header');
const coreModsContainer = document.getElementById('core-modules-container');
coreModsHeader.addEventListener('click', () => {
    const open = coreModsContainer.classList.toggle('open');
    coreModsHeader.innerHTML = `<span>[${open ? '-' : '+'}] Core UE4SS Modules</span>`;
});

// ---------- Game / UE4SS ----------
const gameStatusBadge = document.getElementById('game-status');
const gamePathText = document.getElementById('game-path-text');
const btnBrowse = document.getElementById('btn-browse');
const btnOpenFolder = document.getElementById('btn-open-folder');
const btnPlayGame = document.getElementById('btn-play-game');
const btnBackupSaves = document.getElementById('btn-backup-saves');
const piracyWarning = document.getElementById('piracy-warning');
const ue4ssStatusText = document.getElementById('ue4ss-status-text');
const btnInstallUE4SS = document.getElementById('btn-install-ue4ss');

function badge(color, text){ gameStatusBadge.innerHTML = `<div class="status-indicator" style="background:${color}"></div> ${text}`; }

async function checkGameStatus(customPath = null){
    if (!window.electronAPI) return;
    badge('var(--olive)', 'Scanning…');
    const r = await window.electronAPI.checkGame(customPath);
    if (r.found){
        currentGamePath = r.path;
        badge('var(--ok)', 'Target acquired');
        gamePathText.textContent = r.path;
        btnOpenFolder.style.display = 'block';
        piracyWarning.style.display = r.isCracked ? 'block' : 'none';
        if (r.ue4ssInstalled){
            ue4ssStatusText.innerHTML = 'Status: <span style="color:var(--ok)">Active</span>';
            btnInstallUE4SS.textContent = 'Update / Reinstall UE4SS';
        } else {
            ue4ssStatusText.innerHTML = 'Status: <span style="color:var(--stamp)">Offline</span>';
            btnInstallUE4SS.textContent = 'Install UE4SS Engine';
        }
    } else {
        currentGamePath = null;
        badge('var(--stamp)', 'Target not found');
        gamePathText.textContent = 'Manual directory selection required.';
        btnOpenFolder.style.display = 'none';
        piracyWarning.style.display = 'none';
    }
}

btnBrowse.addEventListener('click', async () => {
    const p = await window.electronAPI?.openDirectory();
    if (p) checkGameStatus(p);
});
btnOpenFolder.addEventListener('click', () => { if (currentGamePath) window.electronAPI.openFolder(currentGamePath); });

let isGameRunning = false;
window.electronAPI?.onGameStatusChange?.((running) => {
    isGameRunning = running;
    if (running){ btnPlayGame.textContent = '■ Kill Geronimo'; btnPlayGame.classList.add('danger'); btnPlayGame.classList.remove('primary'); }
    else { btnPlayGame.textContent = '▸ Execute Geronimo'; btnPlayGame.classList.remove('danger'); btnPlayGame.classList.add('primary'); }
});

btnPlayGame.addEventListener('click', async () => {
    if (!currentGamePath) return;
    if (isGameRunning) await window.electronAPI.killGame();
    else window.electronAPI.launchGame(currentGamePath);
});

btnBackupSaves.addEventListener('click', async () => {
    btnBackupSaves.textContent = 'Backing up…';
    const res = await window.electronAPI.backupSaves();
    alert(res.success ? ('Savedata archived at:\n' + res.path) : ('Backup failed: ' + res.error));
    btnBackupSaves.textContent = 'Backup Savedata';
});

window.electronAPI?.onInstallProgress?.((msg) => { btnInstallUE4SS.textContent = msg; });

btnInstallUE4SS.addEventListener('click', async () => {
    if (!currentGamePath) return alert('Select the game directory first.');
    btnInstallUE4SS.textContent = 'Connecting…'; btnInstallUE4SS.disabled = true;
    const res = await window.electronAPI.installUE4SS(currentGamePath);
    alert(res.success ? 'UE4SS installed.' : ('Install failed: ' + res.error));
    if (res.success) checkGameStatus(currentGamePath);
    btnInstallUE4SS.disabled = false;
});

// ---------- Mods ----------
const modListContainer = document.getElementById('mod-list-container');
const btnRefreshMods = document.getElementById('btn-refresh-mods');
const chkSelectAll = document.getElementById('chk-select-all');
const btnDeleteSelected = document.getElementById('btn-delete-selected');

function updateBulkDeleteButton(){
    const any = Array.from(document.querySelectorAll('.mod-checkbox')).some(c => c.checked);
    btnDeleteSelected.style.display = any ? 'block' : 'none';
}
chkSelectAll.addEventListener('change', e => {
    document.querySelectorAll('.mod-checkbox').forEach(c => c.checked = e.target.checked);
    updateBulkDeleteButton();
});
btnDeleteSelected.addEventListener('click', async () => {
    if (!confirm('Permanently purge the selected modules?')) return;
    const mods = Array.from(document.querySelectorAll('.mod-checkbox:checked')).map(c => JSON.parse(c.dataset.mod));
    btnDeleteSelected.textContent = 'Purging…';
    for (const m of mods) await window.electronAPI.deleteMod(currentGamePath, m.name, m.type);
    chkSelectAll.checked = false;
    btnDeleteSelected.textContent = 'Purge Selected';
    btnDeleteSelected.style.display = 'none';
    loadMods();
});

let savedScroll = 0;
async function loadMods(){
    const mc = document.querySelector('.main-content');
    savedScroll = mc ? mc.scrollTop : 0;
    if (!currentGamePath || !window.electronAPI) return;
    loadedMods = await window.electronAPI.listMods(currentGamePath);
    renderMods();
}

function makeCard(mod, isCore){
    const card = document.createElement('div');
    card.className = 'file-card' + (mod.enabled ? '' : ' off');

    if (!isCore){
        const clip = document.createElement('span'); clip.className = 'clip'; card.appendChild(clip);
        const tab = document.createElement('span'); tab.className = 'ctab' + (mod.type === 'pak' ? ' pak' : '');
        tab.textContent = mod.type.toUpperCase(); card.appendChild(tab);
        const photo = document.createElement('div'); photo.className = 'photo'; card.appendChild(photo);
    }

    const name = document.createElement('div'); name.className = 'fc-name';
    if (!isCore){
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.className = 'tactical-checkbox mod-checkbox';
        cb.dataset.mod = JSON.stringify(mod);
        cb.addEventListener('change', updateBulkDeleteButton);
        name.appendChild(cb);
    }
    const nameTxt = document.createElement('span'); nameTxt.textContent = mod.name; name.appendChild(nameTxt);
    card.appendChild(name);

    // rubber-stamp status = the toggle
    const stamp = document.createElement('div'); stamp.className = 'fc-stamp';
    stamp.textContent = mod.enabled ? 'Enabled' : 'Filed';
    stamp.title = 'Click to ' + (mod.enabled ? 'disable' : 'enable');
    stamp.onclick = async () => {
        const res = await window.electronAPI.toggleMod(currentGamePath, mod.name, mod.type, !mod.enabled);
        if (res && !res.success) alert('Toggle error: ' + res.error);
        loadMods();
    };
    card.appendChild(stamp);

    const foot = document.createElement('div'); foot.className = 'fc-foot';
    const kind = document.createElement('span'); kind.className = 'fc-kind'; kind.textContent = mod.type.toUpperCase();
    foot.appendChild(kind);
    const act = document.createElement('div'); act.className = 'fc-act';

    if (mod.type === 'pak'){
        for (const [dir, label] of [['up','▲'],['down','▼']]){
            const b = document.createElement('button'); b.className = 'fc-prio'; b.textContent = label;
            b.title = 'Priority ' + dir;
            b.onclick = async () => { await window.electronAPI.moveModPriority(currentGamePath, mod.name, dir); loadMods(); };
            act.appendChild(b);
        }
    }
    if (mod.hasConfig){
        const cfg = document.createElement('button'); cfg.className = 'fc-link'; cfg.textContent = 'Config ▸';
        cfg.onclick = () => openConfigModal(mod); act.appendChild(cfg);
    }
    if (!isCore){
        const del = document.createElement('button'); del.className = 'fc-link del'; del.textContent = 'Delete';
        del.onclick = async () => { if (confirm(`Delete ${mod.name}?`)){ await window.electronAPI.deleteMod(currentGamePath, mod.name, mod.type); loadMods(); } };
        act.appendChild(del);
    }
    foot.appendChild(act);
    card.appendChild(foot);
    return card;
}

function renderMods(){
    if (!loadedMods || loadedMods.length === 0){
        modListContainer.innerHTML = '<p style="font-family:var(--type); color:var(--olive);">[ no modules detected ]</p>';
        chkSelectAll.checked = false; btnDeleteSelected.style.display = 'none';
        document.getElementById('custom-mods-title').textContent = 'Installed Modules (0)';
        return;
    }
    const q = document.getElementById('mod-search').value.toLowerCase();
    const sort = document.getElementById('mod-sort').value;
    let list = loadedMods.filter(m => m.name.toLowerCase().includes(q));
    list.sort((a,b) => {
        if (sort === 'name_asc') return a.name.localeCompare(b.name);
        if (sort === 'enabled_first') return a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1;
        if (sort === 'disabled_first') return a.enabled === b.enabled ? 0 : a.enabled ? 1 : -1;
        if (sort === 'time_desc') return b.installTime - a.installTime;
        if (sort === 'size_desc') return b.size - a.size;
        return 0;
    });

    modListContainer.innerHTML = '';
    coreModsContainer.innerHTML = '';
    let custom = 0, core = 0;
    const lc = CORE_MODS.map(c => c.toLowerCase());
    list.forEach(mod => {
        const isCore = lc.includes(mod.name.toLowerCase());
        isCore ? core++ : custom++;
        (isCore ? coreModsContainer : modListContainer).appendChild(makeCard(mod, isCore));
    });

    document.getElementById('custom-mods-title').textContent = `Installed Modules (${custom})`;
    const open = coreModsContainer.classList.contains('open');
    coreModsHeader.innerHTML = `<span>[${open ? '-' : '+'}] Core UE4SS Modules (${core})</span>`;
    if (custom === 0) modListContainer.innerHTML = '<p style="font-family:var(--type); color:var(--olive);">[ no modules match search ]</p>';
    coreModsHeader.style.display = core === 0 ? 'none' : 'flex';
    if (core === 0) coreModsContainer.style.display = 'none';

    const mc = document.querySelector('.main-content');
    if (mc) mc.scrollTop = savedScroll;
}

document.getElementById('mod-search').addEventListener('input', renderMods);
document.getElementById('mod-sort').addEventListener('change', renderMods);
btnRefreshMods.addEventListener('click', loadMods);

// ---------- Drag & drop ----------
const dropzone = document.getElementById('dropzone');
const DROP_HTML = 'Drag &amp; drop a mod (.zip or .pak)<br><span style="font-size:.7rem; display:block; margin-top:.4rem;">or click to browse files</span>';
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.style.borderColor = 'var(--ink)'; });
dropzone.addEventListener('dragleave', e => { e.preventDefault(); dropzone.style.borderColor = 'var(--line)'; });
async function installFrom(filePath){
    dropzone.innerHTML = '[ installing… ]';
    const res = await window.electronAPI.installMod(currentGamePath, filePath);
    if (res.success) loadMods(); else alert('Install failed: ' + res.error);
    dropzone.innerHTML = DROP_HTML;
}
dropzone.addEventListener('drop', async e => {
    e.preventDefault(); dropzone.style.borderColor = 'var(--line)';
    if (!currentGamePath) return alert('Select the game directory first.');
    const f = e.dataTransfer.files[0]; if (!f) return;
    let p = f.path || (window.electronAPI.getPathForFile ? window.electronAPI.getPathForFile(f) : '');
    if (!p) return alert('Could not read that file.');
    installFrom(p);
});
dropzone.addEventListener('click', async () => {
    if (!currentGamePath) return alert('Select the game directory first.');
    const p = await window.electronAPI.openFileSelect();
    if (p) installFrom(p);
});

// ---------- Config modal ----------
const configModal = document.getElementById('config-modal');
const configModalContent = document.getElementById('config-modal-content');
document.getElementById('btn-config-cancel').onclick = () => { configModal.style.display = 'none'; currentEditingMod = null; };

async function openConfigModal(mod){
    currentEditingMod = mod;
    configModal.style.display = 'flex';
    document.getElementById('config-modal-title').textContent = 'Config: ' + mod.name;
    configModalContent.innerHTML = '<p>Reading…</p>';
    const c = await window.electronAPI.readModConfig(currentGamePath, mod.name, mod.type);
    if (!c.success){ configModalContent.innerHTML = `<p style="color:var(--stamp)">Error: ${c.error}</p>`; return; }
    renderConfigFields(c.data);
}

function renderConfigFields(data){
    currentConfigData = data;
    configModalContent.innerHTML = '';
    const keys = Object.keys(data);
    const trio = ['ColorR','ColorG','ColorB'].every(k => keys.includes(k));
    const toHex = v => Math.max(0, Math.min(255, Math.round(Number(v) || 0))).toString(16).padStart(2,'0');

    for (const [key, value] of Object.entries(data)){
        if (trio && (key === 'ColorG' || key === 'ColorB')) continue;
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; gap:1rem; padding-bottom:.5rem; border-bottom:1px solid var(--line);';
        const label = document.createElement('span'); label.textContent = key;
        let input;

        if (trio && key === 'ColorR'){
            label.textContent = 'Light colour';
            input = document.createElement('input'); input.type = 'color';
            input.value = '#' + toHex(data.ColorR) + toHex(data.ColorG) + toHex(data.ColorB);
            input.dataset.colorTrio = '1';
            input.style.cssText = 'width:80px; height:32px; border:1.5px solid var(--ink); cursor:pointer; background:var(--paper);';
        } else if (typeof value === 'boolean' || value === 'true' || value === 'false'){
            input = document.createElement('input'); input.type = 'checkbox'; input.className = 'tactical-checkbox';
            input.checked = value === true || value === 'true'; input.dataset.key = key;
        } else if (!isNaN(value)){
            if (/bright|intensity|multiplier|volume|scale|alpha|opacity/i.test(key)){
                input = document.createElement('div'); input.style.cssText = 'display:flex; align-items:center; gap:.6rem;';
                const s = document.createElement('input'); s.type = 'range'; s.min = '0'; s.max = '2'; s.step = '0.01'; s.value = value;
                s.style.cssText = 'width:150px; accent-color:var(--stamp); cursor:pointer;';
                const n = document.createElement('input'); n.type = 'number'; n.step = '0.01'; n.value = value; n.dataset.key = key; n.style.width = '68px';
                s.addEventListener('input', () => n.value = s.value); n.addEventListener('input', () => s.value = n.value);
                input.append(s, n);
            } else {
                input = document.createElement('input'); input.type = 'number'; input.value = value; input.dataset.key = key;
            }
        } else {
            input = document.createElement('input'); input.type = 'text'; input.value = value; input.dataset.key = key;
        }
        row.append(label, input);
        configModalContent.appendChild(row);
    }
}

document.getElementById('btn-config-reset').onclick = async () => {
    if (!currentEditingMod) return;
    const res = await window.electronAPI.readModDefaults(currentGamePath, currentEditingMod.name, currentEditingMod.type);
    if (!res.success) return alert('No defaults: ' + res.error);
    renderConfigFields(res.data);
    const saved = await window.electronAPI.saveModConfig(currentGamePath, currentEditingMod.name, currentEditingMod.type, res.data);
    if (!saved.success) alert('Error: ' + saved.error);
};

document.getElementById('btn-config-save').onclick = async () => {
    if (!currentEditingMod || !currentConfigData) return;
    const newCfg = { ...currentConfigData };
    configModalContent.querySelectorAll('input').forEach(input => {
        if (input.dataset.colorTrio){
            const h = input.value.replace('#','');
            newCfg.ColorR = parseInt(h.slice(0,2),16); newCfg.ColorG = parseInt(h.slice(2,4),16); newCfg.ColorB = parseInt(h.slice(4,6),16);
            return;
        }
        const k = input.dataset.key; if (!k) return;
        newCfg[k] = input.type === 'checkbox' ? input.checked : input.type === 'number' ? parseFloat(input.value) : input.value;
    });
    const res = await window.electronAPI.saveModConfig(currentGamePath, currentEditingMod.name, currentEditingMod.type, newCfg);
    if (res.success) configModal.style.display = 'none'; else alert('Error: ' + res.error);
};

// ---------- Settings ----------
const chkStartup = document.getElementById('chk-startup');
const chkGameMonitor = document.getElementById('chk-game-monitor');
const chkAutoUpdate = document.getElementById('chk-auto-update');
const btnUninstallMods = document.getElementById('btn-uninstall-mods');
const btnUninstallApp = document.getElementById('btn-uninstall-app');

const PAPERS = { manila:'Manila', blueprint:'Blueprint', carbon:'Carbon' };
function applyPaper(key){
    if (!PAPERS[key]) key = 'manila';
    if (key === 'manila') document.documentElement.removeAttribute('data-paper');
    else document.documentElement.setAttribute('data-paper', key);
    localStorage.setItem('gm_paper', key);
    renderAppearance();
}
function renderAppearance(){
    const tg = document.getElementById('theme-grid'); if (!tg) return;
    const cur = localStorage.getItem('gm_paper') || 'manila';
    const swatch = { manila:'#e5dbc1', blueprint:'#224463', carbon:'#211e19' };
    tg.innerHTML = Object.entries(PAPERS).map(([k,label]) =>
        `<button class="appearance-chip${k === cur ? ' active' : ''}" data-paper="${k}"><span class="chip-dot" style="background:${swatch[k]}"></span>${label}</button>`).join('');
    tg.querySelectorAll('[data-paper]').forEach(b => b.onclick = () => applyPaper(b.dataset.paper));
}
applyPaper(localStorage.getItem('gm_paper') || 'manila');

async function loadSettings(){
    renderAppearance();
    if (!window.electronAPI) return;
    const s = await window.electronAPI.getSettings();
    chkStartup.checked = !!s.openAtLogin;
    chkGameMonitor.checked = !!s.gameMonitor;
    chkAutoUpdate.checked = s.autoUpdate !== false;
    document.getElementById('cur-version').textContent = 'v' + (await currentVersion());
}
chkStartup.addEventListener('change', e => window.electronAPI.setSetting('openAtLogin', e.target.checked));
chkGameMonitor.addEventListener('change', e => window.electronAPI.setSetting('gameMonitor', e.target.checked));
chkAutoUpdate.addEventListener('change', e => window.electronAPI.setSetting('autoUpdate', e.target.checked));

btnUninstallMods.addEventListener('click', async () => {
    if (confirm('Permanently delete all installed modules?')){ await window.electronAPI.uninstallAllMods(currentGamePath); alert('Done.'); loadMods(); }
});
btnUninstallApp.addEventListener('click', async () => {
    if (confirm('Uninstall GerMODimo?')) await window.electronAPI.uninstallApp();
});

// ---------- Updates ----------
const updateBanner = document.getElementById('update-banner');
const ubVersion = document.getElementById('ub-version');
const updateStatus = document.getElementById('update-status');
let pendingUpdate = null;

async function currentVersion(){
    const r = await window.electronAPI?.checkForUpdate?.();
    return r?.current || '—';
}
function showUpdate(info){
    pendingUpdate = info;
    ubVersion.textContent = `Version ${info.latest} is available (you have ${info.current}).`;
    updateBanner.style.display = 'flex';
}
async function runDownload(){
    if (!pendingUpdate) return;
    const btn = document.getElementById('btn-update-now');
    btn.textContent = 'Downloading…'; btn.disabled = true;
    window.electronAPI.onUpdateProgress?.(m => { btn.textContent = m; });
    const res = await window.electronAPI.downloadUpdate(pendingUpdate);
    if (res.ok){ btn.textContent = 'Launching installer…'; }
    else { alert('Update failed: ' + res.error); btn.textContent = 'Update now'; btn.disabled = false; }
}
document.getElementById('btn-update-now').onclick = runDownload;
document.getElementById('btn-update-dismiss').onclick = () => { updateBanner.style.display = 'none'; };

document.getElementById('btn-check-update').addEventListener('click', async () => {
    updateStatus.innerHTML = 'Checking…';
    const r = await window.electronAPI.checkForUpdate();
    if (!r.ok){ updateStatus.innerHTML = 'Check failed: ' + r.error; return; }
    if (r.available){ updateStatus.innerHTML = `<b>Update available: v${r.latest}</b>`; showUpdate(r); }
    else updateStatus.innerHTML = `Up to date — v${r.current}`;
});

window.electronAPI?.onUpdateAvailable?.(info => showUpdate(info));

// ---------- boot ----------
checkGameStatus();
