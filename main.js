const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// SET ENV
process.env.NODE_ENV = 'production';

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Add window',
  });
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'views', 'addWindow.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
  addWindow.on('closed', () => {
    addWindow = null;
  });
};

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New item',
        click() {
          createAddWindow();
        },
      },
      {
        label: 'Clear items',
        click() {
          mainWindow.webContents.send('item:clear');
        },
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        },
      },
    ],
  },
];
ipcMain.on('item:add', (e, item) => {
  console.info('add window');
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({});
}
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle dev tools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: 'reload',
      },
    ],
  });
}
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    // show: false,
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'views', 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show();
  //   // dialog.showOpenDialog();
  // });
  mainWindow.on('closed', () => {
    app.quit();
  });
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});
