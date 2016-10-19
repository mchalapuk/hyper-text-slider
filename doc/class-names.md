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

1. [Common Class Names](class-names.md#common-class-names)<ul>
<li>[hermes-autoboot](class-names.md#hermes-autoboot)</ul>
2. [Option Class Names](class-names.md#option-class-names)<ul>
<li>[hermes-defaults](class-names.md#hermes-defaults)
<li>[hermes-autoplay](class-names.md#hermes-autoplay)
<li>[hermes-arrow-keys](class-names.md#hermes-arrow-keys)</ul>
3. [Theme Class Names](class-names.md#theme-class-names)<ul>
<li>[hermes-theme--responsive-arrows](class-names.md#hermes-theme--responsive-arrows)
<li>[hermes-theme--white](class-names.md#hermes-theme--white)
<li>[hermes-theme--hover-visible-arrows](class-names.md#hermes-theme--hover-visible-arrows)
<li>[hermes-theme--default-dots](class-names.md#hermes-theme--default-dots)
<li>[hermes-theme--black](class-names.md#hermes-theme--black)
<li>[hermes-theme--hover-visible-dots](class-names.md#hermes-theme--hover-visible-dots)
<li>[hermes-theme--hover-opaque-dots](class-names.md#hermes-theme--hover-opaque-dots)
<li>[hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows)
<li>[hermes-theme--hover-opaque-arrows](class-names.md#hermes-theme--hover-opaque-arrows)
<li>[hermes-theme--default-controls](class-names.md#hermes-theme--default-controls)
<li>[hermes-theme--hover-visible-controls](class-names.md#hermes-theme--hover-visible-controls)
<li>[hermes-theme--hover-opaque-controls](class-names.md#hermes-theme--hover-opaque-controls)
<li>[hermes-theme--defaults](class-names.md#hermes-theme--defaults)</ul>
4. [Transition Class Names](class-names.md#transition-class-names)<ul>
<li>[hermes-transition--zoom-out-in](class-names.md#hermes-transition--zoom-out-in)
<li>[hermes-transition--bg-zoom-in-out](class-names.md#hermes-transition--bg-zoom-in-out)</ul>
5. [Time Class Names](class-names.md#time-class-names)<ul>
<li>[hermes-slide-time-3sec](class-names.md#hermes-slide-time-3sec)
<li>[hermes-slide-time-7sec](class-names.md#hermes-slide-time-7sec)</ul>
6. [Transition Phase Class Names](class-names.md#transition-phase-class-names)<ul>
<li>[hermes-before-transition](class-names.md#hermes-before-transition)
<li>[hermes-during-transition](class-names.md#hermes-during-transition)
<li>[hermes-after-transition](class-names.md#hermes-after-transition)</ul>
7. [Transition Marker Class Names](class-names.md#transition-marker-class-names)<ul>
<li>[hermes-slide-from](class-names.md#hermes-slide-from)
<li>[hermes-slide-to](class-names.md#hermes-slide-to)</ul>
8. [Layout Class Names](class-names.md#layout-class-names)<ul>
<li>[hermes-layout--controls](class-names.md#hermes-layout--controls)
<li>[hermes-slider](class-names.md#hermes-slider)
<li>[hermes-layout--slider](class-names.md#hermes-layout--slider)
<li>[hermes-layout--slide](class-names.md#hermes-layout--slide)
<li>[hermes-layout--background](class-names.md#hermes-layout--background)
<li>[hermes-layout--content](class-names.md#hermes-layout--content)
<li>[hermes-layout--arrow](class-names.md#hermes-layout--arrow)
<li>[hermes-layout--arrow-left](class-names.md#hermes-layout--arrow-left)
<li>[hermes-layout--arrow-right](class-names.md#hermes-layout--arrow-right)
<li>[hermes-layout--dots](class-names.md#hermes-layout--dots)
<li>[hermes-layout--dot](class-names.md#hermes-layout--dot)</ul>
9. [Flag Class Names](class-names.md#flag-class-names)<ul>
<li>[is-upgraded](class-names.md#is-upgraded)
<li>[is-active](class-names.md#is-active)</ul>
10. [Other Class Names](class-names.md#other-class-names)<ul>
<li>[/hermes-transition--([^\s]+)/g](class-names.md#hermes-transition--\sg)
<li>[/hermes-theme--([^\s]+)/g](class-names.md#hermes-theme--\sg)
<li>[/hermes-slide-id-([^\s]+)/](class-names.md#hermes-slide-id-\s)</ul>

<!-- Start lib/enums/common.js -->

## Common Class Names

Most commonly used class names.

Each class is checked by the slider in one of two ways:
 1. <a href='#once' id='once'>**checked once**</a> - class name should be set
   in client HTML, slider will check for it only once during upgrade, adding/removing class
   after upgrade make no effect,
 2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
   class name may be added/removed at any time, slider will check if it is set every time
   a decission connected with this class is made.

There are two categories of class names:
 1. **functional classes** - each of which enables one feature,
 2. **class groups** - that adds many class names to the slider during its
   [upgrade](dom-upgrade.md).

### Summary

Name | Description | Checked | Target Element
--- | --- | --- | ---
[hermes-autoboot](class-names.md#hermes-autoboot) | Automatically creates [Slider](javascript-api.md#slider) objects for all sliders declared on the page and invokes their [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback) methods. | once | document's `<body>`

### Details

#### hermes-autoboot

Automatically creates [Slider](javascript-api.md#slider) objects for all sliders declared on the page
and invokes their [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback) methods.

This options can be set only on `<body>` element.
It enabled using Hermes without any JavaScript programming.

> ***WARNING***
>
> When using Hermes via node and broserify, this option is ignored.

*@checked* - [once](#once)

*@target* - document's `<body>`

*@see* - [boot(containerElement)](javascript-api.md#bootcontainerelement)

*@see* - [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback)

<!-- End lib/enums/common.js -->

<!-- Start lib/enums/option.js -->

## Option Class Names

Option classes enable features of the slider.

Most options are intended to be set on [hermes-layout--slider](class-names.md#hermes-layout--slider) element, but they can also be
set on document's `<body>`. Options set on `<body>` are treated as defaults for each [hermes-layout--slider](class-names.md#hermes-layout--slider) declared on the page.

### Summary

Name | Description | Checked | Target Element
--- | --- | --- | ---
[hermes-defaults](class-names.md#hermes-defaults) | Adds [hermes-autoplay](class-names.md#hermes-autoplay), [hermes-arrow-keys](class-names.md#hermes-arrow-keys). classes to the slider. | once | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)
[hermes-autoplay](class-names.md#hermes-autoplay) | Automatically moves slider to next slide. | continuously | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)
[hermes-arrow-keys](class-names.md#hermes-arrow-keys) | Adds keyboard control to slider. | once | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

### Details

#### hermes-defaults

Adds
[hermes-autoplay](class-names.md#hermes-autoplay),
[hermes-arrow-keys](class-names.md#hermes-arrow-keys).
classes to the slider.

*@checked* - [once](#once)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-autoplay

Automatically moves slider to next slide.

Slider is moved to the next after time specified in [time class name](class-names.md#time-class-names).

*@checked* - [continuously](#continuously)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

*@see* - [Slider.prototype.moveToNext()](javascript-api.md#sliderprototypemovetonext)

#### hermes-arrow-keys

Adds keyboard control to slider.

`keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
slide, with `RightArrow` key moves slider to next slide.

*@checked* - [once](#once)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

*@see* - [Slider.prototype.currentIndex](javascript-api.md#sliderprototypecurrentindex)

<!-- End lib/enums/option.js -->

<!-- Start lib/enums/theme.js -->

## Theme Class Names

Themes make slide look god without any other styling. Their purpose is to set default styles
for a slide (typically background and font colors, typography and control elements).

Multiple themes MAY be specified for each slide element ([hermes-layout--slide](class-names.md#hermes-layout--slide)) in client HTML.
During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no theme specified
receives theme classes which were declared on the slider element ([hermes-layout--slider](class-names.md#hermes-layout--slider)).
If there is no theme specified on the slider, default themes are used.

[How to add custom theme?](custom-themes.md)

### Summary

Name | Description | Is Default Theme
--- | --- | ---
[hermes-theme--responsive-arrows](class-names.md#hermes-theme--responsive-arrows) | Adds screen responsiveness to slider arrows. | true
[hermes-theme--white](class-names.md#hermes-theme--white) | White background, dark foreground elements (texts, dots, arrows). | true
[hermes-theme--hover-visible-arrows](class-names.md#hermes-theme--hover-visible-arrows) | Adds hover-dependent visibility change to arrows. | false
[hermes-theme--default-dots](class-names.md#hermes-theme--default-dots) | Shows dot button for each slide. | true
[hermes-theme--black](class-names.md#hermes-theme--black) | Black background, white foreground elements (texts, dots, arrows). | false
[hermes-theme--hover-visible-dots](class-names.md#hermes-theme--hover-visible-dots) | Adds hover-dependent visibility change to dots. | false
[hermes-theme--hover-opaque-dots](class-names.md#hermes-theme--hover-opaque-dots) | Adds hover-dependent opacity change to dots. | true
[hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows) | Shows default side arrow buttons. | true
[hermes-theme--hover-opaque-arrows](class-names.md#hermes-theme--hover-opaque-arrows) | Adds hover-dependent opacity change to arrows. | true
[hermes-theme--default-controls](class-names.md#hermes-theme--default-controls) | Adds [hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows), [hermes-theme--default-dots](class-names.md#hermes-theme--default-dots) classes to the slide. | false
[hermes-theme--hover-visible-controls](class-names.md#hermes-theme--hover-visible-controls) | Adds [hermes-theme--hover-visible-arrows](class-names.md#hermes-theme--hover-visible-arrows), [hermes-theme--hover-visible-dots](class-names.md#hermes-theme--hover-visible-dots) classes to the slide. | false
[hermes-theme--hover-opaque-controls](class-names.md#hermes-theme--hover-opaque-controls) | Adds [hermes-theme--hover-opaque-arrows](class-names.md#hermes-theme--hover-opaque-arrows), [hermes-theme--hover-opaque-dots](class-names.md#hermes-theme--hover-opaque-dots) classes to the slide. | false
[hermes-theme--defaults](class-names.md#hermes-theme--defaults) | Adds [hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows), [hermes-theme--default-dots](class-names.md#hermes-theme--default-dots). [hermes-theme--hover-opaque-arrows](class-names.md#hermes-theme--hover-opaque-arrows), [hermes-theme--hover-opaque-dots](class-names.md#hermes-theme--hover-opaque-dots) classes to the slide. | false

### Details

#### hermes-theme--responsive-arrows

Adds screen responsiveness to slider arrows.

Slider controls come in 3 different layouts. Each for different range of screen width.

1. On wide screens arrows are located on sides out of content area,
2. On mid-sized screens arrows are located on sides above content area,
3. On small screens arrows are smaller and located on the bottom at the same height as dots.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with [hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows).

*@is-default-theme* - true

*@see* - [Screen Responsiveness](responsiveness.md)

*@see* - Slider.breakpointNarrowToNormal

*@see* - Slider.breakpointNormalToWide

#### hermes-theme--white

White background, dark foreground elements (texts, dots, arrows).

*@is-default-theme* - true

#### hermes-theme--hover-visible-arrows

Adds hover-dependent visibility change to arrows.

Arrows become visible when mouse is hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with [hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows) or custom theme that defines arrow visuals.

*@is-default-theme* - false

#### hermes-theme--default-dots

Shows dot button for each slide.

This theme provides basic dot visuals. In case different styling of dots is needed, either
extend this theme class or create your own from scratch. Extending this class may be
prefereable as other themes ([hermes-theme--black](class-names.md#hermes-theme--black), [hermes-theme--white](class-names.md#hermes-theme--white)) are compatible
with this one.

*@is-default-theme* - true

#### hermes-theme--black

Black background, white foreground elements (texts, dots, arrows).

*@is-default-theme* - false

#### hermes-theme--hover-visible-dots

Adds hover-dependent visibility change to dots.

Dots become visible when mouse is hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with [hermes-theme--default-dots](class-names.md#hermes-theme--default-dots) or custom theme that defines dot visuals.

*@is-default-theme* - false

#### hermes-theme--hover-opaque-dots

Adds hover-dependent opacity change to dots.

Dots become more opaque twhen mouseis hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for dots. It must be used in combination
> with [hermes-theme--default-dots](class-names.md#hermes-theme--default-dots) or custom theme that defines dot visuals.

*@is-default-theme* - true

#### hermes-theme--default-arrows

Shows default side arrow buttons.

This theme provides basic arrow visuals. In case different styling of arrows is needed, either
extend this theme class or create your own from scratch. Extending this class may be
prefereable if you also want to use [hermes-theme--responsive-arrows](class-names.md#hermes-theme--responsive-arrows).

*@is-default-theme* - true

#### hermes-theme--hover-opaque-arrows

Adds hover-dependent opacity change to arrows.

Arrows become more opaque twhen mouseis hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with [hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows) or custom theme that defines arrow visuals.

*@is-default-theme* - true

#### hermes-theme--default-controls

Adds
[hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows),
[hermes-theme--default-dots](class-names.md#hermes-theme--default-dots)
classes to the slide.

*@is-default-theme* - false

#### hermes-theme--hover-visible-controls

Adds
[hermes-theme--hover-visible-arrows](class-names.md#hermes-theme--hover-visible-arrows),
[hermes-theme--hover-visible-dots](class-names.md#hermes-theme--hover-visible-dots)
classes to the slide.

*@is-default-theme* - false

#### hermes-theme--hover-opaque-controls

Adds
[hermes-theme--hover-opaque-arrows](class-names.md#hermes-theme--hover-opaque-arrows),
[hermes-theme--hover-opaque-dots](class-names.md#hermes-theme--hover-opaque-dots)
classes to the slide.

*@is-default-theme* - false

#### hermes-theme--defaults

Adds
[hermes-theme--default-arrows](class-names.md#hermes-theme--default-arrows),
[hermes-theme--default-dots](class-names.md#hermes-theme--default-dots).
[hermes-theme--hover-opaque-arrows](class-names.md#hermes-theme--hover-opaque-arrows),
[hermes-theme--hover-opaque-dots](class-names.md#hermes-theme--hover-opaque-dots)
classes to the slide.

*@is-default-theme* - false

<!-- End lib/enums/theme.js -->

<!-- Start lib/enums/transition.js -->

## Transition Class Names

Transitions add nice animations to slide changes. Typically, one transition adds animation
to slide's content ([hermes-layout--content](class-names.md#hermes-layout--content)) or slide's background ([hermes-layout--background](class-names.md#hermes-layout--background)),
or both. Custom transitions may also animate only parts of slide's content (e.g. to display
some parts of the slide with a delay).

Multiple transitions MAY be added on each slide element ([hermes-layout--slide](class-names.md#hermes-layout--slide)) in client HTML.
During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no transitions
specified receives transitions which were declared on the slider element ([hermes-layout--slider](class-names.md#hermes-layout--slider)).
If there is no transition specified on the slider, [hermes-transition--zoom-out-in](class-names.md#hermes-transition--zoom-out-in)
and [hermes-transition--bg-zoom-in-out](class-names.md#hermes-transition--bg-zoom-in-out) are used as default.

### Summary

Name | Description
--- | ---
[hermes-transition--zoom-out-in](class-names.md#hermes-transition--zoom-out-in) | Delicate content zoom out when slide appears, zoom in when it disappears.
[hermes-transition--bg-zoom-in-out](class-names.md#hermes-transition--bg-zoom-in-out) | Delicate background zoom in when slide appears, zoom out when it disappears.

### Details

#### hermes-transition--zoom-out-in

Delicate content zoom out when slide appears, zoom in when it disappears.

#### hermes-transition--bg-zoom-in-out

Delicate background zoom in when slide appears, zoom out when it disappears.

<!-- End lib/enums/transition.js -->

<!-- Start lib/enums/time.js -->

## Time Class Names

Time classes configure [hermes-autoplay](class-names.md#hermes-autoplay) option. They control
time duration of one slide being visible before automatic change to the next.

If no slide time is specified, slide is visible for 5 seconds.

### Summary

Name | Description
--- | ---
[hermes-slide-time-3sec](class-names.md#hermes-slide-time-3sec) | Makes slide visible for 3 seconds before moving to next.
[hermes-slide-time-7sec](class-names.md#hermes-slide-time-7sec) | Makes slide visible for 7 seconds before moving to next.

### Details

#### hermes-slide-time-3sec

Makes slide visible for 3 seconds before moving to next.

*@checked* - [continously](#continously)

*@target* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-slide-time-7sec

Makes slide visible for 7 seconds before moving to next.

*@checked* - [continously](#continously)

*@target* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

<!-- End lib/enums/time.js -->

<!-- Start lib/enums/phase.js -->

## Transition Phase Class Names

All phase classes are automatically set on slider element ([hermes-layout--slider](class-names.md#hermes-layout--slider)).
They MUST NOT be manipulated from client HTML or JavaScript. They **should be used only
in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
[hermes-before-transition](class-names.md#hermes-before-transition) | Set on slider element just before transition starts.
[hermes-during-transition](class-names.md#hermes-during-transition) | Set on slider element while transition of [hermes-layout--content](class-names.md#hermes-layout--content) element is run.
[hermes-after-transition](class-names.md#hermes-after-transition) | Set on slider element after transition of [hermes-layout--content](class-names.md#hermes-layout--content) element ends.

### Details

#### hermes-before-transition

Set on slider element just before transition starts.

This phase lasts for 1 millisecond. It exists just for the purpose of setting CSS properties
to initial values before transition.

#### hermes-during-transition

Set on slider element while transition of [hermes-layout--content](class-names.md#hermes-layout--content) element is run.

#### hermes-after-transition

Set on slider element after transition of [hermes-layout--content](class-names.md#hermes-layout--content) element ends.

<!-- End lib/enums/phase.js -->

<!-- Start lib/enums/marker.js -->

## Transition Marker Class Names

They are automatically set on slide elements ([hermes-layout--slide](class-names.md#hermes-layout--slide)).
Marker class names MUST NOT be manipulated from client HTML or JavaScript
and **SHOULD be used only in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
[hermes-slide-from](class-names.md#hermes-slide-from) | Automatically set on previously active [hermes-layout--slide](class-names.md#hermes-layout--slide).
[hermes-slide-to](class-names.md#hermes-slide-to) | Automatically set on currently active [hermes-layout--slide](class-names.md#hermes-layout--slide).

### Details

#### hermes-slide-from

Automatically set on previously active [hermes-layout--slide](class-names.md#hermes-layout--slide).

*@invariant* - After starting first transition this class name is set on only one slide.

#### hermes-slide-to

Automatically set on currently active [hermes-layout--slide](class-names.md#hermes-layout--slide).

This class name is set on first slide after starting a slider
and then set on currently active slide each time it changes.

*@invariant* - After starting slider this class name is set on only one slide.

<!-- End lib/enums/marker.js -->

<!-- Start lib/enums/layout.js -->

## Layout Class Names

In most cases, most of layout classes **SHOULD not be used in client HTML**, as they are
automatially applied to apropriate elements during [slider's upgrade procedure](dom-upgrade.md)
([hermes-slider](class-names.md#hermes-slider) is the only layout class name that MUST be applied in client HTML).

Layout classes play following roles in slider's inner-workings.
 1. **role-id** - class names are used to identify element's role during slider upgrade,
 2. **transition** - class names must be used in definitions of CSS transitions,
 3. **styling** - class names are recommended for usage in slide's styling.

### Summary

Name | Description | Usage | Client HTML
--- | --- | --- | ---
[hermes-layout--controls](class-names.md#hermes-layout--controls) | Set during upgrade on all generated controls. | styling | forbidden
[hermes-slider](class-names.md#hermes-slider) | Alias for [hermes-layout--slider](class-names.md#hermes-layout--slider). | role-id styling | mandatory
[hermes-layout--slider](class-names.md#hermes-layout--slider) | Identifies main slider element. | role-id styling | mandatory
[hermes-layout--slide](class-names.md#hermes-layout--slide) | Identifies a slide. | role-id styling | optional
[hermes-layout--background](class-names.md#hermes-layout--background) | Identifies background of a slide. | role-id styling transition | optional
[hermes-layout--content](class-names.md#hermes-layout--content) | Identifies content of a slide. | role-id styling transition | optional
[hermes-layout--arrow](class-names.md#hermes-layout--arrow) | Set during upgrade on generated arrow buttons. | styling | forbidden
[hermes-layout--arrow-left](class-names.md#hermes-layout--arrow-left) | Set during upgrade on generated left arrow button. | styling | forbidden
[hermes-layout--arrow-right](class-names.md#hermes-layout--arrow-right) | Set during upgrade on generated right arrow button. | styling | forbidden
[hermes-layout--dots](class-names.md#hermes-layout--dots) | Set during upgrade on container elements that contains dot buttons. | styling | forbidden
[hermes-layout--dot](class-names.md#hermes-layout--dot) | Set during upgrade on each dot button element. | styling | forbidden

### Details

#### hermes-layout--controls

Set during upgrade on all generated controls.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-slider

Alias for [hermes-layout--slider](class-names.md#hermes-layout--slider).

#### hermes-layout--slider

Identifies main slider element.

This class must be set on all slider elements in client HTML.
It can be used in client CSS code for styling.

#### hermes-layout--slide

Identifies a slide.

At least 2 slides must be defined in each slider.
It can be used in client CSS code for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--background

Identifies background of a slide.

For slides in which this element is not present in slider declaration, empty background
element will be generated during slider upgrade. This class name must be used in all
definitions of background transitions.

*@parent-element* - [hermes-layout--slide](class-names.md#hermes-layout--slide)

#### hermes-layout--content

Identifies content of a slide.

For slides in which this element is not present in slider declaration, it will be generated
during slider upgrade. Contents of a slide will be moved inside generated element. If element
is present in slider declaration, it must contain all contents of a slide. This class name
must be used in all definitions of content transitions.

*@parent-element* - [hermes-layout--slide](class-names.md#hermes-layout--slide)

#### hermes-layout--arrow

Set during upgrade on generated arrow buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--arrow-left

Set during upgrade on generated left arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--arrow-right

Set during upgrade on generated right arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--dots

Set during upgrade on container elements that contains dot buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--dot

Set during upgrade on each dot button element.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--dots](class-names.md#hermes-layout--dots)

<!-- End lib/enums/layout.js -->

<!-- Start lib/enums/flag.js -->

## Flag Class Names

They are automatically set by the slider. Flag class names MUST NOT be manipulated from
client HTML or JavaScript and **SHOULD be used only in client CSS**.

### Summary

Name | Description
--- | ---
[is-upgraded](class-names.md#is-upgraded) | Automatically set on slider after its upgrade.
[is-active](class-names.md#is-active) | Automatically set on [hermes-layout--dot](class-names.md#hermes-layout--dot) button connected with currently active slide.

### Details

#### is-upgraded

Automatically set on slider after its upgrade.

#### is-active

Automatically set on [hermes-layout--dot](class-names.md#hermes-layout--dot) button connected with currently active slide.

*@invariant* - This class is set on only one dot button.

<!-- End lib/enums/flag.js -->

<!-- Start lib/enums/pattern.js -->

## Other Class Names

### Summary

Name | Description
--- | ---
[/hermes-transition--([^\s]+)/g](class-names.md#hermes-transition--\sg) | All transitions used by the slider must match this regular expression.
[/hermes-theme--([^\s]+)/g](class-names.md#hermes-theme--\sg) | All themes used by the slider must match this regular expression.
[/hermes-slide-id-([^\s]+)/](class-names.md#hermes-slide-id-\s) | Slider keeps class name with id of current slide on [hermes-layout--slider](class-names.md#hermes-layout--slider) element.

### Details

#### /hermes-transition--([^\s]+)/g

All transitions used by the slider must match this regular expression.

During [slider's DOM upgrade](dom-upgrade.md) [hermes-layout--slider](class-names.md#hermes-layout--slider) element is checked
for presence of transition class names. Transitions declared this way will be randomly used
by the slider. After upgrade all declared transitions are removed from slider element and
added again for the duration of a transition between slides.

Transitions may also be declared on [hermes-layout--slide](class-names.md#hermes-layout--slide) elements. Slider will always
use transition declared on slide element when moving to this slide. Transition declarations of
this type are [checked continuously](#continuously), therefore they may be added/removed
on slides at runtime (client JavaScript).

*@invariant* - Class name of currently running transition is set on slider element.

#### /hermes-theme--([^\s]+)/g

All themes used by the slider must match this regular expression.

During [slider's DOM upgrade](dom-upgrade.md) [hermes-layout--slider](class-names.md#hermes-layout--slider) element is checked for
presence of theme class names. Themes declared this way are then removed from the slider
and added to all slides, which have no theme specified. Themes are added again to slider's
element for the duration of slide being visible.

Themes may also be declared on [hermes-layout--slide](class-names.md#hermes-layout--slide) elements. Theme declarations of
this type are [checked continuously](#continuously), therefore they may be added/removed
on slides at runtime (client JavaScript).

Hermes provides very basic [built-in themes](class-names.md#theme-class-names)
(see [Adding Custom Themes](custom-themes.md)).

*@invariant* - Theme class name's of currently active slide is added to slider element.

#### /hermes-slide-id-([^\s]+)/

Slider keeps class name with id of current slide on [hermes-layout--slider](class-names.md#hermes-layout--slider) element.

This functionality may be useful if slides other than current are to be partially visible
or if appearence of controls or even whole slider needs to change from one slide to another.

*@invariant* - Class name with id of current slide is set on slider element.

<!-- End lib/enums/pattern.js -->

<!-- End Template class-names.md.ejs -->

