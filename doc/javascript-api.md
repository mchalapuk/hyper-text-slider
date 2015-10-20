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
<li>[.prototype.slides](#sliderprototypeslides)
<li>[.prototype.currentIndex](#sliderprototypecurrentindex)
<li>[.prototype.currentSlide](#sliderprototypecurrentslide)
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

Type | Name | Description
--- | --- | ---
Array | [Slider.prototype.slides](#sliderprototypeslides) | Array containing all slide elements.
Number | [Slider.prototype.currentIndex](#sliderprototypecurrentindex) | Index of currently active slide.
Element | [Slider.prototype.currentSlide](#sliderprototypecurrentslide) | Currently active slide element.
void | [Slider.prototype.constructor(elem)](#sliderprototypeconstructorelem) | Constructs the slider.
void | [Slider.prototype.start()](#sliderprototypestart) | Shows first slide.
void | [Slider.prototype.moveToNext()](#sliderprototypemovetonext) | Moves slider to next slide.
void | [Slider.prototype.moveToPrevious()](#sliderprototypemovetoprevious) | Moves slider previous slide.
void | [Slider.prototype.moveTo(index)](#sliderprototypemovetoindex) | Moves slider slide of given index.

### Fields

#### Slider.prototype.slides

Array containing all slide elements.

*@type* - Array

*@access* - `read-only`

#### Slider.prototype.currentIndex

Index of currently active slide.

Set to `null` if [.prototype.start()](javascript-api.md#sliderprototypestart) was not called on this slider.

*@type* - Number

*@access* - `read-write`

#### Slider.prototype.currentSlide

Currently active slide element.

Set to `null` if [.prototype.start()](javascript-api.md#sliderprototypestart) was not called on this slider.

*@type* - Element

*@access* - `read-write`

### Methods

#### Slider.prototype.constructor(elem)

Constructs the slider.

*@param* {Element} **elem** - DOM element for the slider

#### Slider.prototype.start()

Shows first slide.

Starts the slider mechanism.

*@precondition* - [.prototype.start()](javascript-api.md#sliderprototypestart) was not called on this slider

*@postcondition* - calling [.prototype.start()](javascript-api.md#sliderprototypestart) again will throw exception

*@see* - [hermes-autostart](class-names.md#hermes-autostart)

#### Slider.prototype.moveToNext()

Moves slider to next slide.

*@precondition* - [.prototype.start()](javascript-api.md#sliderprototypestart) was called on this slider

*@see* - [hermes-autoplay](class-names.md#hermes-autoplay)

#### Slider.prototype.moveToPrevious()

Moves slider previous slide.

*@precondition* - [.prototype.start()](javascript-api.md#sliderprototypestart) was called on this slider

#### Slider.prototype.moveTo(index)

Moves slider slide of given index.

*@param* {Number} **index** - index of the slide that slider will be moved to

*@precondition* - [.prototype.start()](javascript-api.md#sliderprototypestart) was called on this slider

<!-- End src/node/slider.js -->

<!-- End Template javascript-api.md.ejs -->

