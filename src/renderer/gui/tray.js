import bus from '../bus';
import { remote } from 'electron';

// console.log(__static);
// console.log(__dirname);
const tray = new remote.Tray(require('path').join(__static, 'archive.png'));
const menu = remote.Menu.buildFromTemplate([
  {
    label: 'ping',
    click() {
      // Send event to Vue
      bus.$emit('ping');
    }
  }
]);
tray.setToolTip('hello world');
tray.setContextMenu(menu);
// remote.BrowserWindow.getFocusedWindow().on('close', () => {
//   alert('closed');
//   tray.destroy();
// });
