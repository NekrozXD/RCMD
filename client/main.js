import { app, BrowserWindow, Menu } from 'electron';
import { networkInterfaces } from 'os';

let mainWindow;

function getLocalIPv4() {
  const interfaces = networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const info of interfaceInfo) {
      if (!info.internal && info.family === 'IPv4') {
        return info.address;
      }
    }
  }
  return 'localhost'; 
}

function createWindow() {
  const localIPv4 = getLocalIPv4();

  mainWindow = new BrowserWindow({
    width: 1960,
    height: 1080,
    webPreferences: {
      nodeIntegration: true
    },
    closable: true
  });

  mainWindow.loadURL(`http://${localIPv4}:5173`);

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
