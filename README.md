
# Utilizing [CSS3 transitions](http://www.w3.org/TR/css3-transitions/)

Hermes comes with:

 * configurable background an content transitions (and big transition library),
 * responsiveness (automatically adjusts it's layout to screen resolution),
 * extendability (adding new transtitions is very simple),
 * component-based approach (each feature can be enabled separately),
 * HTML/CSS programming interface (no JavaScript coding required).

## Getting the Code

Preferred way to get hermes is to use [bower](http://bower.io/).
```
bower install hermes-slider --save-dev
```

You can also clone it with [git](https://git-scm.com/).
```
git clone https://github.com/webfront-toolkit/hermes.git
```

Package is not published in [npm](https://www.npmjs.com/).

## Hello, Hermes!

```html
<!--
  CSS links (slider + transition to be used).
  This typically goes inside the <head> element.
-->
<link href=bower_components/hermes/dist/hermes.min.css
      rel=stylesheet type=text/css>
<link href=bower_components/hermes/dist/transitions/zoom-in-out.min.css
      rel=stylesheet type=text/css>

<!--
  Slider is controlled mainly by classnames attached to slider element.
  JavaScript interface is also available, but rarely needed.
-->
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

<!--
  A script that upgrades all sliders on the page.
  Typically at the bottom of the <body> element.
-->
<script src=bower_components/hermes/dist/hermes.min.js type=text/javascript></script>
```

