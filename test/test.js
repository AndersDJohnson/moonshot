var moonshot = require('..');

var dims = [[1280,800],[1024,600],[800, 600],[320,600]];
// var dims = [[800, 600]];

var configs = [
 ['andrz.me', dims],
 ['andrz.me/work', dims]
];

moonshot(configs);
