'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var browserify = require('gulp-browserify');
var jasmine = require('gulp-jasmine');
var cssmin = require('gulp-cssmin');
var markdox = require('gulp-markdox2');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var sequence = require('gulp-sequence');
var rename = require('gulp-rename');
var merge_stream = require('merge-stream');
var del = require('del');

var config = require('./build.config');

task('sass', [], config.css, function(files) {
  var build_dir = config.dir.build + (files.dest || '');

  return gulp.src(files.main)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(build_dir))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(build_dir))
  ;
});

task('lint:javascript', [], config.js, function(files) {
  return gulp.src(files.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

task('javascript', [ 'lint:javascript' ], config.js, function(files) {
  if (!files.main) {
    return;
  }
  return gulp.src(files.main)
    .pipe(browserify())
    .pipe(gulp.dest(config.dir.build))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.build))
  ;
});

task('lint:spec', [], config.js, function(files) {
  if (!files.spec) {
    return;
  }
  return gulp.src(files.spec)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

task('spec', [ 'lint:spec' ], config.js, function(files) {
  if (!files.spec) {
    return;
  }
  return gulp.src(files.spec)
    .pipe(jasmine({ /* verbose: true, */ includeStackTrace: true }))
  ;
});

gulp.task('clean:dist', function(cb) {
  return del([ config.dir.build +'**/*', '!'+ config.dir.build ], { force: true }, cb);
});

gulp.task('dist', [ 'clean:dist' ], sequence('sass', 'spec', 'javascript'));

gulp.task('clean:doc', function(callback) {
  config.doc.formatter.reset();
  return del([ config.dir.docs +'**/*', '!'+ config.dir.docs ], { force: true }, callback);
});

task('doc', [ 'clean:doc' ], config.doc, function(files) {
  return gulp.src(files.src)
    .pipe(markdox.parse(files.options))
    .pipe(markdox.format())
  ;
}, function(merged) {
  return merged
    .pipe(markdox.render())
    .pipe(gulp.dest(config.dir.docs))
  ;
});

gulp.task('default', [ 'dist', 'doc' ]);

gulp.task('watch', [ 'default' ], function() {
  var flatten = function(result, elem) {
    return result.concat(this.reduce(function(elem, key) { return elem[key] || []; }, elem));
  };

  gulp.watch(config.css.reduce(flatten.bind([ 'src' ]), []), [ 'sass' ]);
  gulp.watch(config.js.reduce(flatten.bind([ 'src' ]), []), [ 'javascript', 'spec' ]);
  gulp.watch(config.js.reduce(flatten.bind([ 'spec' ]), []), [ 'spec' ]);
  gulp.watch(config.doc.reduce(flatten.bind([ 'src' ]), []), [ 'doc' ]);
  gulp.watch(config.doc.reduce(flatten.bind([ 'options', 'template' ]), []), [ 'doc' ]);

  connect.server({
    root: [ 'examples', 'dist' ],
    port: 8889,
    livereload: true
  });
});

function task(name, deps, config, func, merged_callback) {
  gulp.task(name, deps, function () {
    config = (config instanceof Array? config: [ config ]);
    var results = config.map(func.bind(null)).filter(function(arg) { return arg != null; });
    return (merged_callback || pass)(merge_stream.apply(null, results));
  });
}

function pass(arg) {
  return arg;
}

