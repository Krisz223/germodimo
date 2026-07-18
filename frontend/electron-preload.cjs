const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  openFileSelect: () => ipcRenderer.invoke('dialog:openFileSelect'),
  checkGame: (customPath) => ipcRenderer.invoke('system:checkGame', customPath),
  installUE4SS: (gamePath) => ipcRenderer.invoke('mod:installUE4SS', gamePath),
  openFolder: (folderPath) => ipcRenderer.invoke('mod:openFolder', folderPath),
  listMods: (gamePath) => ipcRenderer.invoke('mod:listMods', gamePath),
  installMod: (gamePath, modPath) => ipcRenderer.invoke('mod:installMod', { gamePath, modPath }),
  toggleMod: (gamePath, modName, modType, enable) => ipcRenderer.invoke('mod:toggleMod', { gamePath, modName, modType, enable }),
  readModConfig: (gamePath, modName, modType) => ipcRenderer.invoke('mod:readConfig', { gamePath, modName, modType }),
  readModDefaults: (gamePath, modName, modType) => ipcRenderer.invoke('mod:readConfigDefaults', { gamePath, modName, modType }),
  saveModConfig: (gamePath, modName, modType, configData) => ipcRenderer.invoke('mod:saveConfig', { gamePath, modName, modType, configData }),
  onInstallProgress: (callback) => ipcRenderer.on('mod:installProgress', (_event, msg) => callback(msg)),
  
  launchGame: (gamePath) => ipcRenderer.invoke('system:launchGame', gamePath),
  killGame: () => ipcRenderer.invoke('system:killGame'),
  onGameStatusChange: (callback) => ipcRenderer.on('system:gameStatus', (_event, running) => callback(running)),
  backupSaves: () => ipcRenderer.invoke('system:backupSaves'),
  deleteMod: (gamePath, modName, modType) => ipcRenderer.invoke('mod:deleteMod', { gamePath, modName, modType }),
  moveModPriority: (gamePath, modName, direction) => ipcRenderer.invoke('mod:moveModPriority', { gamePath, modName, direction }),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSetting: (key, value) => ipcRenderer.invoke('settings:set', { key, value }),
  uninstallAllMods: (gamePath) => ipcRenderer.invoke('system:uninstallAllMods', gamePath),
  uninstallApp: () => ipcRenderer.invoke('system:uninstallApp'),
  getPathForFile: (file) => webUtils.getPathForFile(file)
});
