'use strict';

var GithubMarkdownFormatter = require('./src/docs/formatter');
var formatter = new GithubMarkdownFormatter();

module.exports = {
  dir: {
    src: 'src/',
    build: 'dist/',
    docs: 'doc/',
  },

  config: [

    /*
      Gulp configuration files.
     */
    {
      src: [
        'build.config.js',
        'gulpfile.js',
      ],
    },
  ],

  css: [

    /*
      Main styles for slider mechanism.
      `hermes.scss` imports all underscore-prefixed files.
    */
    {
      main: 'src/sass/hermes.scss',
      src: [
        'src/*.scss',
        'src/sass/*.scss',
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
      main: 'src/sass/transitions/internal/*.scss',
      src: [
        'src/sass/transitions/**/*.scss',
      ],
      dest: 'transitions/',
    },
  ],

  /*
    Entries with `main` property will be conpiled (browserified and minified) into build folder.
  */
  js: [

    /*
      Slider mechanism script.
    */
    {
      main: 'src/browser.js',
      src: [
        'src/*.js',
        'src/js/**/*.js',
        '!src/js/**/*.spec.js',
        '!src/js/**/*.spec-helper.js',
      ],
      spec: [
        'src/js/**/*.spec-helper.js',
        'src/js/**/*.spec.js',
      ],
    },

    /*
      Documentation formatter script.
    */
    {
      src: [
        'src/docs/**/*.js',
      ],
    },
  ],

  /*
    Documentation:
   */
  doc: {

    /*
      Files that will not be overwritten in the build process.
     */
    written: [
      'doc/responsiveness.md',
      'doc/TODO.md',
      'doc/CHANGELOG.md',
    ],

    generated: [

      /*
        CSS Class Names
      */
      {
        src: [
          'src/js/classnames/_layout.js',
          'src/js/classnames/_options.js',
          'src/js/classnames/_time.js',
          'src/js/classnames/_phases.js',
          'src/js/classnames/_markers.js',
          'src/js/classnames/_flags.js',
          'src/js/classnames/_regexps.js',
        ],
        options: {
          formatter: formatter.format.bind(formatter),
          template: 'src/docs/class-names.md.ejs',
          concat: 'class-names.md',
          skipSingleStar: true,
          titleProperty: 'value',
        },
      },

      /*
        Slider JavaScript API
       */
      {
        src: [
          'src/js/slider.js',
          'src/js/phaser.js',
          'src/js/boot.js',
        ],
        options: {
          formatter: formatter.format.bind(formatter),
          template: 'src/docs/javascript-api.md.ejs',
          concat: 'javascript-api.md',
          skipSingleStar: true,
          titleProperty: 'signature',
        },
      },
    ],

    /*
      Needed to reset the formater during a clean,
      which is needed when working with watch.
      This is ugly...
     */
    formatter: formatter,
  },
};

/*
  eslint-env node
*/

