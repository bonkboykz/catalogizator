import bus from '../bus';
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';

import { items } from '../db/controllers/index';

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
        },
        {
          label: 'Bunch import items',
          click() {
            console.log('Import items');
            // console.log(
            //   remote.dialog.showOpenDialog({
            //     properties: ['openFile', 'openDirectory', 'multiSelections']
            //   })
            // );
            const itemDirArrays = remote.dialog.showOpenDialog({
              properties: ['openFile', 'openDirectory', 'multiSelections']
            });
            const checkByFileExt = (file) => {
              const ext = path.extname(file);
              console.log(ext);
              switch (ext) {
                case '.mp4':
                case '.mkv':
                case '.avi':
                  return true;
                case '.epub':
                case '.fb2':
                case '.mobi':
                case '.pdf':
                  return true;
              }
              return false;
            };
            itemDirArrays.forEach(itemDirArr => {
              fs.readdirSync(itemDirArr).forEach((filename) => {
                console.log(filename);
                const isDir = fs
                  .statSync(path.join(itemDirArr, filename))
                  .isDirectory();
                if (!isDir && !checkByFileExt(filename)) return;
                console.log('pass');
                const newItem = {
                  title: filename,
                  type: path.basename(itemDirArr),
                  location: itemDirArr
                };
                console.log(path.basename(itemDirArr));
                console.log(newItem);
                items
                  .createItem(newItem)
                  .then((result) => {
                    console.log('Item: ' + result.title + ' created.');
                    bus.$emit('item:list_updated');
                  })
                  .catch((e) => console.error(e));
              });
            })
          }
        },
        { type: 'separator' },
        {
          label: 'Delete all items',
          click() {
            items
              .deleteAllItems()
              .then((result) => {
                console.log(result);
                bus.$emit('item:list_updated');
              })
              .catch((e) => console.error(e));
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
