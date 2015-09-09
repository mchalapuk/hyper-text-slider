var project_name = 'hermes';

module.exports = {
  dir: {
    build: './dist/',
  },

  css: [
    {
      src: [
        './src/internal/${project_name}.scss',
      ],
    },
    {
      src: [
        './src/transitions/internal/${project_name}.scss',
      ],
      dest: 'transitions/'
    },
  ],

  js: {
    src: [
      './src/**/*.js', '!./src/**/*.spec.js'
    ],
    spec: [
      './src/**/*.spec-helper.js',
      './src/**/*.spec.js',
    ]
  },

  jshint: {
    globals: {
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

