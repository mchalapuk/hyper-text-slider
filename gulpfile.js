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
var sequence = require('gulp-sequence');
var rename = require('gulp-rename');
var mergeStream = require('merge-stream');
var del = require('del');

var config = require('./build.config');

task('sass', [], config.css, function(files) {
  var buildDir = config.dir.build + (files.dest || '');

  return gulp.src(files.main)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(buildDir))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(buildDir))
  ;
});

task('lint:config', [], config.config, function(files) {
  return gulp.src(files.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
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
    return null;
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
    return null;
  }
  return gulp.src(files.spec)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

task('spec', [ 'lint:spec' ], config.js, function(files) {
  if (!files.spec) {
    return null;
  }
  return gulp.src(files.spec)
    .pipe(jasmine({
      // verbose: true,
      includeStackTrace: true,
    }))
  ;
});

gulp.task('clean:dist', function(callback) {
  return del([ config.dir.build +'**/*', '!'+ config.dir.build ], { force: true }, callback);
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

gulp.task('default', [ 'lint:config', 'dist', 'doc' ]);

gulp.task('watch', [ 'default' ], function() {
  function flatten(unflattened, key0, key1) {
    return unflattened.reduce(function(result, branch) {
      var maybe = branch[key0] || [];
      return result.concat(maybe.indexOf? [ maybe ] : maybe[key1] || []);
    }, []);
  }

  var allConfigFiles = flatten(config.config, 'src');
  var allCssSources = flatten(config.css, 'src');
  var allJsSources = flatten(config.js, 'src');
  var allJsSpecs = flatten(config.js, 'spec');
  var allDocSources = flatten(config.doc, 'src');
  var allDocTemplates = flatten(config.doc, 'options', 'template');

  gulp.watch(allConfigFiles, [ 'lint:config' ]);
  gulp.watch(allCssSources, [ 'sass' ]);
  gulp.watch(allJsSources, [ 'javascript', 'spec' ]);
  gulp.watch(allJsSpecs, [ 'spec' ]);
  gulp.watch(allDocSources.concat(allDocTemplates), [ 'doc' ]);

  connect.server({
    root: [ 'examples', 'dist' ],
    port: 8889,
    livereload: false,
  });
});

function task(name, deps, configObject, taskDefinition, mergedCallback) {
  return gulp.task(name, deps, function() {
    var actualConfig = configObject instanceof Array? configObject: [ configObject ];
    var results = actualConfig.map(taskDefinition.bind(null))
        .filter(function(result) { return result !== null; });
    return (mergedCallback || pass)(mergeStream.apply(null, results));
  });
}

function pass(arg) {
  return arg;
}

/*
  eslint-env node
*/

