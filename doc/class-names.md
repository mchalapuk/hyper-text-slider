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
<li>[ht-autoboot](class-names.md#ht-autoboot)
<li>[ht-slider](class-names.md#ht-slider)
<li>[ht-defaults](class-names.md#ht-defaults)</ul>
2. [Option Class Names](class-names.md#option-class-names)<ul>
<li>[ht-option--defaults](class-names.md#ht-option--defaults)
<li>[ht-option--autoplay](class-names.md#ht-option--autoplay)
<li>[ht-option--arrow-keys](class-names.md#ht-option--arrow-keys)</ul>
3. [Theme Class Names](class-names.md#theme-class-names)<ul>
<li>[ht-theme--responsive-arrows](class-names.md#ht-theme--responsive-arrows)
<li>[ht-theme--white](class-names.md#ht-theme--white)
<li>[ht-theme--hover-visible-arrows](class-names.md#ht-theme--hover-visible-arrows)
<li>[ht-theme--basic-dots](class-names.md#ht-theme--basic-dots)
<li>[ht-theme--black](class-names.md#ht-theme--black)
<li>[ht-theme--hover-visible-dots](class-names.md#ht-theme--hover-visible-dots)
<li>[ht-theme--hover-opaque-dots](class-names.md#ht-theme--hover-opaque-dots)
<li>[ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows)
<li>[ht-theme--hover-opaque-arrows](class-names.md#ht-theme--hover-opaque-arrows)
<li>[ht-theme--basic-controls](class-names.md#ht-theme--basic-controls)
<li>[ht-theme--hover-visible-controls](class-names.md#ht-theme--hover-visible-controls)
<li>[ht-theme--hover-opaque-controls](class-names.md#ht-theme--hover-opaque-controls)
<li>[ht-theme--defaults](class-names.md#ht-theme--defaults)</ul>
4. [Transition Class Names](class-names.md#transition-class-names)<ul>
<li>[ht-transition--zoom-out-in](class-names.md#ht-transition--zoom-out-in)
<li>[ht-transition--bg-zoom-in-out](class-names.md#ht-transition--bg-zoom-in-out)</ul>
5. [Time Class Names](class-names.md#time-class-names)<ul>
<li>[ht-slide-time-3sec](class-names.md#ht-slide-time-3sec)
<li>[ht-slide-time-7sec](class-names.md#ht-slide-time-7sec)</ul>
6. [Transition Phase Class Names](class-names.md#transition-phase-class-names)<ul>
<li>[ht-before-transition](class-names.md#ht-before-transition)
<li>[ht-during-transition](class-names.md#ht-during-transition)
<li>[ht-after-transition](class-names.md#ht-after-transition)</ul>
7. [Transition Marker Class Names](class-names.md#transition-marker-class-names)<ul>
<li>[ht-slide-from](class-names.md#ht-slide-from)
<li>[ht-slide-to](class-names.md#ht-slide-to)</ul>
8. [Layout Class Names](class-names.md#layout-class-names)<ul>
<li>[ht-layout--slider](class-names.md#ht-layout--slider)
<li>[ht-layout--slide](class-names.md#ht-layout--slide)
<li>[ht-layout--background](class-names.md#ht-layout--background)
<li>[ht-layout--content](class-names.md#ht-layout--content)
<li>[ht-layout--controls](class-names.md#ht-layout--controls)
<li>[ht-layout--arrow](class-names.md#ht-layout--arrow)
<li>[ht-layout--arrow-left](class-names.md#ht-layout--arrow-left)
<li>[ht-layout--arrow-right](class-names.md#ht-layout--arrow-right)
<li>[ht-layout--dots](class-names.md#ht-layout--dots)
<li>[ht-layout--dot](class-names.md#ht-layout--dot)</ul>
9. [Flag Class Names](class-names.md#flag-class-names)<ul>
<li>[is-upgraded](class-names.md#is-upgraded)
<li>[is-active](class-names.md#is-active)</ul>
10. [Other Class Names](class-names.md#other-class-names)<ul>
<li>[/ht-transition--([^\s]+)/g](class-names.md#ht-transition--\sg)
<li>[/ht-theme--([^\s]+)/g](class-names.md#ht-theme--\sg)
<li>[/ht-slide-id-([^\s]+)/](class-names.md#ht-slide-id-\s)</ul>

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

Name | Description | Checked | Target Element | Client HTML
--- | --- | --- | --- | ---
[ht-autoboot](class-names.md#ht-autoboot) | Automatically creates [Slider](javascript-api.md#slider) objects for all sliders declared on the page and invokes their [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback) methods. | once | document's `<body>` | mandatory
[ht-slider](class-names.md#ht-slider) | Alias for [ht-layout--slider](class-names.md#ht-layout--slider). | once | [ht-layout--slider](class-names.md#ht-layout--slider) | mandatory
[ht-defaults](class-names.md#ht-defaults) | Adds [ht-option--defaults](class-names.md#ht-option--defaults) and [ht-theme--defaults](class-names.md#ht-theme--defaults) classes to the slider. | once | [ht-layout--slider](class-names.md#ht-layout--slider) | optional

### Details

#### ht-autoboot

Automatically creates [Slider](javascript-api.md#slider) objects for all sliders declared on the page
and invokes their [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback) methods.

This options can be set only on `<body>` element.
It enabled using HyperText Slider without any JavaScript programming.

> ***WARNING***
>
> When using HyperText Slider via node and broserify, this option is ignored.

*@checked* - [once](#once)

*@target* - document's `<body>`

*@see* - [boot(containerElement)](javascript-api.md#bootcontainerelement)

*@see* - [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback)

#### ht-slider

Alias for [ht-layout--slider](class-names.md#ht-layout--slider).

*@checked* - [once](#once)

*@target* - [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-defaults

Adds [ht-option--defaults](class-names.md#ht-option--defaults) and [ht-theme--defaults](class-names.md#ht-theme--defaults) classes to the slider.

*@checked* - [once](#once)

*@target* - [ht-layout--slider](class-names.md#ht-layout--slider)

<!-- End lib/enums/common.js -->

<!-- Start lib/enums/option.js -->

## Option Class Names

Option classes enable features of the slider.

Most options are intended to be set on [ht-layout--slider](class-names.md#ht-layout--slider) element, but they can also be
set on document's `<body>`. Options set on `<body>` are treated as defaults for each [ht-layout--slider](class-names.md#ht-layout--slider) declared on the page.

### Summary

Name | Description | Checked | Target Element
--- | --- | --- | ---
[ht-option--defaults](class-names.md#ht-option--defaults) | Adds [ht-option--autoplay](class-names.md#ht-option--autoplay), [ht-option--arrow-keys](class-names.md#ht-option--arrow-keys) classes to the slider. | once | `<body` or [ht-layout--slider](class-names.md#ht-layout--slider)
[ht-option--autoplay](class-names.md#ht-option--autoplay) | Automatically moves slider to next slide. | continuously | `<body` or [ht-layout--slider](class-names.md#ht-layout--slider)
[ht-option--arrow-keys](class-names.md#ht-option--arrow-keys) | Adds keyboard control to slider. | once | `<body` or [ht-layout--slider](class-names.md#ht-layout--slider)

### Details

#### ht-option--defaults

Adds
[ht-option--autoplay](class-names.md#ht-option--autoplay),
[ht-option--arrow-keys](class-names.md#ht-option--arrow-keys)
classes to the slider.

*@checked* - [once](#once)

*@target* - `<body` or [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-option--autoplay

Automatically moves slider to next slide.

Slider is moved to the next after time specified in [time class name](class-names.md#time-class-names).

*@checked* - [continuously](#continuously)

*@target* - `<body` or [ht-layout--slider](class-names.md#ht-layout--slider)

*@see* - [Slider.prototype.moveToNext()](javascript-api.md#sliderprototypemovetonext)

#### ht-option--arrow-keys

Adds keyboard control to slider.

`keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
slide, with `RightArrow` key moves slider to next slide.

*@checked* - [once](#once)

*@target* - `<body` or [ht-layout--slider](class-names.md#ht-layout--slider)

*@see* - [Slider.prototype.currentIndex](javascript-api.md#sliderprototypecurrentindex)

<!-- End lib/enums/option.js -->

<!-- Start lib/enums/theme.js -->

## Theme Class Names

Themes make slide look god without any other styling. Their purpose is to set default styles
for a slide (typically background and font colors, typography and control elements).

Multiple themes MAY be specified for each slide element ([ht-layout--slide](class-names.md#ht-layout--slide)) in client HTML.
During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no theme specified
receives theme classes which were declared on the slider element ([ht-layout--slider](class-names.md#ht-layout--slider)).
If there is no theme specified on the slider, default themes are used.

[How to add custom theme?](custom-themes.md)

### Summary

Name | Description | Is Default Theme
--- | --- | ---
[ht-theme--responsive-arrows](class-names.md#ht-theme--responsive-arrows) | Adds screen responsiveness to slider arrows. | true
[ht-theme--white](class-names.md#ht-theme--white) | White background, dark foreground elements (texts, dots, arrows). | true
[ht-theme--hover-visible-arrows](class-names.md#ht-theme--hover-visible-arrows) | Adds hover-dependent visibility change to arrows. | false
[ht-theme--basic-dots](class-names.md#ht-theme--basic-dots) | Shows dot button for each slide. | true
[ht-theme--black](class-names.md#ht-theme--black) | Black background, white foreground elements (texts, dots, arrows). | false
[ht-theme--hover-visible-dots](class-names.md#ht-theme--hover-visible-dots) | Adds hover-dependent visibility change to dots. | false
[ht-theme--hover-opaque-dots](class-names.md#ht-theme--hover-opaque-dots) | Adds hover-dependent opacity change to dots. | true
[ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows) | Shows basic side arrow buttons. | true
[ht-theme--hover-opaque-arrows](class-names.md#ht-theme--hover-opaque-arrows) | Adds hover-dependent opacity change to arrows. | true
[ht-theme--basic-controls](class-names.md#ht-theme--basic-controls) | Adds [ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows), [ht-theme--basic-dots](class-names.md#ht-theme--basic-dots) classes to the slide. | false
[ht-theme--hover-visible-controls](class-names.md#ht-theme--hover-visible-controls) | Adds [ht-theme--hover-visible-arrows](class-names.md#ht-theme--hover-visible-arrows), [ht-theme--hover-visible-dots](class-names.md#ht-theme--hover-visible-dots) classes to the slide. | false
[ht-theme--hover-opaque-controls](class-names.md#ht-theme--hover-opaque-controls) | Adds [ht-theme--hover-opaque-arrows](class-names.md#ht-theme--hover-opaque-arrows), [ht-theme--hover-opaque-dots](class-names.md#ht-theme--hover-opaque-dots) classes to the slide. | false
[ht-theme--defaults](class-names.md#ht-theme--defaults) | Adds [ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows), [ht-theme--basic-dots](class-names.md#ht-theme--basic-dots). [ht-theme--hover-opaque-arrows](class-names.md#ht-theme--hover-opaque-arrows), [ht-theme--hover-opaque-dots](class-names.md#ht-theme--hover-opaque-dots) [ht-theme--responsive-arrows](class-names.md#ht-theme--responsive-arrows), [ht-theme--white](class-names.md#ht-theme--white) classes to the slide. | false

### Details

#### ht-theme--responsive-arrows

Adds screen responsiveness to slider arrows.

Slider controls come in 3 different layouts. Each for different range of screen width.

1. On wide screens arrows are located on sides out of content area,
2. On mid-sized screens arrows are located on sides above content area,
3. On small screens arrows are smaller and located on the bottom at the same height as dots.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with [ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows).

*@is-default-theme* - true

*@see* - [Screen Responsiveness](responsiveness.md)

*@see* - Slider.breakpointNarrowToNormal

*@see* - Slider.breakpointNormalToWide

#### ht-theme--white

White background, dark foreground elements (texts, dots, arrows).

*@is-default-theme* - true

#### ht-theme--hover-visible-arrows

Adds hover-dependent visibility change to arrows.

Arrows become visible when mouse is hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with [ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows) or custom theme that defines arrow visuals.

*@is-default-theme* - false

#### ht-theme--basic-dots

Shows dot button for each slide.

This theme provides basic dot visuals. In case different styling of dots is needed, either
extend this theme class or create your own from scratch. Extending this class may be
prefereable as other themes ([ht-theme--black](class-names.md#ht-theme--black), [ht-theme--white](class-names.md#ht-theme--white)) are compatible
with this one.

*@is-default-theme* - true

#### ht-theme--black

Black background, white foreground elements (texts, dots, arrows).

*@is-default-theme* - false

#### ht-theme--hover-visible-dots

Adds hover-dependent visibility change to dots.

Dots become visible when mouse is hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with [ht-theme--basic-dots](class-names.md#ht-theme--basic-dots) or custom theme that defines dot visuals.

*@is-default-theme* - false

#### ht-theme--hover-opaque-dots

Adds hover-dependent opacity change to dots.

Dots become more opaque twhen mouseis hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for dots. It must be used in combination
> with [ht-theme--basic-dots](class-names.md#ht-theme--basic-dots) or custom theme that defines dot visuals.

*@is-default-theme* - true

#### ht-theme--basic-arrows

Shows basic side arrow buttons.

This theme provides basic arrow visuals. In case different styling of arrows is needed, either
extend this theme class or create your own from scratch. Extending this class may be
prefereable if you also want to use [ht-theme--responsive-arrows](class-names.md#ht-theme--responsive-arrows).

*@is-default-theme* - true

#### ht-theme--hover-opaque-arrows

Adds hover-dependent opacity change to arrows.

Arrows become more opaque twhen mouseis hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with [ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows) or custom theme that defines arrow visuals.

*@is-default-theme* - true

#### ht-theme--basic-controls

Adds
[ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows),
[ht-theme--basic-dots](class-names.md#ht-theme--basic-dots)
classes to the slide.

*@is-default-theme* - false

#### ht-theme--hover-visible-controls

Adds
[ht-theme--hover-visible-arrows](class-names.md#ht-theme--hover-visible-arrows),
[ht-theme--hover-visible-dots](class-names.md#ht-theme--hover-visible-dots)
classes to the slide.

*@is-default-theme* - false

#### ht-theme--hover-opaque-controls

Adds
[ht-theme--hover-opaque-arrows](class-names.md#ht-theme--hover-opaque-arrows),
[ht-theme--hover-opaque-dots](class-names.md#ht-theme--hover-opaque-dots)
classes to the slide.

*@is-default-theme* - false

#### ht-theme--defaults

Adds
[ht-theme--basic-arrows](class-names.md#ht-theme--basic-arrows),
[ht-theme--basic-dots](class-names.md#ht-theme--basic-dots).
[ht-theme--hover-opaque-arrows](class-names.md#ht-theme--hover-opaque-arrows),
[ht-theme--hover-opaque-dots](class-names.md#ht-theme--hover-opaque-dots)
[ht-theme--responsive-arrows](class-names.md#ht-theme--responsive-arrows),
[ht-theme--white](class-names.md#ht-theme--white)
classes to the slide.

*@is-default-theme* - false

<!-- End lib/enums/theme.js -->

<!-- Start lib/enums/transition.js -->

## Transition Class Names

Transitions add nice animations to slide changes. Typically, one transition adds animation
to slide's content ([ht-layout--content](class-names.md#ht-layout--content)) or slide's background ([ht-layout--background](class-names.md#ht-layout--background)),
or both. Custom transitions may also animate only parts of slide's content (e.g. to display
some parts of the slide with a delay).

Multiple transitions MAY be added on each slide element ([ht-layout--slide](class-names.md#ht-layout--slide)) in client HTML.
During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no transitions
specified receives transitions which were declared on the slider element ([ht-layout--slider](class-names.md#ht-layout--slider)).
If there is no transition specified on the slider, [ht-transition--zoom-out-in](class-names.md#ht-transition--zoom-out-in)
and [ht-transition--bg-zoom-in-out](class-names.md#ht-transition--bg-zoom-in-out) are used as default.

### Summary

Name | Description
--- | ---
[ht-transition--zoom-out-in](class-names.md#ht-transition--zoom-out-in) | Delicate content zoom out when slide appears, zoom in when it disappears.
[ht-transition--bg-zoom-in-out](class-names.md#ht-transition--bg-zoom-in-out) | Delicate background zoom in when slide appears, zoom out when it disappears.

### Details

#### ht-transition--zoom-out-in

Delicate content zoom out when slide appears, zoom in when it disappears.

#### ht-transition--bg-zoom-in-out

Delicate background zoom in when slide appears, zoom out when it disappears.

<!-- End lib/enums/transition.js -->

<!-- Start lib/enums/time.js -->

## Time Class Names

Time classes configure [ht-option--autoplay](class-names.md#ht-option--autoplay) option. They control
time duration of one slide being visible before automatic change to the next.

If no slide time is specified, slide is visible for 5 seconds.

### Summary

Name | Description
--- | ---
[ht-slide-time-3sec](class-names.md#ht-slide-time-3sec) | Makes slide visible for 3 seconds before moving to next.
[ht-slide-time-7sec](class-names.md#ht-slide-time-7sec) | Makes slide visible for 7 seconds before moving to next.

### Details

#### ht-slide-time-3sec

Makes slide visible for 3 seconds before moving to next.

*@checked* - [continously](#continously)

*@target* - [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-slide-time-7sec

Makes slide visible for 7 seconds before moving to next.

*@checked* - [continously](#continously)

*@target* - [ht-layout--slider](class-names.md#ht-layout--slider)

<!-- End lib/enums/time.js -->

<!-- Start lib/enums/phase.js -->

## Transition Phase Class Names

All phase classes are automatically set on slider element ([ht-layout--slider](class-names.md#ht-layout--slider)).
They MUST NOT be manipulated from client HTML or JavaScript. They **should be used only
in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
[ht-before-transition](class-names.md#ht-before-transition) | Set on slider element just before transition starts.
[ht-during-transition](class-names.md#ht-during-transition) | Set on slider element while transition of [ht-layout--content](class-names.md#ht-layout--content) element is run.
[ht-after-transition](class-names.md#ht-after-transition) | Set on slider element after transition of [ht-layout--content](class-names.md#ht-layout--content) element ends.

### Details

#### ht-before-transition

Set on slider element just before transition starts.

This phase lasts for 1 millisecond. It exists just for the purpose of setting CSS properties
to initial values before transition.

#### ht-during-transition

Set on slider element while transition of [ht-layout--content](class-names.md#ht-layout--content) element is run.

#### ht-after-transition

Set on slider element after transition of [ht-layout--content](class-names.md#ht-layout--content) element ends.

<!-- End lib/enums/phase.js -->

<!-- Start lib/enums/marker.js -->

## Transition Marker Class Names

They are automatically set on slide elements ([ht-layout--slide](class-names.md#ht-layout--slide)).
Marker class names MUST NOT be manipulated from client HTML or JavaScript
and **SHOULD be used only in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
[ht-slide-from](class-names.md#ht-slide-from) | Automatically set on previously active [ht-layout--slide](class-names.md#ht-layout--slide).
[ht-slide-to](class-names.md#ht-slide-to) | Automatically set on currently active [ht-layout--slide](class-names.md#ht-layout--slide).

### Details

#### ht-slide-from

Automatically set on previously active [ht-layout--slide](class-names.md#ht-layout--slide).

*@invariant* - After starting first transition this class name is set on only one slide.

#### ht-slide-to

Automatically set on currently active [ht-layout--slide](class-names.md#ht-layout--slide).

This class name is set on first slide after starting a slider
and then set on currently active slide each time it changes.

*@invariant* - After starting slider this class name is set on only one slide.

<!-- End lib/enums/marker.js -->

<!-- Start lib/enums/layout.js -->

## Layout Class Names

In most cases, most of layout classes **SHOULD not be used in client HTML**, as they are
automatially applied to apropriate elements during [slider's upgrade procedure](dom-upgrade.md)
([ht-slider](class-names.md#ht-slider) is the only layout class name that MUST be applied in client HTML).

Layout classes play following roles in slider's inner-workings.
 1. **role-id** - class names are used to identify element's role during slider upgrade,
 2. **transition** - class names must be used in definitions of CSS transitions,
 3. **styling** - class names are recommended for usage in slide's styling.

### Summary

Name | Description | Usage | Client HTML
--- | --- | --- | ---
[ht-layout--slider](class-names.md#ht-layout--slider) | Identifies main slider element. | role-id styling | mandatory
[ht-layout--slide](class-names.md#ht-layout--slide) | Identifies a slide. | role-id styling | optional
[ht-layout--background](class-names.md#ht-layout--background) | Identifies background of a slide. | role-id styling transition | optional
[ht-layout--content](class-names.md#ht-layout--content) | Identifies content of a slide. | role-id styling transition | optional
[ht-layout--controls](class-names.md#ht-layout--controls) | Set during upgrade on all generated controls. | styling | forbidden
[ht-layout--arrow](class-names.md#ht-layout--arrow) | Set during upgrade on generated arrow buttons. | styling | forbidden
[ht-layout--arrow-left](class-names.md#ht-layout--arrow-left) | Set during upgrade on generated left arrow button. | styling | forbidden
[ht-layout--arrow-right](class-names.md#ht-layout--arrow-right) | Set during upgrade on generated right arrow button. | styling | forbidden
[ht-layout--dots](class-names.md#ht-layout--dots) | Set during upgrade on container elements that contains dot buttons. | styling | forbidden
[ht-layout--dot](class-names.md#ht-layout--dot) | Set during upgrade on each dot button element. | styling | forbidden

### Details

#### ht-layout--slider

Identifies main slider element.

This class must be set on all slider elements in client HTML.
It can be used in client CSS code for styling.

#### ht-layout--slide

Identifies a slide.

At least 2 slides must be defined in each slider.
It can be used in client CSS code for styling.

*@parent-element* - [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-layout--background

Identifies background of a slide.

For slides in which this element is not present in slider declaration, empty background
element will be generated during slider upgrade. This class name must be used in all
definitions of background transitions.

*@parent-element* - [ht-layout--slide](class-names.md#ht-layout--slide)

#### ht-layout--content

Identifies content of a slide.

For slides in which this element is not present in slider declaration, it will be generated
during slider upgrade. Contents of a slide will be moved inside generated element. If element
is present in slider declaration, it must contain all contents of a slide. This class name
must be used in all definitions of content transitions.

*@parent-element* - [ht-layout--slide](class-names.md#ht-layout--slide)

#### ht-layout--controls

Set during upgrade on all generated controls.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-layout--arrow

Set during upgrade on generated arrow buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-layout--arrow-left

Set during upgrade on generated left arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-layout--arrow-right

Set during upgrade on generated right arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-layout--dots

Set during upgrade on container elements that contains dot buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [ht-layout--slider](class-names.md#ht-layout--slider)

#### ht-layout--dot

Set during upgrade on each dot button element.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [ht-layout--dots](class-names.md#ht-layout--dots)

<!-- End lib/enums/layout.js -->

<!-- Start lib/enums/flag.js -->

## Flag Class Names

They are automatically set by the slider. Flag class names MUST NOT be manipulated from
client HTML or JavaScript and **SHOULD be used only in client CSS**.

### Summary

Name | Description
--- | ---
[is-upgraded](class-names.md#is-upgraded) | Automatically set on slider after its upgrade.
[is-active](class-names.md#is-active) | Automatically set on [ht-layout--dot](class-names.md#ht-layout--dot) button connected with currently active slide.

### Details

#### is-upgraded

Automatically set on slider after its upgrade.

#### is-active

Automatically set on [ht-layout--dot](class-names.md#ht-layout--dot) button connected with currently active slide.

*@invariant* - This class is set on only one dot button.

<!-- End lib/enums/flag.js -->

<!-- Start lib/enums/pattern.js -->

## Other Class Names

### Summary

Name | Description
--- | ---
[/ht-transition--([^\s]+)/g](class-names.md#ht-transition--\sg) | All transitions used by the slider must match this regular expression.
[/ht-theme--([^\s]+)/g](class-names.md#ht-theme--\sg) | All themes used by the slider must match this regular expression.
[/ht-slide-id-([^\s]+)/](class-names.md#ht-slide-id-\s) | Slider keeps class name with id of current slide on [ht-layout--slider](class-names.md#ht-layout--slider) element.

### Details

#### /ht-transition--([^\s]+)/g

All transitions used by the slider must match this regular expression.

During [slider's DOM upgrade](dom-upgrade.md) [ht-layout--slider](class-names.md#ht-layout--slider) element is checked
for presence of transition class names. Transitions declared this way will be randomly used
by the slider. After upgrade all declared transitions are removed from slider element and
added again for the duration of a transition between slides.

Transitions may also be declared on [ht-layout--slide](class-names.md#ht-layout--slide) elements. Slider will always
use transition declared on slide element when moving to this slide. Transition declarations of
this type are [checked continuously](#continuously), therefore they may be added/removed
on slides at runtime (client JavaScript).

*@invariant* - Class name of currently running transition is set on slider element.

#### /ht-theme--([^\s]+)/g

All themes used by the slider must match this regular expression.

During [slider's DOM upgrade](dom-upgrade.md) [ht-layout--slider](class-names.md#ht-layout--slider) element is checked for
presence of theme class names. Themes declared this way are then removed from the slider
and added to all slides, which have no theme specified. Themes are added again to slider's
element for the duration of slide being visible.

Themes may also be declared on [ht-layout--slide](class-names.md#ht-layout--slide) elements. Theme declarations of
this type are [checked continuously](#continuously), therefore they may be added/removed
on slides at runtime (client JavaScript).

HyperText Slider provides very basic [built-in themes](class-names.md#theme-class-names)
(see [Adding Custom Themes](custom-themes.md)).

*@invariant* - Theme class name's of currently active slide is added to slider element.

#### /ht-slide-id-([^\s]+)/

Slider keeps class name with id of current slide on [ht-layout--slider](class-names.md#ht-layout--slider) element.

This functionality may be useful if slides other than current are to be partially visible
or if appearence of controls or even whole slider needs to change from one slide to another.

*@invariant* - Class name with id of current slide is set on slider element.

<!-- End lib/enums/pattern.js -->

<!-- End Template class-names.md.ejs -->

