/*
 * Gulp tasks (execute by running 'gulp [taskname]' on the command line
 *
 * Task Name    Description
 * ---------------------------------------------------------------------
 * default      Create full build and distribution zip file
 * build        Create a full build with images and manifest files in /build/ that can be loaded as an unpacked extension
 * build-code   Build all code files (JavaScript and JSON) into the /build/ folder
 * bundle-js    Bundle the source javascript files to /build/js/background.js
 * dist         Create a zip distribution file in /dist/ that can be uploaded to the Chrome web store
 * watch        Create a full build and automatically rebuild code files when changes are detected
 */

var browserify = require('gulp-browserify');
var fs = require("fs");
var gulp = require('gulp');
var rename = require('gulp-rename');
var template = require('gulp-template');
var zip = require('gulp-zip');

function getPackageDetails() {
  return JSON.parse(fs.readFileSync("./package.json", "utf8"));
}

gulp.task('default', ['build'], function() {

});

gulp.task('build', ['build-code'], function() {
  // copy images to build
  gulp.src('./src/img/icons/*.*').pipe(gulp.dest('./build/img/icons'));
  console.log('Images coppied from /src/ to /build/');
});

gulp.task('build-code', ['bundle-js'], function() {
  gulp.src('./src/manifest.json')
    .pipe(template(getPackageDetails()))
    .pipe(gulp.dest('./build'));
  console.log('Chrome manifest file generated at /build/manifest.json');
});

gulp.task('bundle-js', function() {
  gulp.src('src/js/background.js')
    .pipe(browserify({
      debug: true
    }))
    .pipe(gulp.dest('build/js'));
  console.log('Source JavaScript files bundled to /build/js/background.js');
});

gulp.task('watch', ['build'], function() {
  console.log('Watching for changes JavaScript or JSON files ...');
  gulp.watch('./src/**/*.js', ['build-code']);
  gulp.watch('./src/**/*.json', ['build-code']);
  gulp.watch('./package.json', ['build-code']);
});

gulp.task('dist', ['build'], function() {
  // compress chrome build into a distribution zip
  gulp.src('build/**')
    .pipe(zip('chrome-extension.zip'))
    .pipe(gulp.dest('dist'));

  console.log('./build/ folder successfully packaged as ./dist/chrome-extension.zip');

});
