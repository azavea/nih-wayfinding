// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-01-05 using
// generator-karma 0.8.3


module.exports = function(config) {
  'use strict';

  var customLaunchers = {PhantomJS: {}};

  // configure Sauce Labs browsers
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Sauce environment variables not set; testing with PhantomJS.');
  } else {
    // browsers for Sauce Labs
    // cannot run more than 3 or 4, due to this issue:
    // https://github.com/karma-runner/karma-sauce-launcher/issues/40
    customLaunchers = {
      chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7'
      },
      firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 7',
        version: '34'
      },
      ie11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      },
    };
  }

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/ngGeolocation/ngGeolocation.js',
      'bower_components/lodash/dist/lodash.compat.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/leaflet/dist/leaflet.js',
      'bower_components/leaflet/dist/leaflet-src.js',
      'bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js',
      'bower_components/Leaflet.encoded/Polyline.encoded.js',
      'bower_components/turf/turf.min.js',

      // include app.js file first
      'app/scripts/config.js',
      'app/scripts/app.js',

      // explicitly list files here in same order as in index.html
      // (globbing fails)
      'app/scripts/profiles/module.js',
      'app/scripts/profiles/profile-model.js',
      'app/scripts/profiles/profile-service.js',
      'app/scripts/profiles/profile-preference-options.js',
      'app/scripts/amenities/module.js',
      'app/scripts/amenities/amenities-search-service.js',
      'app/scripts/geocoder/module.js',
      'app/scripts/geocoder/search-service.js',
      'app/scripts/mapping/module.js',
      'app/scripts/mapping/map-service.js',
      'app/scripts/mapping/map-route-service.js',
      'app/scripts/mapping/map-control-service.js',
      'app/scripts/mapping/map-style-service.js',
      'app/scripts/navigation/module.js',
      'app/scripts/navigation/navigation-service.js',
      'app/scripts/notifications/module.js',
      'app/scripts/notifications/notifications-service.js',
      'app/scripts/routing/module.js',
      'app/scripts/routing/abbreviate-filter.js',
      'app/scripts/routing/distance-filter.js',
      'app/scripts/routing/directions-service.js',
      'app/scripts/routing/routing-response-stub.js',
      'app/scripts/routing/turnamenities-service.js',
      'app/scripts/routing/rerouting/rerouting-options-service.js',
      'app/scripts/routing/rerouting/rerouting-options-stub.js',
      'app/scripts/views/modals/module.js',
      'app/scripts/views/modals/confirm-controller.js',
      'app/scripts/views/modals/input-modal-controller.js',
      'app/scripts/views/modals/modal-service.js',
      'app/scripts/views/options-grid/module.js',
      'app/scripts/views/options-grid/options-grid-directive.js',
      'app/scripts/views/navbar/module.js',
      'app/scripts/views/navbar/navbar-controller.js',
      'app/scripts/views/navbar/navbar-service.js',
      'app/scripts/views/profile/module.js',
      'app/scripts/views/profile/profiles-controller.js',
      'app/scripts/views/profile/new-profile/module.js',
      'app/scripts/views/profile/new-profile/new-profile-controller.js',
      'app/scripts/views/locations/module.js',
      'app/scripts/views/locations/locations-controller.js',
      'app/scripts/views/routing/module.js',
      'app/scripts/views/routing/overview/overview-controller.js',
      'app/scripts/views/routing/directions/directions-controller.js',
      'app/scripts/views/routing/changeroute/changeroute-controller.js',
      'app/scripts/views/routing/goforwalk/goforwalk-controller.js',
      'app/scripts/views/navigate/module.js',
      'app/scripts/views/navigate/navigate-controller.js',
      'app/scripts/views/navigate/report/report-controller.js',
      'app/scripts/views/navigate/reroute/reroute-controller.js',

      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Which plugins to enable
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-sauce-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    sauceLabs: {
        testName: 'NIH Wayfinding Unit Tests'
    },

    // Increase timeouts in case connection in CI is slow
    captureTimeout: 4*60*1000, //default 60000
    browserDisconnectTimeout: 120000, // default 2000
    broswerDisconnectTolerance: 3, // default 0
    browserNoActivityTimeout: 4*60*1000,

    customLaunchers: customLaunchers,

    browsers: Object.keys(customLaunchers),

    reporters: ['dots', 'saucelabs'],

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
