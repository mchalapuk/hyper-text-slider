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

1. [Slider](javascript-api.md#slider)<ul>
<li>[.prototype.constructor(elem)](javascript-api.md#sliderprototypeconstructorelem)
<li>[.prototype.slides](javascript-api.md#sliderprototypeslides)
<li>[.prototype.currentIndex](javascript-api.md#sliderprototypecurrentindex)
<li>[.prototype.currentSlide](javascript-api.md#sliderprototypecurrentslide)
<li>[.prototype.start()](javascript-api.md#sliderprototypestart)
<li>[.prototype.moveToNext()](javascript-api.md#sliderprototypemovetonext)
<li>[.prototype.moveToPrevious()](javascript-api.md#sliderprototypemovetoprevious)
<li>[.prototype.moveTo(index)](javascript-api.md#sliderprototypemovetoindex)</ul>
2. [Phaser](javascript-api.md#phaser)<ul>
<li>[.prototype.constructor(elem)](javascript-api.md#phaserprototypeconstructorelem)
<li>[.prototype.startTransition()](javascript-api.md#phaserprototypestarttransition)
<li>[.prototype.nextPhase()](javascript-api.md#phaserprototypenextphase)
<li>[.prototype.setPhase(phase)](javascript-api.md#phaserprototypesetphasephase)
<li>[.prototype.addPhaseTrigger(elem, transitionProperty)](javascript-api.md#phaserprototypeaddphasetriggerelem-transitionproperty)
<li>[.prototype.addPhaseListener(listener)](javascript-api.md#phaserprototypeaddphaselistenerlistener)
<li>[.prototype.removePhaseTrigger(elem)](javascript-api.md#phaserprototyperemovephasetriggerelem)
<li>[.prototype.removePhaseListener(listener)](javascript-api.md#phaserprototyperemovephaselistenerlistener)
<li>[.prototype.getPhase()](javascript-api.md#phaserprototypegetphase)</ul>

<!-- Start src/js/slider.js -->

## Slider

> **DISCLAIMER**
>
> Hermes JavaScript API should be used only when specific initialization or integration
> with other parts of the website is required. In other (simpler) cases please consider
> using [declarative API](class-names.md).

> **DISCLAIMER**
>
> JavaScript API is in early **alpha stage** and may change in the future.
> [Declarative API](class-names.md) is stable (future versions will be backward-compatibile).

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
Array | [Slider.prototype.slides](javascript-api.md#sliderprototypeslides) | Array containing all slide elements.
Number | [Slider.prototype.currentIndex](javascript-api.md#sliderprototypecurrentindex) | Index of currently active slide.
Element | [Slider.prototype.currentSlide](javascript-api.md#sliderprototypecurrentslide) | Currently active slide element.
void | [Slider.prototype.constructor(elem)](javascript-api.md#sliderprototypeconstructorelem) | Constructs the slider.
void | [Slider.prototype.start()](javascript-api.md#sliderprototypestart) | Shows first slide.
void | [Slider.prototype.moveToNext()](javascript-api.md#sliderprototypemovetonext) | Moves slider to next slide.
void | [Slider.prototype.moveToPrevious()](javascript-api.md#sliderprototypemovetoprevious) | Moves slider previous slide.
void | [Slider.prototype.moveTo(index)](javascript-api.md#sliderprototypemovetoindex) | Moves slider slide of given index.

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

<!-- End src/js/slider.js -->

<!-- Start src/js/phaser.js -->

## Phaser

This class controls phases of CSS transitions by setting proper
[phase class names](class-names.md#transition-phase-class-names) on slider element.

It is an internal used by the [Slider](javascript-api.md#slider), but it can be used on any other DOM element
that require explicit control (from JavaScript) of CSS transitions.
To better illustrate how Phaser works, contents of a slide with `zoom-in-out` transition
will be used as an example throughout this documentation.

There are 3 phases of a transition. Each phase is identified by a [phase class name](class-names.md#transition-phase-class-names)
that is set by the Phaser on the container DOM element. Transitions are as follows.

 1. When transition is started, [hermes-before-transition](class-names.md#hermes-before-transition) class name is set on container
   DOM element. This phase is used to prepare all DOM elements inside a container element.
   In case of slide's content, `opacity` is set to `0` and `transform` is set to `scale(1.15)`.
   Slide is invisible and slightly zoomed-in. This phase lasts for 1 millisecond.
 2. After 1 millisecond, next phase ([hermes-during-transition](class-names.md#hermes-during-transition)) is automatically started.
   This is when all animation happens. Contents of current slide fading away
   (`opacity:0; transform:scale(1);`) and next slide is fading-in
   (`opacity:1; transform:scale(1.35);`). This phase last long (typically seconds).
   Time varies depending on transition being used.
 3. After animation is done, Phaser sets the phase to [hermes-after-transition](class-names.md#hermes-after-transition).
   There is a possibility of altering CSS in this phase (e.g. slight change of font color),
   but in zoom-in-out there is no style change after transition.

For all automatic phase changes to work, one of DOM elements that have transition specified
must be added to the phaser as a phase trigger (see [.prototype.addPhaseTrigger(elem, transitionProperty)](javascript-api.md#phaserprototypeaddphasetriggerelem-transitionproperty)).
Each time a transition on a phase trigger ends, [.prototype.nextPhase()](javascript-api.md#phaserprototypenextphase) method
is called. During its startup, [Slider](javascript-api.md#slider) sets phase change triggers on [layout elements](class-names.md#layout-class-names) (background and contents) of each slide and calls proper phase change methods
when slider controls are being used.

> ***DISCLAIMER***
>
> Implementation based on `window.setTimeout` function instead of `transitionend` event could
> be simpler, but implementing a transition would have to involve JavaScript programming (now
> it's purely declarative, CSS-only). Besides, using `window.setTimeout` would also mean using
> `window.requestAnimationFrame` as timeout can pass without any rendering, which could result
> in wrong animation (or no animation at all).

### Summary

Type | Name | Description
--- | --- | ---
void | [Phaser.prototype.constructor(elem)](javascript-api.md#phaserprototypeconstructorelem) | Creates Phaser.
void | [Phaser.prototype.startTransition()](javascript-api.md#phaserprototypestarttransition) | A higher level method for starting a transition.
void | [Phaser.prototype.nextPhase()](javascript-api.md#phaserprototypenextphase) | Switches phase to next one.
void | [Phaser.prototype.setPhase(phase)](javascript-api.md#phaserprototypesetphasephase) | Changes current phase.
void | [Phaser.prototype.addPhaseTrigger(elem, transitionProperty)](javascript-api.md#phaserprototypeaddphasetriggerelem-transitionproperty) | Adds passed element as phase trigger.
void | [Phaser.prototype.addPhaseListener(listener)](javascript-api.md#phaserprototypeaddphaselistenerlistener) | Adds a listener that will be notified on phase changes.
void | [Phaser.prototype.removePhaseTrigger(elem)](javascript-api.md#phaserprototyperemovephasetriggerelem) | Removes passed element from phase triggers.
void | [Phaser.prototype.removePhaseListener(listener)](javascript-api.md#phaserprototyperemovephaselistenerlistener) | Removes passed listener from the phaser.
String | [Phaser.prototype.getPhase()](javascript-api.md#phaserprototypegetphase) | Returns a class name of the current phase.

### Methods

#### Phaser.prototype.constructor(elem)

Creates Phaser.

This constructor has no side-effects. This means that no [phase class name](class-names.md#transition-phase-class-names) is set
after calling it. For phaser to start doing some work, [.prototype.setPhase(phase)](javascript-api.md#phaserprototypesetphasephase)
or [.prototype.startTransition()](javascript-api.md#phaserprototypestarttransition) needs to be invoked.

*@param* {Element} **elem** - container DOM element that will receive proper phase class names

#### Phaser.prototype.startTransition()

A higher level method for starting a transition.

```javascript
// a shorthand for
phaser.setPhase(Phase.BEFORE_TRANSITION)
```

#### Phaser.prototype.nextPhase()

Switches phase to next one.

This method is automatically invoked each time a transition ends
on DOM element added as phase trigger.

#### Phaser.prototype.setPhase(phase)

Changes current phase.

Invoking this method will result in setting CSS class name of requested phase on container
element.

*@param* {String} **phase** - desired phase

#### Phaser.prototype.addPhaseTrigger(elem, transitionProperty)

Adds passed element as phase trigger.

Phase will be automatically set to next each time transition
of passed property ends on passed element.

*@param* {Element} **elem** - DOM element that will be used as a phase trigger

*@param* {String} **transitionProperty** - CSS property that is used in the transition

#### Phaser.prototype.addPhaseListener(listener)

Adds a listener that will be notified on phase changes.

It is used by the [Slider](javascript-api.md#slider) to change styles of dots representing slides.

*@param* {Function} **listener** - listener to be added

#### Phaser.prototype.removePhaseTrigger(elem)

Removes passed element from phase triggers.

*@param* {Element} **elem** - DOM element that will no longer be used as a phase trigger

#### Phaser.prototype.removePhaseListener(listener)

Removes passed listener from the phaser.

*@param* {Function} **listener** - listener to be removed

#### Phaser.prototype.getPhase()

Returns a class name of the current phase.

*@return* - {String} current phase

<!-- End src/js/phaser.js -->

<!-- End Template javascript-api.md.ejs -->

