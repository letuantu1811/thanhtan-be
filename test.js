require('fs').readdirSync(path.join(__dirname, '../services')).forEach(function (file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    name = name.split('.')
    let first = name[0]
    let second = name[1]
    let importName = first + second[0].toUpperCase() + second.substr(1)

    exports[importName] = require('../services/' + file);
    c = exports[importName]
   

  }
});