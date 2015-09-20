
# Utilizing [CSS3 Transitions](http://www.w3.org/TR/css3-transitions/)

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

## Hello, Hermes!

Links to `hermes.css` and [transitions](http://www.w3.org/TR/css3-transitions/)
go inside the `<head>` element.

```html
<link href=bower_components/hermes/dist/hermes.min.css
      rel=stylesheet type=text/css>
<link href=bower_components/hermes/dist/transitions/zoom-in-out.min.css
      rel=stylesheet type=text/css>
```

Slider declaration in the `<body>` element.

```html
<div class="hermes-layout--slider
            hermes-transition--zoom-in-out
            hermes-slide-time-5-sec
            hermes-defaults">
  <div class="hermes-layout--slide" id="hello">
    <h1>Hello, Hermes!</h2>
  </div>
  <div class="hermes-layout--slide" id="transitions">
    <p>God of Transitions.</p>
  </div>
</div>
```

Put the bottom of the page, `slider.js` script upgrades all declared sliders.

```html
<script src=bower_components/hermes/dist/hermes.min.js type=text/javascript>
</script>
```

## Contributing

Please read [build.config.js](build.config.js) file before contributing. Pull
requests are very welcome!

## TODO List

 * Write documentation
 * Set up CI
 * Set up CDN
 * Extract examples to another project (or use Codepen)
 * Add responsiveness to options (with configurable breakpoints)
 * Make time classes optional
 * Create transition library
 * Create project website
 * Extract DOM spec helpers to another project
 * Optimize size of compiled JavaScript

