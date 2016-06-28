# Utilizing [CSS3 Transitions](http://www.w3.org/TR/css3-transitions/)

[![Build Status](https://travis-ci.org/webfront-toolkit/hermes.svg?branch=master
)](https://travis-ci.org/webfront-toolkit/hermes)
[![Dependency Status](https://david-dm.org/webfront-toolkit/hermes.svg
)](https://david-dm.org/webfront-toolkit/hermes)
[![devDependency Status](https://david-dm.org/webfront-toolkit/hermes/dev-status.svg
)](https://david-dm.org/webfront-toolkit/hermes#info=devDependencies)
[![Documentation Status](http://inch-ci.org/github/webfront-toolkit/hermes.svg?branch=master
)](http://inch-ci.org/github/webfront-toolkit/hermes)
[![Code Climate](https://codeclimate.com/github/webfront-toolkit/hermes/badges/gpa.svg
)](https://codeclimate.com/github/webfront-toolkit/hermes)

Hermes comes with:

 * configurable background and content transitions,
 * responsiveness (automatically adjusts it's layout to screen resolution),
 * extendability (adding new transtitions is very simple),
 * component-based approach (each feature can be enabled separately),
 * HTML/CSS programming interface (no JavaScript coding required).

## Getting the Code

Preferred way to get hermes is to use [bower](http://bower.io/).
```shell
bower install hermes --save-dev
```

You can also use [npm](https://www.npmjs.com/) (especially if using
[browserify](https://github.com/substack/node-browserify)).
```shell
npm install --save hermes-slider
```

## Documentation

 * [Declarative API](doc/class-names.md)
 * [JavaScript API](doc/javascript-api.md)
 * [Screen Responsiveness](doc/responsiveness.md)
 * [TODO List](TODO.md)
 * [CHANGELOG](CHANGELOG.md)

## Hello, Hermes!

```html
<!DOCTYPE html>
<html>
<head>
  <title>Hello, Hermes!</title>

  <!--
    There are three things needed for Hermes to work:

     1. Hermes' CSS (styles of the slider and a declaration
       of the transitions we intend to use).
  -->
  <link href=bower_components/hermes/dist/hermes.min.css
        rel=stylesheet type=text/css>
  <link href=bower_components/hermes/dist/transitions/zoom-in-out.min.css
        rel=stylesheet type=text/css>
</head>
<body>

  <!--
     2. Declaration of a slider (features are enabled by adding class names
       to the slider element; this is a minimal configuration, but you can get
       pretty wild in here; please consult documentation for details).
  -->
  <div class="hermes-layout--slider
              hermes-transition--zoom-in-out
              hermes-slide-time-5-sec
              hermes-defaults">
    <div class="hermes-layout--slide" id="hello">
      <h1>Hello, Hermes!</h2>
    </div>
    <div class="hermes-layout--slide" id="transitions">
      <p>How's the waether?</p>
    </div>
  </div>

  <!--
     3. Hermes script (it could be placed in the head section,
       but page may render a little faster this way).
  -->
  <script src=bower_components/hermes/dist/hermes.min.js type=text/javascript>
  </script>
</body>
</html>

```

## Contributing

Please read [build.config.js](build.config.js) file before contributing. Pull
requests are very welcome!

## License

[Apache License Version 2.0](LICENSE)

