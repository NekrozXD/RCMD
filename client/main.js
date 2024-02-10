import { app, BrowserWindow, Menu } from 'electron';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1960,
    height: 1080,
    webPreferences: {
      nodeIntegration: true
    },
    closable: true // There's no 'closable' option in BrowserWindow, remove if not needed
  });

  mainWindow.loadURL('http://localhost:5173');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

Menu.setApplicationMenu(null);
