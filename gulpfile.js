'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var jasmine = require('gulp-jasmine');
var cssmin = require('gulp-cssmin');
var markdox = require('gulp-markdox');
var markdox_ = require('markdox');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var merge_stream = require('merge-stream');
var del = require('del');

var config = require('./build.config');

function task(name, deps, config, func) {
  gulp.task(name, deps, function () {
    config = (config instanceof Array? config: [ config ]);
    var results = config.map(func.bind(null));
    return merge_stream.apply(null, results);
  });
};

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

task('jshint:javascript', [], config.js, function(files) {
  return gulp.src(files.src)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});

task('javascript', [ 'jshint:javascript' ], config.js, function(files) {
  return gulp.src(files.main)
    .pipe(browserify())
    .pipe(gulp.dest(config.dir.build))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.build))
  ;
});

task('jshint:spec', [], config.js, function(files) {
  return gulp.src(files.spec)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});

task('spec', [ 'jshint:spec' ], config.js, function(files) {
  return gulp.src(files.spec)
    .pipe(jasmine({ /* verbose: true, */ includeStackTrace: true }))
  ;
});

gulp.task('clean:build', function(cb) {
  return del([ '${config.dir.build}**/*', '!${config.dir.build}' ], { force: true }, cb);
});
gulp.task('clean:doc', function(cb) {
  return del([ '${config.dir.docs}**/*', '!${config.dir.docs}' ], { force: true }, cb);
});

task('doc', [ 'clean:doc' ], config.doc, function(files) {
  return gulp.src(files.src)
    .pipe(markdox({
      formatter: function(docfile, tagName) {
        function tagValue(javadoc, tagName) {
          for (var j = 0; j < javadoc.tags.length; ++j) {
            var tag = javadoc.tags[j];
            if (tag.type === tagName) {
              return tag.string;
            }
          }
        }

        var columns = tagValue(docfile.javadoc[0], 'table').split(' ');
        var links = tagValue(docfile.javadoc[0], 'links').split(' ');
        var data = docfile.javadoc.map(function(elem) {
          var retVal = {};
          elem.tags.forEach(function(tag) { retVal[tag.type] = tag.string });
          retVal.description = elem.description.summary;
          links.forEach(function(column) {
            var value = retVal[column];
            retVal[column] = value !== undefined? '['+ value +'](#'+ value +')': undefined;
          });
          return retVal;
        }).slice(1);

        function createRow(values) {
          return columns.map(function(name) { return values[name]; }).join(' | ');
        }

        docfile.javadoc[0].description.full += columns.join(' | ') +'\n'+
          columns.map(function(name) { return name.replace(/./g, '-'); }).join(' | ') +'\n'+
          data.map(createRow).join('\n');
        return markdox_.defaultFormatter(docfile);
      }
    }))
    .pipe(concat(files.name +'.md'))
    .pipe(gulp.dest(config.dir.docs))
  ;
});

gulp.task('dist', [ 'clean:dist', 'sass', 'spec', 'javascript' ]);

gulp.task('watch', [ 'dist' ], function() {
  var flatten = function(result, elem) {
    return result.concat(elem[this]);
  };

  gulp.watch(config.css.reduce(flatten.bind('src'), []), [ 'sass' ]);
  gulp.watch(config.js.reduce(flatten.bind('src'), []), [ 'javascript', 'spec' ]);
  gulp.watch(config.js.reduce(flatten.bind('spec'), []), [ 'spec' ]);

  connect.server({
    root: [ 'examples', 'dist' ],
    port: 8889,
    livereload: true
  });
});

gulp.task('default', [ 'dist', 'doc' ]);

