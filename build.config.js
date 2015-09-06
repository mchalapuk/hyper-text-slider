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
        './src/transitions/*.scss',
      ],
      dest: 'transition/'
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

