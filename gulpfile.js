'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var jasmine = require('gulp-jasmine');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var merge_stream = require('merge-stream');
var del = require('del');

var config = require('./build.config');

gulp.task('sass', function () {
  var css = (config.css instanceof Array? config.css: [ config.css ]);

  var results = css.map(function (files) {
    var build_dir = config.dir.build + (files.dest || '');
    return gulp.src(files.src)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(build_dir))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(build_dir))
    ;
  });
  return merge_stream.apply(null, results);
});

gulp.task('jshint:javascript', function() {
  return gulp.src(config.js.src)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});

gulp.task('javascript', [ 'jshint:javascript' ], function() {
  return gulp.src(config.js.main)
    .pipe(browserify())
    .pipe(gulp.dest(config.dir.build))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.build))
});

gulp.task('jshint:spec', function() {
  return gulp.src(config.js.spec)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('spec', [ 'jshint:spec' ], function() {
  return gulp.src(config.js.spec)
    .pipe(jasmine({ includeStackTrace: true }))
  ;
});


gulp.task('clean', function(cb) {
  return del([ '${config.dir.build}**/*', '!${config.dir.build}' ], { force: true }, cb);
});

gulp.task('dist', ['clean', 'sass', 'spec', 'javascript']);

gulp.task('watch', [ 'dist' ], function() {
  gulp.watch(config.css.src, [ 'sass' ]);
  gulp.watch(config.js.src, [ 'javascript', 'spec' ]);
  gulp.watch(config.js.spec, [ 'spec' ]);
});

gulp.task('default', ['dist']);

