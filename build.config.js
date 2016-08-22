'use strict';

var GithubMarkdownFormatter = require('./lib/docgen/formatter');
var formatter = new GithubMarkdownFormatter();

module.exports = {
  dir: {
    src: 'lib/',
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
        '.eslintrc',
        '.stylelintrc',
      ],
    },
  ],

  css: [

    /*
      Main styles for slider mechanism.
      `hermes.scss` imports all underscore-prefixed files.
    */
    {
      main: 'lib/styles/hermes.scss',
      src: [
        'lib/**/*.scss',
      ],
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
      name: 'core',
      main: 'lib/browser.js',
      src: [
        'lib/enums/**/*.js',
        'lib/core/**/*.js',
        '!lib/**/*.spec.js',
        '!lib/**/*.spec-helper.js',
      ],
      spec: [
        'lib/**/*.spec-helper.js',
        'lib/core/**/*.spec.js',
      ],
    },

    /*
      Enums.
    */
    {
      name: 'enums',
      src: [
        'lib/enums/**/*.js',
        '!lib/**/*.spec.js',
        '!lib/**/*.spec-helper.js',
      ],
      spec: [
        'lib/**/*.spec-helper.js',
        'lib/enums/**/*.spec.js',
      ],
    },

    /*
      Utility classes.
    */
    {
      name: 'utils',
      src: [
        'lib/utils/*.js',
        '!lib/**/*.spec.js',
        '!lib/**/*.spec-helper.js',
      ],
      spec: [
        'lib/**/*.spec-helper.js',
        'lib/utils/**/*.spec.js',
      ],
    },

    /*
      Web standard polyfills.
    */
    {
      name: 'polyfill',
      main: 'lib/polyfills.js',
      src: [
        'lib/polyfills/*.js',
        '!lib/**/*.spec.js',
        '!lib/**/*.spec-helper.js',
      ],
      spec: [
        'lib/**/*.spec-helper.js',
        'lib/polyfills/**/*.spec.js',
      ],
    },

    /*
      Documentation formatter script.
    */
    {
      name: 'docgen',
      src: [
        'lib/docgen/**/*.js',
        '!lib/**/*.spec.js',
        '!lib/**/*.spec-helper.js',
      ],
      spec: [
        'lib/**/*.spec-helper.js',
        'lib/docgen/**/*.spec.js',
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
      'doc/dom-upgrade.md',
      'doc/TODO.md',
      'doc/CHANGELOG.md',
    ],

    generated: [

      /*
        CSS Class Names
      */
      {
        src: [
          'lib/enums/option.js',
          'lib/enums/theme.js',
          'lib/enums/time.js',
          'lib/enums/phase.js',
          'lib/enums/marker.js',
          'lib/enums/layout.js',
          'lib/enums/flag.js',
          'lib/enums/pattern.js',
        ],
        options: {
          formatter: formatter.format.bind(formatter),
          template: 'lib/docgen/class-names.md.ejs',
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
          'lib/core/slider.js',
          'lib/core/slide-change-event.js',
          'lib/core/phaser.js',
          'lib/core/boot.js',
        ],
        options: {
          formatter: formatter.format.bind(formatter),
          template: 'lib/docgen/javascript-api.md.ejs',
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

