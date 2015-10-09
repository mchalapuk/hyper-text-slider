'use strict';

var formatter = require('./src/docs/formatter');

var lintGlobals = {
  /* Node */
  'require': {},
  'global': {},
  'module': {},

  /* DOM  */
  'Node': {},
  'Element': {},
  'DOMTokenList': {},
  'TransitionEndEvent': {},
  'KeyDownEvent': {},
  'ClickEvent': {},
  'Document': {},
  'Window': {},

  /* Browser */
  'window': {},
  'document': {},

  /* Jasmine */
  'describe': {},
  'it': {},
  'expect': {},
  'beforeEach': {},
  'afterEach': {},
};

module.exports = {
  dir: {
    build: './dist/',
    docs: './doc/',
  },

  css: [

    /*
      Main styles for slider mechanism.
      `hermes.scss` imports all underscore-prefixed files.
    */
    {
      main: [
        './src/sass/hermes.scss',
      ],
      src: [
        './src/*.scss',
        './src/sass/*.scss',
      ],
    },

    /*
      For each transition there are two files:
       1. main file located in `internal/{transition-name}.scss`
         (each of those get compiled into dest folder),
       2. an underscore-prefixed file with @import to the main file
         (to be Sass-imported into other projects).
    */
    {
      main: [
        './src/sass/transitions/internal/*.scss',
      ],
      src: [
        './src/sass/transitions/**/*.scss',
      ],
      dest: 'transitions/'
    },
  ],

  js: [

    /*
      Slider mechanism script.
    */
    {
      main: [
        './src/hermes.js',
      ],
      src: [
        './src/*.js',
        './src/node/**/*.js',
        '!./src/node/**/*.spec.js',
        '!./src/node/**/*.spec-helper.js',
      ],
      spec: [
        './src/node/**/*.spec-helper.js',
        './src/node/**/*.spec.js',
      ],
    }
  ],

  /*
    Documentation:
   */
  doc: [

    /*
      CSS Class Names
    */
    {
      src: [
        './src/node/classnames/_layout.js',
        './src/node/classnames/_options.js',
        './src/node/classnames/_phases.js',
        './src/node/classnames/_markers.js',
        './src/node/classnames/_flags.js',
        './src/node/classnames/_regexps.js',
      ],
      options: {
        formatter: formatter,
        template: './src/docs/class-names.md.ejs',
        concat: 'class-names.md',
        skipSingleStar: true,
      }
    },
  ],

  lint: {
    js: {
      globals: lintGlobals,
    },
    spec: {
      globals: lintGlobals,
      rules: {
        'max-nested-callbacks': 0,
        'init-declarations': 0,
        'id-length': 0,
        'no-undefined': 0,
        "no-unused-vars": 0,
      },
    }
  },
};

module.exports.doc.formatter = formatter;

