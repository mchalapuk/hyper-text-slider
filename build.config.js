var project_name = 'hermes';

module.exports = {
  dir: {
    build: './dist/',
  },

  css: [
    {
      src: [
        './src/internal/'+ project_name +'.scss',
      ],
    },
    {
      src: [
        './src/transitions/internal/*.scss',
      ],
      dest: 'transitions/'
    },
  ],

  js: {
    src: [
      './src/'+ project_name +'.js'
    ]
  },

  jshint: {
    globals: {
      'window': {},
      'document': {},
    },
  },
};

