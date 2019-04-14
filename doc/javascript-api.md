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

<ol>

<li><a href="javascript-api.md#bootcontainerelement">boot(containerElement)</a><ul></ul></li>

<li><a href="javascript-api.md#slider">Slider</a><ul>
<li><a href="javascript-api.md#sliderprototypeconstructorelem">.prototype.constructor(elem)</a>
<li><a href="javascript-api.md#sliderprototypeslides">.prototype.slides</a>
<li><a href="javascript-api.md#sliderprototypecurrentindex">.prototype.currentIndex</a>
<li><a href="javascript-api.md#sliderprototypecurrentslide">.prototype.currentSlide</a>
<li><a href="javascript-api.md#sliderprototypestartcallback">.prototype.start(callback)</a>
<li><a href="javascript-api.md#sliderprototypemovetonext">.prototype.moveToNext()</a>
<li><a href="javascript-api.md#sliderprototypemovetoprevious">.prototype.moveToPrevious()</a>
<li><a href="javascript-api.md#sliderprototypemovetoindex">.prototype.moveTo(index)</a>
<li><a href="javascript-api.md#sliderprototypeoneventname-listener">.prototype.on(eventName, listener)</a>
<li><a href="javascript-api.md#sliderprototyperemovelistenereventname-listener">.prototype.removeListener(eventName, listener)</a></ul></li>

<li><a href="javascript-api.md#slidechangeevent">SlideChangeEvent</a><ul>
<li><a href="javascript-api.md#slidechangeeventprototypeconstructorfrom-to">.prototype.constructor(from, to)</a>
<li><a href="javascript-api.md#slidechangeeventprototypefromindex">.prototype.fromIndex</a>
<li><a href="javascript-api.md#slidechangeeventprototypetoindex">.prototype.toIndex</a>
<li><a href="javascript-api.md#slidechangeeventprototypeeventname">.prototype.eventName</a>
<li><a href="javascript-api.md#slidechangeeventprototypetarget">.prototype.target</a></ul></li>

<li><a href="javascript-api.md#phaser">Phaser</a><ul>
<li><a href="javascript-api.md#phaserprototypeconstructorelement">.prototype.constructor(element)</a>
<li><a href="javascript-api.md#phaserprototypestarttransition">.prototype.startTransition()</a>
<li><a href="javascript-api.md#phaserprototypenextphase">.prototype.nextPhase()</a>
<li><a href="javascript-api.md#phaserprototypesetphasephase">.prototype.setPhase(phase)</a>
<li><a href="javascript-api.md#phaserprototypeaddphasetriggertarget-propertyname">.prototype.addPhaseTrigger(target, propertyName)</a>
<li><a href="javascript-api.md#phaserprototypeaddphaselistenerlistener">.prototype.addPhaseListener(listener)</a>
<li><a href="javascript-api.md#phaserprototyperemovephasetriggertarget-transitionproperty">.prototype.removePhaseTrigger(target, transitionProperty)</a>
<li><a href="javascript-api.md#phaserprototyperemovephaselistenerlistener">.prototype.removePhaseListener(listener)</a>
<li><a href="javascript-api.md#phaserprototypegetphase">.prototype.getPhase()</a></ul></li>
</ol>

<!-- Start lib/core/boot.js -->

## boot(containerElement)

Default HyperText Slider boot procedure.

