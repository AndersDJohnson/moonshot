var moonshot = require('..');
var rimraf = require('rimraf');

rimraf.sync('out');

// var dims = [[1280,800],[1024,600],[800,600],[320,600]];
var dims = [[800, 600],'320x480', 1024];

var configs = [
 // ['andrz.me', dims],
 ['andrz.me/work', dims]
];

moonshot(configs);
