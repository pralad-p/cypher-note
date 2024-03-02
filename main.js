require("electron-reload")(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`),
});

const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("src/index.html");
}

app.whenReady().then(createWindow);
