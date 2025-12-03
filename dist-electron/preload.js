"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Add any IPC methods here later
  // Example: sendNotification: (message: string) => ipcRenderer.send('notification', message)
});
