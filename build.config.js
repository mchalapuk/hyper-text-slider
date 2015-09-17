var project_name = 'hermes';

module.exports = {
  dir: {
    build: './dist/',
  },

  css: [
    {
      src: [
        './src/sass/*.scss',
      ],
      main: [
        './src/sass/'+ project_name +'.scss',
      ],
    },
    {
      src: [
        './src/sass/transitions/**/*.scss',
      ],
      main: [
        './src/sass/transitions/internal/*.scss',
      ],
      dest: 'transitions/'
    },
  ],

  js: {
    src: [
      './src/node/**/*.js', '!./src/node/**/*.spec.js'
    ],
    main: [
      './src/'+ project_name +'.js',
    ],
    spec: [
      './src/node/**/*.spec-helper.js',
      './src/node/**/*.spec.js',
    ]
  },

  jshint: {
    globals: {
      'Node': {},
      'Element': {},
      'DOMTokenList': {},
      'TransitionEndEvent': {},
      'KeyDownEvent': {},
      'ClickEvent': {},
      'Document': {},
      'Window': {},

      'window': {},
      'document': {},

      'describe': {},
      'it': {},
      'expect': {},
      'beforeEach': {},
      'afterEach': {},
    },
  },
};

