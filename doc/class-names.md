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

<!-- Start Template class-names.md.ejs -->

# CSS Class Names

**Table of Contents**

1. [Layout Class Names](#layout-class-names)<ul>
<li>[hermes-layout--slider](#hermes-layout--slider)
<li>[hermes-layout--slide](#hermes-layout--slide)
<li>[hermes-layout--background](#hermes-layout--background)
<li>[hermes-layout--content](#hermes-layout--content)
<li>[hermes-layout--inner](#hermes-layout--inner)
<li>[hermes-layout--arrow](#hermes-layout--arrow)
<li>[hermes-layout--arrow-left](#hermes-layout--arrow-left)
<li>[hermes-layout--arrow-right](#hermes-layout--arrow-right)
<li>[hermes-layout--dots](#hermes-layout--dots)
<li>[hermes-layout--dot](#hermes-layout--dot)</ul>
2. [Option Class Names](#option-class-names)<ul>
<li>[hermes-defaults](#hermes-defaults)
<li>[hermes-autostart](#hermes-autostart)
<li>[hermes-autoplay](#hermes-autoplay)
<li>[hermes-create-arrows](#hermes-create-arrows)
<li>[hermes-create-dots](#hermes-create-dots)
<li>[hermes-arrow-keys](#hermes-arrow-keys)</ul>
3. [Transition Phase Class Names](#transition-phase-class-names)<ul>
<li>[hermes-before-transition](#hermes-before-transition)
<li>[hermes-during-transition](#hermes-during-transition)
<li>[hermes-after-transition](#hermes-after-transition)</ul>
4. [Transition Marker Class Names](#transition-marker-class-names)<ul>
<li>[hermes-slide-from](#hermes-slide-from)
<li>[hermes-slide-to](#hermes-slide-to)</ul>
5. [Flag Class Names](#flag-class-names)<ul>
<li>[is-upgraded](#is-upgraded)
<li>[is-active](#is-active)</ul>
6. [Other Class Names](#other-class-names)<ul>
<li>[/hermes-transition--([^ ]+)/g](#hermes-transition---g)</ul>

<!-- Start src/node/classnames/_layout.js -->

## Layout Class Names

Their usage is limited to:
 1. **role-id** - class names are used to identify element's role during slider upgrade,
 2. **transition** - class names must be used in CSS definitions of transitions,
 3. **styling** - class names are recommended for usage in slide's styling.

### Summary

Name | Description | Usage | Client HTML
--- | --- | --- | ---
[hermes-layout--slider](#hermes-layout--slider) | Identifies main slider element. | role-id styling | mandatory
[hermes-layout--slide](#hermes-layout--slide) | Identifies a slide. | role-id styling | mandatory
[hermes-layout--background](#hermes-layout--background) | Identifies background of a slide. | role-id styling transition | optional
[hermes-layout--content](#hermes-layout--content) | Identifies content of a slide. | role-id styling transition | optional
[hermes-layout--inner](#hermes-layout--inner) | May be used in definitions of content transitions. | transition | optional
[hermes-layout--arrow](#hermes-layout--arrow) | Set during upgrade on generated arrow buttons. | styling | forbidden
[hermes-layout--arrow-left](#hermes-layout--arrow-left) | Set during upgrade on generated left arrow button. | styling | forbidden
[hermes-layout--arrow-right](#hermes-layout--arrow-right) | Set during upgrade on generated right arrow button. | styling | forbidden
[hermes-layout--dots](#hermes-layout--dots) | Set during upgrade on container elements that contains dot buttons. | styling | forbidden
[hermes-layout--dot](#hermes-layout--dot) | Set during upgrade on each dot button element. | styling | forbidden

### Details

#### hermes-layout--slider

Identifies main slider element.

This class must be set on all slider elements in client HTML.
It can be used in client CSS code for styling.

#### hermes-layout--slide

Identifies a slide.

At least 2 slides must be defined in each slider.
It can be used in client CSS code for styling.

*@parent-element* - [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--background

Identifies background of a slide.

For slides in which this element is not present in slider declaration, empty background
element will be generated during slider upgrade. This class name must be used in all
definitions of background transitions.

*@parent-element* - [hermes-layout--slide](#hermes-layout--slide)

#### hermes-layout--content

Identifies content of a slide.

For slides in which this element is not present in slider declaration, it will be generated
during slider upgrade. Contents of a slide will be moved inside generated element. If element
is present in slider declaration, it must contain all contents of a slide. This class name
must be used in all definitions of content transitions.

*@parent-element* - [hermes-layout--slide](#hermes-layout--slide)

#### hermes-layout--inner

May be used in definitions of content transitions.

In cases when some parts of slide's content need another transition this class name must be
used in definition of the transition and in client HTML.

*@parent-element* - [hermes-layout--content](#hermes-layout--content)

#### hermes-layout--arrow

Set during upgrade on generated arrow buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--arrow-left

Set during upgrade on generated left arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--arrow-right

Set during upgrade on generated right arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--dots

Set during upgrade on container elements that contains dot buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--dot

Set during upgrade on each dot button element.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--dots](#hermes-layout--dots)

<!-- End src/node/classnames/_layout.js -->

<!-- Start src/node/classnames/_options.js -->

## Option Class Names

All option classes are intended to be set on slider element ([hermes-layout--slider](class-names.md#hermes-layout--slider)).

Two categories:
 1. **single options** - each of which enables one feature,
 2. **option groups** - that adds many option classes to the slider during upgrade.

Each option class is checked by the slider in one of two ways:
 1. <a href='#once' id='once'>**checked once**</a> - class name should be set
   in client HTML, slider will check for it only once during upgrade, adding/removing class
   after upgrade make no effect,
 2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
   class name may be added/removed at any time, slider will check if it is set every time
   a decission connected with this class is made.

### Summary

Name | Description | Checked
--- | --- | ---
[hermes-defaults](#hermes-defaults) | Adds [hermes-autostart](class-names.md#hermes-autostart), [hermes-autoplay](class-names.md#hermes-autoplay), [hermes-create-arrows](class-names.md#hermes-create-arrows), [hermes-create-dots](class-names.md#hermes-create-dots), [hermes-arrow-keys](class-names.md#hermes-arrow-keys) classes to the slider. | once
[hermes-autostart](#hermes-autostart) | Shows first slide automatically. | once
[hermes-autoplay](#hermes-autoplay) | Automatically moves slider to next slide. | continuously
[hermes-create-arrows](#hermes-create-arrows) | Creates side arrow buttons. | once
[hermes-create-dots](#hermes-create-dots) | Creates dot button for each slide. | once
[hermes-arrow-keys](#hermes-arrow-keys) | Adds keyboard control to slider. | once

### Details

#### hermes-defaults

Adds [hermes-autostart](class-names.md#hermes-autostart), [hermes-autoplay](class-names.md#hermes-autoplay),
 [hermes-create-arrows](class-names.md#hermes-create-arrows), [hermes-create-dots](class-names.md#hermes-create-dots),
 [hermes-arrow-keys](class-names.md#hermes-arrow-keys) classes to the slider.

*@checked* - [once](#once)

#### hermes-autostart

Shows first slide automatically.

*@checked* - [once](#once)

*@see* - [Slider.prototype.start](javascript-api.md#sliderprototypestart)

#### hermes-autoplay

Automatically moves slider to next slide.

Slider is moved after content transition of current slide ends.

*@checked* - [continuously](#continuously)

*@see* - [Slider.prototype.moveToNext](javascript-api.md#sliderprototypemovetonext)

#### hermes-create-arrows

Creates side arrow buttons.

`click` event on dispatched on left arrow moves slider to previous slide.
`click` event on dispatched on right arrow moves slider to next slide.

*@checked* - [once](#once)

*@see* - [Slider.prototype.moveToPrevious](javascript-api.md#sliderprototypemovetoprevious)

*@see* - [Slider.prototype.moveToNext](javascript-api.md#sliderprototypemovetonext)

#### hermes-create-dots

Creates dot button for each slide.

`click` event displatched on dot button moves slider to slide asociated with this dot button.

*@checked* - [once](#once)

*@see* - [Slider.prototype.currentIndex](javascript-api.md#sliderprototypecurrentindex)

#### hermes-arrow-keys

Adds keyboard control to slider.

`keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
slide, with `RightArrow` key moves slider to next slide.

*@checked* - [once](#once)

*@see* - [Slider.prototype.currentIndex](javascript-api.md#sliderprototypecurrentindex)

<!-- End src/node/classnames/_options.js -->

<!-- Start src/node/classnames/_phases.js -->

## Transition Phase Class Names

All phase classes are automatically set on slider element ([hermes-layout--slider](class-names.md#hermes-layout--slider)).
They MUST NOT be manipulated from client HTML or JavaScript. They **should be used only
in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
[hermes-before-transition](#hermes-before-transition) | Set on slider element just before transition starts.
[hermes-during-transition](#hermes-during-transition) | Set on slider element while transition of [hermes-layout--content](class-names.md#hermes-layout--content) element is run.
[hermes-after-transition](#hermes-after-transition) | Set on slider element after transition of [hermes-layout--content](class-names.md#hermes-layout--content) element ends.

### Details

#### hermes-before-transition

Set on slider element just before transition starts.

This phase lasts for 1 millisecond. It exists just for the purpose of setting CSS properties
to initial values before transition.

#### hermes-during-transition

Set on slider element while transition of [hermes-layout--content](class-names.md#hermes-layout--content) element is run.

#### hermes-after-transition

Set on slider element after transition of [hermes-layout--content](class-names.md#hermes-layout--content) element ends.

If [hermes-autoplay](class-names.md#hermes-autoplay) option is on, next transition
will be started just after hitting this phase, which will move slider
back to phase [hermes-before-transition](class-names.md#hermes-before-transition).

<!-- End src/node/classnames/_phases.js -->

<!-- Start src/node/classnames/_markers.js -->

## Transition Marker Class Names

They are automatically set on slide elements ([hermes-layout--slide](class-names.md#hermes-layout--slide)).
Marker class names MUST NOT be manipulated from client HTML or JavaScript
and **SHOULD be used only in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
[hermes-slide-from](#hermes-slide-from) | Automatically set on previously active [hermes-layout--slide](class-names.md#hermes-layout--slide).
[hermes-slide-to](#hermes-slide-to) | Automatically set on currently active [hermes-layout--slide](class-names.md#hermes-layout--slide).

### Details

#### hermes-slide-from

Automatically set on previously active [hermes-layout--slide](class-names.md#hermes-layout--slide).

*@invariant* - After starting first transition this class name is set on only one slide.

#### hermes-slide-to

Automatically set on currently active [hermes-layout--slide](class-names.md#hermes-layout--slide).

This class name is set on first slide after starting a slider
and then set on currently active slide each time it changes.

*@invariant* - After starting slider this class name is set on only one slide.

<!-- End src/node/classnames/_markers.js -->

<!-- Start src/node/classnames/_flags.js -->

## Flag Class Names

They are automatically set by the slider. Flag class names MUST NOT be manipulated from
client HTML or JavaScript and **SHOULD be used only in client CSS**.

### Summary

Name | Description
--- | ---
[is-upgraded](#is-upgraded) | Automatically set on slider after its upgrade.
[is-active](#is-active) | Automatically set on [hermes-layout--dot](class-names.md#hermes-layout--dot) button connected with currently active slide.

### Details

#### is-upgraded

Automatically set on slider after its upgrade.

#### is-active

Automatically set on [hermes-layout--dot](class-names.md#hermes-layout--dot) button connected with currently active slide.

*@invariant* - This class is set on only one dot button.

<!-- End src/node/classnames/_flags.js -->

<!-- Start src/node/classnames/_regexps.js -->

## Other Class Names

### Summary

Name | Description
--- | ---
[/hermes-transition--([^ ]+)/g](#hermes-transition---g) | All transitions used by the slider must match this regular expression.

### Details

#### /hermes-transition--([^ ]+)/g

All transitions used by the slider must match this regular expression.

During slider upgrade [hermes-layout--slider](class-names.md#hermes-layout--slider) element is checked for presence of
transition class names. Transitions declared this way will be randomly used by the slider.
After upgrade all declared transitions are removed from slider element.

Transitions may also be declared on [hermes-layout--slide](class-names.md#hermes-layout--slide) elements. Slider will always
use transition declared on slide element when moving to this slide. Transition declarations of
this type are [checked continuously](#continuously), therefore they may be added/removed
on slides at runtime (client JavaScript).

*@invariant* - Class name of currently running transition is set on slider element.

<!-- End src/node/classnames/_regexps.js -->

<!-- End Template class-names.md.ejs -->