For each element with <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> class name found in passed container
(typically document's `<body>`):

 1. Adds [options class names](class-names.md#option-class-names) found on container element,
 1. Creates <a href="javascript-api.md#slider">Slider</a> object,
 2. Invokes its <a href="javascript-api.md#sliderprototypestartcallback">Slider.prototype.start(callback)</a> method.

If you are using browserify, you may want to call this function at some point...

```javascript
var htSlider = require('hyper-text-slider');
htSlider.boot(document.body);
```

...or even consider implementing bootup by yourself.

*@param* {Element} **containerElement** - element that contains sliders in (not necessarily immediate) children

*@return* - {Array<Slider>} array containing all created <a href="javascript-api.md#slider">Slider</a> instances

*@see* - <a href="class-names.md#ht-autoboot">ht-autoboot</a>

<!-- End lib/core/boot.js -->

<!-- Start lib/core/slider.js -->

## Slider

> **NOTE**
>
> HyperText Slider JavaScript API should be used only when specific initialization or integration
> with other parts of the website is required. In other (simpler) cases please consider
> using [declarative API](class-names.md).

### Example

```javascript
// browserify is supported
var ht = require('hyper-text-slider');

window.addEventListener('load', function() {
  var slider = new ht.Slider(document.getElementById('my-slider'));
  slider.start();
});
```

### Summary

Type | Name | Description
--- | --- | ---
Array | <a href="javascript-api.md#sliderprototypeslides">Slider.prototype.slides</a> | Array containing all slide elements.
Number | <a href="javascript-api.md#sliderprototypecurrentindex">Slider.prototype.currentIndex</a> | Index of currently active slide.
Element | <a href="javascript-api.md#sliderprototypecurrentslide">Slider.prototype.currentSlide</a> | Currently active slide element.
void | <a href="javascript-api.md#sliderprototypeconstructorelem">Slider.prototype.constructor(elem)</a> | Constructs the slider.
void | <a href="javascript-api.md#sliderprototypestartcallback">Slider.prototype.start(callback)</a> | Upgrades DOM elements and shows the first slide.
void | <a href="javascript-api.md#sliderprototypemovetonext">Slider.prototype.moveToNext()</a> | Moves slider to next slide.
void | <a href="javascript-api.md#sliderprototypemovetoprevious">Slider.prototype.moveToPrevious()</a> | Moves slider previous slide.
void | <a href="javascript-api.md#sliderprototypemovetoindex">Slider.prototype.moveTo(index)</a> | Moves slider slide of given index.
void | <a href="javascript-api.md#sliderprototypeoneventname-listener">Slider.prototype.on(eventName, listener)</a> | Registers a listener on given eventName.
void | <a href="javascript-api.md#sliderprototyperemovelistenereventname-listener">Slider.prototype.removeListener(eventName, listener)</a> | Unregisters a listener from given eventName.

### Fields

#### Slider.prototype.slides

Array containing all slide elements.

*@type* - Array

*@access* - `read-only`

#### Slider.prototype.currentIndex

Index of currently active slide.

Set to `null` if <a href="javascript-api.md#sliderprototypestartcallback">.prototype.start(callback)</a> was not called on this slider.

*@type* - Number

*@access* - `read-write`

#### Slider.prototype.currentSlide

Currently active slide element.

Set to `null` if <a href="javascript-api.md#sliderprototypestartcallback">.prototype.start(callback)</a> was not called on this slider.

*@type* - Element

*@access* - `read-write`

### Methods

#### Slider.prototype.constructor(elem)

Constructs the slider.

*@param* {Element} **elem** - DOM element for the slider

#### Slider.prototype.start(callback)

Upgrades DOM elements and shows the first slide.

Starting procedure involves manipuilating DOM and waiting for changes to be visible on the
screen, therefore slider will not be started immediately after returning from this call.
After all slides are upgraded and visible on the screen, given **callback** will be called
by the slider. At that time it's safe to use all features of the slider.

```js
slider.start(function() {
  slider.currentIndex = 1;
});
```

*@param* {Function} **callback** - that will be called after all slides are upgraded

*@precondition* - <a href="javascript-api.md#sliderprototypestartcallback">.prototype.start(callback)</a> was not called on this slider

*@postcondition* - calling <a href="javascript-api.md#sliderprototypestartcallback">.prototype.start(callback)</a> again will throw exception

*@see* - <a href="class-names.md#ht-autoboot">ht-autoboot</a>

#### Slider.prototype.moveToNext()

Moves slider to next slide.

*@precondition* - <a href="javascript-api.md#sliderprototypestartcallback">.prototype.start(callback)</a> was called on this slider

*@see* - <a href="class-names.md#ht-option--autoplay">ht-option--autoplay</a>

#### Slider.prototype.moveToPrevious()

Moves slider previous slide.

*@precondition* - <a href="javascript-api.md#sliderprototypestartcallback">.prototype.start(callback)</a> was called on this slider

#### Slider.prototype.moveTo(index)

Moves slider slide of given index.

*@param* {Number} **index** - index of the slide that slider will be moved to

*@precondition* - <a href="javascript-api.md#sliderprototypestartcallback">.prototype.start(callback)</a> was called on this slider

#### Slider.prototype.on(eventName, listener)

Registers a listener on given eventName.

*@param* {String} **eventName** - name of event

*@param* {Function} **listener** - a function

*@postcondition* - given listener will be notified about current slide changes

#### Slider.prototype.removeListener(eventName, listener)

Unregisters a listener from given eventName.

*@param* {String} **eventName** - name of event

*@param* {Function} **listener** - a function

*@precondition* - given listener was previously passed to <a href="javascript-api.md#sliderprototypeoneventname-listener">.prototype.on(eventName, listener)</a>

*@postcondition* - given listener will no longer be notified about current slide changes

<!-- End lib/core/slider.js -->

<!-- Start lib/core/slide-change-event.js -->

## SlideChangeEvent

Fired by the slider when currently visible slide changes.

*@see* - <a href="javascript-api.md#sliderprototypeoneventname-listener">Slider.prototype.on(eventName, listener)</a>

### Summary

Type | Name | Description
--- | --- | ---
Number | <a href="javascript-api.md#slidechangeeventprototypefromindex">SlideChangeEvent.prototype.fromIndex</a> | Index of previous slide.
Number | <a href="javascript-api.md#slidechangeeventprototypetoindex">SlideChangeEvent.prototype.toIndex</a> | Index of current slide.
String | <a href="javascript-api.md#slidechangeeventprototypeeventname">SlideChangeEvent.prototype.eventName</a> | Always set to 'slideChange'.
<a href="javascript-api.md#slider">Slider</a> | <a href="javascript-api.md#slidechangeeventprototypetarget">SlideChangeEvent.prototype.target</a> | Slider instance in which slide has changed.
void | <a href="javascript-api.md#slidechangeeventprototypeconstructorfrom-to">SlideChangeEvent.prototype.constructor(from, to)</a> | Creates SlideChangeEvent.

### Fields

#### SlideChangeEvent.prototype.fromIndex

Index of previous slide.

*@type* - Number

*@access* - `read-only`

#### SlideChangeEvent.prototype.toIndex

Index of current slide.

*@type* - Number

*@access* - `read-only`

#### SlideChangeEvent.prototype.eventName

Always set to 'slideChange'.

*@type* - String

*@access* - `read-only`

#### SlideChangeEvent.prototype.target

Slider instance in which slide has changed.

*@type* - <a href="javascript-api.md#slider">Slider</a>

*@access* - `read-only`

### Methods

#### SlideChangeEvent.prototype.constructor(from, to)

Creates SlideChangeEvent.

*@param* {Number} **from** - index of a previous slide

*@param* {Number} **to** - index of current slide

<!-- End lib/core/slide-change-event.js -->

<!-- Start lib/core/phaser.js -->

## Phaser

This class controls phases of CSS transitions by setting proper
[phase class names](class-names.md#transition-phase-class-names) on slider element.

It is an internal used by the <a href="javascript-api.md#slider">Slider</a>, but it can be used on any other DOM element
that require explicit control (from JavaScript) of CSS transitions.
To better illustrate how Phaser works, contents of a slide with `zoom-in-out` transition
will be used as an example throughout this documentation.

There are 3 phases of a transition. Each phase is identified by a [phase class name](class-names.md#transition-phase-class-names)
that is set by the Phaser on the container DOM element. Transitions are as follows.

 1. When transition is started, <a href="class-names.md#ht-before-transition">ht-before-transition</a> class name is set on container
   DOM element. This phase is used to prepare all DOM elements inside a container element.
   In case of slide's content, `opacity` is set to `0` and `transform` is set to `scale(1.15)`.
   Slide is invisible and slightly zoomed-in. This phase lasts for 1 millisecond.
 2. After 1 millisecond, next phase (<a href="class-names.md#ht-during-transition">ht-during-transition</a>) is automatically started.
   This is when all animation happens. Contents of current slide fading away
   (`opacity:0; transform:scale(1);`) and next slide is fading-in
   (`opacity:1; transform:scale(1.35);`). This phase last long (typically seconds).
   Time varies depending on transition being used.
 3. After animation is done, Phaser sets the phase to <a href="class-names.md#ht-after-transition">ht-after-transition</a>.
   There is a possibility of altering CSS in this phase (e.g. slight change of font color),
   but in zoom-in-out there is no style change after transition.

For all automatic phase changes to work, one of DOM elements that have transition specified
must be added to the phaser as a phase trigger (see <a href="javascript-api.md#phaserprototypeaddphasetriggertarget-propertyname">.prototype.addPhaseTrigger(target, propertyName)</a>).
Each time a transition on a phase trigger ends, <a href="javascript-api.md#phaserprototypenextphase">.prototype.nextPhase()</a> method
is called. During its startup, <a href="javascript-api.md#slider">Slider</a> sets phase change triggers on [layout elements](class-names.md#layout-class-names) (background and contents) of each slide and calls proper phase change methods
when slider controls are being used.

> **NOTE**
>
> Implementation based on `window.setTimeout` function instead of `transitionend` event could
> be simpler, but implementing a transition would have to involve JavaScript programming (now
> it's purely declarative, CSS-only). Besides, using `window.setTimeout` would also mean using
> `window.requestAnimationFrame` as timeout can pass without any rendering, which could result
> in wrong animation (or no animation at all).

### Summary

Type | Name | Description
--- | --- | ---
void | <a href="javascript-api.md#phaserprototypeconstructorelement">Phaser.prototype.constructor(element)</a> | Creates Phaser.
void | <a href="javascript-api.md#phaserprototypestarttransition">Phaser.prototype.startTransition()</a> | A higher level method for starting a transition.
void | <a href="javascript-api.md#phaserprototypenextphase">Phaser.prototype.nextPhase()</a> | Switches phase to next one.
void | <a href="javascript-api.md#phaserprototypesetphasephase">Phaser.prototype.setPhase(phase)</a> | Changes current phase.
void | <a href="javascript-api.md#phaserprototypeaddphasetriggertarget-propertyname">Phaser.prototype.addPhaseTrigger(target, propertyName)</a> | Adds passed target to phase triggers.
void | <a href="javascript-api.md#phaserprototypeaddphaselistenerlistener">Phaser.prototype.addPhaseListener(listener)</a> | Adds a listener that will be notified on phase changes.
void | <a href="javascript-api.md#phaserprototyperemovephasetriggertarget-transitionproperty">Phaser.prototype.removePhaseTrigger(target, transitionProperty)</a> | Removes passed target from phase triggers.
void | <a href="javascript-api.md#phaserprototyperemovephaselistenerlistener">Phaser.prototype.removePhaseListener(listener)</a> | Removes passed listener from the phaser.
String | <a href="javascript-api.md#phaserprototypegetphase">Phaser.prototype.getPhase()</a> | Returns a class name of the current phase.

### Methods

#### Phaser.prototype.constructor(element)

Creates Phaser.

This constructor has no side-effects. This means that no [phase class name](class-names.md#transition-phase-class-names)
is set on given **element** and no eventlistener is set after calling it. For phaser to start
doing some work, <a href="javascript-api.md#phaserprototypesetphasephase">.prototype.setPhase(phase)</a>, <a href="javascript-api.md#phaserprototypestarttransition">.prototype.startTransition()</a>
or <a href="javascript-api.md#phaserprototypeaddphasetriggertarget-propertyname">.prototype.addPhaseTrigger(target, propertyName)</a> must be invoked.

*@param* {Element} **element** - container DOM element that will receive proper phase class names

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

Invoking this method will result in setting CSS class name
of requested phase on container element.

*@param* {String} **phase** - desired phase

#### Phaser.prototype.addPhaseTrigger(target, propertyName)

Adds passed target to phase triggers.

Phase will be automatically set to next each time a `transitionend` event of matching
**target** and **propertyName** bubbles up to Phaser's container element.

*@param* {Node} **target** - (typically DOM Element) that will trigger next phase when matched

*@param* {String} **propertyName** - will trigger next phase when matched (optional, defaults to 'transform')

*@precondition* - **target** has container element as ancestor (see <a href="javascript-api.md#phaserprototypeconstructorelement">.prototype.constructor(element)</a>)

*@precondition* - given pair of **target** and **propertyName** is not already a phase trigger

#### Phaser.prototype.addPhaseListener(listener)

Adds a listener that will be notified on phase changes.

It is used by the <a href="javascript-api.md#slider">Slider</a> to change styles of dots representing slides.

*@param* {Function} **listener** - listener to be added

#### Phaser.prototype.removePhaseTrigger(target, transitionProperty)

Removes passed target from phase triggers.

*@param* {Node} **target** - that will no longer be used as a phase trigger

*@param* {String} **transitionProperty** - that will no longer be a trigger (optional, defaults to 'transform')

*@precondition* - given pair of **target** and **propertyName** is registered as phase trigger

#### Phaser.prototype.removePhaseListener(listener)

Removes passed listener from the phaser.

*@param* {Function} **listener** - listener to be removed

#### Phaser.prototype.getPhase()

Returns a class name of the current phase.

*@return* {String} current phase

<!-- End lib/core/phaser.js -->

<!-- End Template javascript-api.md.ejs -->

