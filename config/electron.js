const { app: electronApp, BrowserWindow } = require('electron');
const http = require('http');

function createWindow(port) {
    let win = new BrowserWindow({
        width: 1536,
        height: 864,
        frame: true,
        titleBarStyle: 'customButtonsOnHover',
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(`http://localhost:${port}/`);
    win.focus();
}

module.exports = (port) => {
    electronApp.whenReady().then(() => {
        createWindow(port);
    });

    electronApp.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electronApp.quit();
        }
    });
};