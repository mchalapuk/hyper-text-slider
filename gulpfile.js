'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
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

gulp.task('javascript', function() {
  return gulp.src(config.js.src)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.build))
  ;
});

gulp.task('clean', function(cb) {
  return del([ '${config.dir.build}**/*', '!${config.dir.build}' ], { force: true }, cb);
});

gulp.task('watch', function() {
  gulp.watch(config.css.src, ['sass']);
  gulp.watch([ config.js.src, '.jshintrc', 'build.config.js' ], ['javascript']);
});

gulp.task('build', ['clean', 'sass', 'javascript']);
gulp.task('default', ['build', 'watch']);

