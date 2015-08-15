# gulp-qunit-harness

[Gulp](https://github.com/gulpjs/gulp) plugin for [qunit-harness](https://github.com/AlexanderMoskovkin/qunit-harness)

##Install
`$ npm install gulp-qunit-harness`

##Usage
```js
var qunitHarness = require('gulp-qunit-harness');

var CLIENT_TESTS_SETTINGS = {
    basePath:        './test/fixtures',
    port:            2000,
    crossDomainPort: 2001,
    scripts:         [
        { src: '/sources.js', path: './lib/index.js' },
        { src: '/before-test.js', path: './test/before-test.js' }
    ],
    
    css: [ { src: 'style.css', path: './lib/style.css' } ],
    configApp: require('./test/config-qunit-server-app')
};

var BROWSERS = [{
    platform:    'Windows 10',
    browserName: 'chrome'
}];

var SAUCELABS_SETTINGS = {
    username:  process.env.SAUCELABS_USERNAME,
    accessKey: process.env.SAUCELABS_ACCESS_KEY,
    build:     process.env.TRAVIS_JOB_ID || '',
    tags:      [process.env.TRAVIS_BRANCH || 'master'],
    browsers:  BROWSERS,
    name:      'qunit tests',
    timeout:   300
};

gulp.task('tests', function () {
    gulp
        .src('./test/fixtures/**/*-test.js')
        .pipe(qunitHarness(CLIENT_TESTS_SETTINGS));
});

gulp.task('tests-saucelabs', function () {
    gulp
        .src('./test/fixtures/**/*-test.js')
        .pipe(qunitHarness(CLIENT_TESTS_SETTINGS, SAUCELABS_SETTINGS));
});

```
