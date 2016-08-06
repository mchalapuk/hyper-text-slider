'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var stylelint = require('gulp-stylelint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jasmine = require('gulp-jasmine');
var cssmin = require('gulp-cssmin');
var markdox = require('gulp-markdox2');
var fixme = require('fixme');
var connect = require('gulp-connect');
var sequence = require('gulp-sequence');
var rename = require('gulp-rename');
var mergeStream = require('merge-stream');
var del = require('del');
var yargs = require('yargs');
var _ = require('underscore');

var child = require('child_process');

var config = require('./build.config');
var watching = false;

task('lint:config', [], config.config, function(files) {
  return gulp.src(files.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(watching? gutil.noop(): eslint.failAfterError())
  ;
});

task('lint:sass', [], config.css, function(files) {
  return gulp.src(files.src)
    .pipe(stylelint({
      reporters: [ { formatter: 'string', console: true } ],
    }))
  ;
});

task('sass', [ 'lint:sass' ], config.css, function(files) {
  var buildDir = config.dir.build + (files.dest || '');

  return gulp.src(files.main)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(buildDir))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(buildDir))
  ;
});

task('lint:javascript', [], config.js, function(files) {
  return gulp.src(files.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(watching? gutil.noop(): eslint.failAfterError())
  ;
});

task('javascript', [ 'lint:javascript' ], config.js, function(files) {
  if (!files.main) {
    return null;
  }
  return browserify(files.main).bundle().on('error', gutil.log)
    .pipe(source(files.main.substring(config.dir.src.length), config.dir.src))
    .pipe(rename(files.name +'.js'))
    .pipe(gulp.dest(config.dir.build))
    .pipe(buffer())
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
    .pipe(watching? gutil.noop(): eslint.failAfterError())
  ;
});

task('spec', [ 'lint:spec' ], config.js, function(files) {
  if (!files.spec) {
    return null;
  }

  var vinyls = [];

  return gulp.src(files.spec)
    .on('data', function(file) { vinyls.push(file); })
    .on('end', function() {
      gutil.log('Module: '+ gutil.colors.black.bgCyan(files.name));
//      gutil.log('Glob:');
//      files.spec.forEach(function(glob) { gutil.log('  '+ gutil.colors.cyan(glob)) });
      gutil.log('Spec Files:');
      vinyls.forEach(function(file) { gutil.log('  '+ gutil.colors.magenta(file.path)); });
      if (vinyls.length === 0) {
        gutil.log('  '+ gutil.colors.yellow('(none)'));
      }
    })
    .pipe(jasmine({
//      verbose: true,
      includeStackTrace: true,
      errorOnFail: !watching,
    }))
  ;
});

gulp.task('clean:dist', function(callback) {
  return del([ config.dir.build +'**/*', '!'+ config.dir.build ], { force: true }, callback);
});

gulp.task('dist', [ 'clean:dist' ], sequence('sass', 'spec', 'javascript'));

gulp.task('clean:doc', function(callback) {
  config.doc.formatter.reset();
  var cleanPaths = [ config.dir.docs +'**/*', '!'+ config.dir.docs ];
  cleanPaths = cleanPaths.concat(config.doc.written.map(function(arg) { return '!'+ arg; }));
  return del(cleanPaths, { force: true }, callback);
});

task('doc', [ 'clean:doc' ], config.doc.generated, function(files) {
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

gulp.task('fixme', _.partial(fixme, {
  file_patterns: [ '**/*.js', '**/*.scss' ],
  ignored_directories: [ 'node_modules/**', '.git/**', 'dist/**' ],
}));

gulp.task('default', [ 'lint:config', 'dist', 'doc' ]);

gulp.task('watch', function() {
  var allCssSources = flatten(config.css, 'src');
  var allJsSources = flatten(config.js, 'src');
  var allJsSpecs = flatten(config.js, 'spec');
  var allDocSources = flatten(config.doc.generated, 'src');
  var allDocTemplates = flatten(config.doc.generated, 'options', 'template');

  gulp.watch(allCssSources, [ 'sass' ]);
  gulp.watch(allJsSources, [ 'javascript', 'spec' ]);
  gulp.watch(allJsSpecs, [ 'spec' ]);
  gulp.watch(allDocSources.concat(allDocTemplates), [ 'doc' ]);

  watching = true;

  gulp.start('default')
    .on('task_stop', gutil.noop)
    .on('task_err', gutil.noop)
  ;

  connect.server({
    root: [ 'examples', 'dist' ],
    port: 8889,
    livereload: false,
  });
});

gulp.task('autoreload', function() {
  var allConfigFiles = flatten(config.config, 'src');
  var actualGulp = null;

  gulp.watch(allConfigFiles, function() {
    gulp.start('lint:config');
    actualGulp.kill('SIGTERM');
    spawnAnotherChild();
  });

  function spawnAnotherChild() {
    actualGulp = child.spawn('gulp', [ yargs.argv.task ], { stdio: 'inherit' });
    actualGulp.on('exit', maybeExitParent);
  }
  function maybeExitParent(code, signal) {
    if (signal !== 'SIGTERM') {
      process.exit(code);
    }
  }
  spawnAnotherChild();
});

function task(name, deps, configObject, taskDefinition, mergedCallback) {
  return gulp.task(name, deps, function() {
    var actualConfig = configObject instanceof Array? configObject: [ configObject ];
    var results = actualConfig.map(taskDefinition.bind(null))
        .filter(function(result) { return result !== null; });
    return (mergedCallback || pass)(mergeStream.apply(null, results));
  });
}

function flatten(unflattened, key0, key1) {
  return unflattened.reduce(function(result, branch) {
    var maybe = branch[key0] || [];
    return result.concat(maybe.indexOf? [ maybe ] : maybe[key1] || []);
  }, []);
}

function pass(arg) {
  return arg;
}

/*
  eslint-env node
*/

/*
  eslint
    camelcase: 0,
    no-process-exit: 0,
    no-underscore-dangle: 0,
*/

