import bus from '../bus';
import { remote } from 'electron';

function createApplicationMenu() {
  const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New item',
          accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
          click() {
            bus.$emit('item:new');
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' }
      ]
    }
  ];
  if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({
      label: remote.app.getName(),
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click() {
            remote.app.quit();
          }
        }
      ]
    });
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
          }
        },
        {
          role: 'reload'
        }
      ]
    });
  }
  return remote.Menu.buildFromTemplate(mainMenuTemplate);
}
remote.Menu.setApplicationMenu(createApplicationMenu());
