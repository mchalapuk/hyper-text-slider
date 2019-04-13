'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jasmine = require('gulp-jasmine');
var cssmin = require('gulp-cssmin');
var markdox = require('gulp-markdox');
var fixme = require('fixme');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var del = require('del');
var yargs = require('yargs');
var _ = require('underscore');

var child = require('child_process');

var config = require('./build.config');
var watching = false;

task('sass', config.css, function(files) {
  var buildDir = config.dir.build + (files.dest || '');

  return gulp.src(files.main)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(buildDir))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(buildDir))
  ;
});

task('javascript', config.js, function(files) {
  if (!files.main) {
    return null;
  }
  return browserify(files.main).bundle().on('error', logError)
    .pipe(source(files.main.substring(config.dir.src.length), config.dir.src))
    .pipe(rename(files.name +'.js'))
    .pipe(gulp.dest(config.dir.build))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.build))
  ;
});

task('spec', config.js, function(files) {
  if (!files.spec) {
    return null;
  }

  var vinyls = [];

  return gulp.src(files.spec)
    .on('data', function(file) { vinyls.push(file); })
    .on('end', function() {
//      gutil.log('Module: '+ gutil.colors.black.bgCyan(files.name));
//      gutil.log('Glob:');
//      files.spec.forEach(function(glob) { gutil.log('  '+ gutil.colors.cyan(glob)) });
//      gutil.log('Spec Files:');
//      vinyls.forEach(function(file) { gutil.log('  '+ gutil.colors.magenta(file.path)); });
      if (vinyls.length === 0) {
//        gutil.log('  '+ gutil.colors.yellow('(none)'));
      }
    })
  ;
}, function(merged) {
  return merged
    .pipe(jasmine({
//      verbose: true,
//      includeStackTrace: true,
      errorOnFail: !watching,
    }))
    .on('error', logError)
  ;
});

gulp.task('clean:dist', function(callback) {
  return del([ config.dir.build +'**/*', '!'+ config.dir.build ], { force: true }, callback);
});

gulp.task('dist', gulp.series('clean:dist', 'sass', 'spec', 'javascript'));
gulp.task('clean-dist', gulp.series('clean:dist', 'dist'));

gulp.task('clean:doc', function(callback) {
  config.doc.formatter.reset();
  var cleanPaths = [ config.dir.docs +'**/*', '!'+ config.dir.docs ];
  cleanPaths = cleanPaths.concat(config.doc.written.map(function(arg) { return '!'+ arg; }));
  return del(cleanPaths, { force: true }, callback);
});

task('doc', config.doc.generated, function(files) {
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
gulp.task('clean-doc', gulp.series('clean:doc', 'doc'));

gulp.task('fixme', _.partial(fixme, {
  file_patterns: [ '**/*.js', '**/*.scss' ],
  ignored_directories: [ 'node_modules/**', '.git/**', 'dist/**' ],
}));

gulp.task('default', gulp.series('clean-dist', 'clean-doc'));

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

function task(name, configObject, taskDefinition, mergedCallback) {
  return gulp.task(name, function() {
    var streams = (configObject instanceof Array? configObject: [ configObject ])
        .filter(function(object) { return !object.ignore; })
        .map(taskDefinition.bind(null))
        .filter(function(result) { return result !== null; })
        ;
    return (mergedCallback || pass)(merge.apply(null, streams));
  });
}

function flatten(unflattened, key0, key1) {
  return unflattened.reduce(function(result, branch) {
    var maybe = branch[key0] || [];
    return result.concat(maybe.indexOf? [ maybe ] : maybe[key1] || []);
  }, []);
}

function logError(err) {
  gutil.log(err.toString());
  this.emit('end');
}

function pass(arg) {
  return arg;
}

