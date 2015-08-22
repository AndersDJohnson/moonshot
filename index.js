var moonshot = function (configs, options) {

  require('es6-shim');
  var path = require('path');
  var mkdirp = require('mkdirp');
  var sanitizeFilename = require('sanitize-filename');
  var async = require('async');
  var seleniumStandalone = require('selenium-standalone');
  var webdriverio = require('webdriverio');

  options = options || {};
  options.selenium = options.selenium || {
    desiredCapabilities: {
      firefox_binary: '/Users/anders/bin/firefox'
    }
  };
  options.parallelLimit = options.parallelLimit || 2;
  options.outDir = options.outDir || 'out';
  options.fname = options.fname || function (job) {
    return job.fullUrl + '-' + job.w + 'x' + job.h + '.png';
  }

  var jobs = [];

  configs.forEach(function (config) {
    var url = config[0];
    var fullUrl = url;

    if (! fullUrl.includes(':')) {
      fullUrl = 'http://' + fullUrl;
    }

    var dims = config[1];
    dims.forEach(
      function (dim) {
        var job = {};
        job.fullUrl = fullUrl;
        job.w = dim[0];
        job.h = dim[1] || 600;
        job.fname = options.fname(job);
        job.fname = sanitizeFilename(job.fname);
        job.fname = path.join(options.outDir, job.fname);
        jobs.push(job);
      }
    );
  });

  var runJobs = function (done) {

    mkdirp.sync(options.outDir);

    async.eachLimit(
      jobs,
      options.parallelLimit,
      function (job, next) {
        console.log('starting job', job);
        var client = webdriverio.remote(options.selenium);
        client
          .init()
          .windowHandle()
          .then(function () {
            console.log('wh', arguments);
          })
          .windowHandleSize({width: job.w, height: job.h})
          .url(job.fullUrl)
          .saveScreenshot(job.fname, function(err, screenshot, response) {
            console.log(arguments)
          })
          .end()
          .then(function (results) {
            console.log('end');
            next(null, results);
          });
      },
      function (err) {
        if (err) console.error(err);
        console.log('Done.');
        done(err);
      }
    );
  };

  var sopts = {
    version: '2.47.0',
    drivers: {
      chrome: false,
      ie: false
    },
    spawnOptions: {
      stdio: 'inherit'
    },
    progressCb: function () {
      console.log('progress', arguments);
    },
    logger: function () {
      console.log('logger', arguments);
    }
  };

  var start = function () {
    seleniumStandalone.start(sopts, function(err, child) {
      console.log('started');
      if (err) throw err;
      runJobs(function (err) {
        child.kill();
      });
    });
  };

  var install = function () {
    console.log('installing', sopts);
    seleniumStandalone.install(sopts, function (err) {
      console.log('installed');
      if (err) throw err;
      start();
    });
  };

  install();

};

module.exports = moonshot;

