const { app, BrowserWindow } = require('electron')

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.maximize();
  mainWindow.loadFile('otosopp.html')

  mainWindow.on('close', function(e) {
        e.preventDefault();
        mainWindow.destroy();
    });
}
app.whenReady().then(createWindow)
