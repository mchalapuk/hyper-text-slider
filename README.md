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

 * configurable background and content transitions (and big transition library),
 * responsiveness (automatically adjusts it's layout to screen resolution),
 * extendability (adding new transtitions is very simple),
 * component-based approach (each feature can be enabled separately),
 * HTML/CSS programming interface (no JavaScript coding required).

## Getting the Code

Preferred way to get hermes is to use [bower](http://bower.io/).
```
bower install hermes --save-dev
```

You can also clone it with [git](https://git-scm.com/).
```
git clone https://github.com/webfront-toolkit/hermes.git
```

Package is not published in [npm](https://www.npmjs.com/).

# Documentation

 * [Declarative API](doc/class-names.md)
 * [JavaScript API](doc/javascript-api.md)

## Hello, Hermes!

```html
<!DOCTYPE html>
<html>
<head>

  <!-- required links to slider and transition styles -->
  <link href=bower_components/hermes/dist/hermes.min.css
        rel=stylesheet type=text/css>
  <link href=bower_components/hermes/dist/transitions/zoom-in-out.min.css
        rel=stylesheet type=text/css>

</head>
<body>

  <!-- slider declaration -->
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

  <!-- upgrades all declared sliders -->
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

## TODO List

 * ~~Write documentation~~
 * ~~Set up CI~~
 * Set up CDN
 * Extract examples to another project (or use Codepen)
 * Examples in the documentation
 * Add responsiveness to options (with configurable breakpoints)
 * Make time classes optional
 * Create transition library
 * Documentation for transition authors
 * Create project website
 * Extract DOM spec helpers to another project
 * Extract documentation generator to another project
 * Optimize size of compiled JavaScript

