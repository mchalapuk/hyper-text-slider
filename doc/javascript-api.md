<!--

Copyright 2015 Maciej Chałapuk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->

<!-- Start Template javascript-api.md.ejs -->

# JavaScript <abbr title="Application Programming Interface">API</abbr>

**Table of Contents**

1. [Slider](#slider)<ul>
<li>[.prototype.constructor(elem)](#sliderprototypeconstructorelem)
<li>[.prototype.start()](#sliderprototypestart)
<li>[.prototype.moveToNext()](#sliderprototypemovetonext)
<li>[.prototype.moveToPrevious()](#sliderprototypemovetoprevious)
<li>[.prototype.moveTo(index)](#sliderprototypemovetoindex)</ul>

<!-- Start src/node/slider.js -->

## Slider

> **DISCLAIMER**
>
> Hermes JavaScript API should be used only when specific initialization or integration
> with other parts of the website is required. In other (simpler) cases please consider
> using [declarative API](class-names.md).

### Example

```javascript
// browserify is supported
var hermes = require('hermes');

window.addEventListener('load', function() {
  var slider = new hermes.Slider(document.getElementById('my-slider'));
  slider.start();
});
```

### Summary

Name | Description
--- | ---
[Slider.prototype.constructor(elem)](#sliderprototypeconstructorelem) | Constructs the slider.
[Slider.prototype.start()](#sliderprototypestart) | Shows first slide.
[Slider.prototype.moveToNext()](#sliderprototypemovetonext) | Moves slider to next slide.
[Slider.prototype.moveToPrevious()](#sliderprototypemovetoprevious) | Moves slider previous slide.
[Slider.prototype.moveTo(index)](#sliderprototypemovetoindex) | Moves slider slide of given index.

### Methods

#### Slider.prototype.constructor(elem)

*@param* {Element} **elem** - DOM element for the slider

Constructs the slider.

#### Slider.prototype.start()

Shows first slide.

Starts the slider mechanism.

*@precondition* - [.prototype.start()](#sliderprototypestart) was not called on this slider

*@postcondition* - calling [.prototype.start()](#sliderprototypestart) again will throw exception

*@see* - hermes-autostart

#### Slider.prototype.moveToNext()

Moves slider to next slide.

*@precondition* - [.prototype.start()](#sliderprototypestart) was called on this slider

*@see* - hermes-autoplay

#### Slider.prototype.moveToPrevious()

Moves slider previous slide.

*@precondition* - [.prototype.start()](#sliderprototypestart) was called on this slider

#### Slider.prototype.moveTo(index)

*@param* {Number} **index** - index of the slide that slider will be moved to

Moves slider slide of given index.

*@precondition* - [.prototype.start()](#sliderprototypestart) was called on this slider

<!-- End src/node/slider.js -->

<!-- End Template javascript-api.md.ejs -->

