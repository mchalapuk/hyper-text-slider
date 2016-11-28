# HyperText Slider

[![Build Status](https://travis-ci.org/muroc/hyper-text-slider.svg?branch=master
)](https://travis-ci.org/muroc/hyper-text-slider)
[![Dependency Status](https://david-dm.org/muroc/hyper-text-slider.svg
)](https://david-dm.org/muroc/hyper-text-slider)
[![devDependency Status](https://david-dm.org/muroc/hyper-text-slider/dev-status.svg
)](https://david-dm.org/muroc/hyper-text-slider?type=dev)
[![Documentation Status](https://inch-ci.org/github/muroc/hyper-text-slider.svg?branch=master
)](https://inch-ci.org/github/muroc/hyper-text-slider)
[![Code Climate](https://codeclimate.com/github/muroc/hyper-text-slider/badges/gpa.svg
)](https://codeclimate.com/github/muroc/hyper-text-slider)

Declarative (HTML-programmable) slider component that utilizes
[CSS3 Transitions][transitions].

Comes with:

 * separately configurable background and content transitions,
 * responsiveness (automatically adjusts it's layout to screen resolution),
 * extendability (adding new transtitions is very simple),
 * component-based approach (each feature can be enabled separately),
 * HTML/CSS programming interface (no JavaScript coding required).

[transitions]: http://www.w3.org/TR/css3-transitions/

## Getting the Code

Preferred way to get HyperText Slider is to use [bower](http://bower.io/).
```shell
bower install hyper-text-slider --save-dev
```

You can also use [npm](https://www.npmjs.com/) (especially if using
[browserify](https://github.com/substack/node-browserify)).
```shell
npm install --save hyper-text-slider
```

## Hello, HyperText Slider!

```html
<!DOCTYPE html>
<html>
<head>
  <title>Hello, HyperText Slider!</title>

  <!--
    There are 4 things things needed for HyperText Slider to work:

     1. Slider's CSS (styles for the slider).
  -->
  <link href=bower_components/hyper-text-slider/dist/slider.min.css
        rel=stylesheet type=text/css>
</head>

<!--
     2. A flag on document's body which instructs HyperText Slider
       to automatically create and start Slider objects for all declared
       sliders on the page (no JavaScript programming required).
-->
<body class="ht-autoboot">

  <!--
     3. Declaration of a slider (features are enabled by adding class names
       to the slider element; this is a minimal configuration, but you can
       get pretty wild in here; please consult documentation for details).
  -->
  <div class="ht-slider ht-defaults">
    <div id=hello>
      <h1>Hello, HyperText Slider!</h2>
    </div>
    <div id=transitions class=ht-theme--black>
      <p>How's the waether?</p>
    </div>
  </div>

  <!--
     4. And slider script (it could be placed in the head section,
       but page may render a little faster this way).
  -->
  <script src=bower_components/hyper-text-slider/dist/core.min.js
          type=text/javascript>
  </script>
</body>
</html>

```

## Documentation

API Reference:
 * [Declarative API](doc/class-names.md)
 * [JavaScript API](doc/javascript-api.md)

User Guides:
 * [Adding Custom Themes](doc/custom-themes.md)
 * [Screen Responsiveness](doc/responsiveness.md)
 * [Slider's DOM Upgrade](doc/dom-upgrade.md)

Tutorials:
 * [HyperText Slider via Node and Browserify][node-tutorial]

See Also:
 * [Animatable CSS Properties][animatable]

Project Info:
 * [TODO List](doc/TODO.md)
 * [CHANGELOG](doc/CHANGELOG.md)

[node-tutorial]: https://github.com/muroc/hyper-text-slider-node-tutorial
[animatable]: https://drafts.csswg.org/css-transitions/#animatable-properties

## Contributing

Please read [build.config.js](build.config.js) file before contributing.
Pull requests are very welcome!

## License

Copyright &copy; 2016 Maciej Chałapuk.
Released under [Apache License Version 2.0](LICENSE).

