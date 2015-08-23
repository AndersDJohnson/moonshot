var moonshot = function (configs, options) {

  require('es6-shim');
  var isArray = require('isarray');
  var isObject = require('isobject');
  var defaults = require('defaults');
  var path = require('path');
  var mkdirp = require('mkdirp');
  var sanitizeFilename = require('sanitize-filename');
  var filenamifyUrl = require('filenamify-url');
  var protocolify = require('protocolify');
  var parseImageDimensions = require('parse-image-dimensions');
  var async = require('async');
  var seleniumStandalone = require('selenium-standalone');
  var webdriverio = require('webdriverio');

  options = options || {};

  var defaultOptions = {
    parallelLimit: 2,
    outDir: 'out',
    fname: function (job) {
      return filenamifyUrl(job.fullUrl) + '-' + job.w + 'x' + job.h + '.png';
    },
    selenium: {
      desiredCapabilities: {}
    },
    seleniumServer: {
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
    }
  };

  options = defaults(options, defaultOptions);
  options.selenium = defaults(options.selenium, defaultOptions.selenium);
  options.seleniumServer = defaults(options.seleniumServer, defaultOptions.seleniumServer);


  var jobs = [];

  configs.forEach(function (config) {
    var url = config[0];
    var fullUrl = protocolify(url);

    var dims = config[1];
    dims.forEach(
      function (dim) {
        var job = {};
        job.fullUrl = fullUrl;
        var w;
        var y;
        if (isArray(dim)) {
          w = dim[0];
          h = dim[1];
        }
        if (typeof dim === 'number') {
          dim = '' + dim;
        }
        if (typeof dim === 'string') {
          dim = parseImageDimensions(dim);
        }
        if (isObject(dim)) {
          w = dim.width || dim.w;
          h = dim.height || dim.h;
        }
        if (!h) {
          h = w;
        }
        if (!w || !h) {
          throw new Error("Could not parse dimensions.");
        }
        job.w = w;
        job.h = h;
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

  var sopts = options.seleniumServer;

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

