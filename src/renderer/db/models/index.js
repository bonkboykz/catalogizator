const files = require.context('.', false, /\.js$/);
const modules = {};

files.keys().forEach((key) => {
  if (key === './index.js' || key === './db.js') return;
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
});

module.exports = modules;
