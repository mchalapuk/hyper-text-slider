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

<ol>

<li><a href="class-names.md#common-class-names">Common Class Names</a><ul>
<li><a href="class-names.md#ht-autoboot">ht-autoboot</a>
<li><a href="class-names.md#ht-slider">ht-slider</a>
<li><a href="class-names.md#ht-defaults">ht-defaults</a></ul></li>
<li><a href="class-names.md#option-class-names">Option Class Names</a><ul>
<li><a href="class-names.md#ht-option--defaults">ht-option--defaults</a>
<li><a href="class-names.md#ht-option--autoplay">ht-option--autoplay</a>
<li><a href="class-names.md#ht-option--arrow-keys">ht-option--arrow-keys</a></ul></li>
<li><a href="class-names.md#theme-class-names">Theme Class Names</a><ul>
<li><a href="class-names.md#ht-theme--responsive-arrows">ht-theme--responsive-arrows</a>
<li><a href="class-names.md#ht-theme--white">ht-theme--white</a>
<li><a href="class-names.md#ht-theme--hover-visible-arrows">ht-theme--hover-visible-arrows</a>
<li><a href="class-names.md#ht-theme--basic-dots">ht-theme--basic-dots</a>
<li><a href="class-names.md#ht-theme--black">ht-theme--black</a>
<li><a href="class-names.md#ht-theme--hover-visible-dots">ht-theme--hover-visible-dots</a>
<li><a href="class-names.md#ht-theme--hover-opaque-dots">ht-theme--hover-opaque-dots</a>
<li><a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a>
<li><a href="class-names.md#ht-theme--hover-opaque-arrows">ht-theme--hover-opaque-arrows</a>
<li><a href="class-names.md#ht-theme--basic-controls">ht-theme--basic-controls</a>
<li><a href="class-names.md#ht-theme--hover-visible-controls">ht-theme--hover-visible-controls</a>
<li><a href="class-names.md#ht-theme--hover-opaque-controls">ht-theme--hover-opaque-controls</a>
<li><a href="class-names.md#ht-theme--defaults">ht-theme--defaults</a></ul></li>
<li><a href="class-names.md#transition-class-names">Transition Class Names</a><ul>
<li><a href="class-names.md#ht-transition--zoom-out-in">ht-transition--zoom-out-in</a>
<li><a href="class-names.md#ht-transition--bg-zoom-in-out">ht-transition--bg-zoom-in-out</a></ul></li>
<li><a href="class-names.md#time-class-names">Time Class Names</a><ul>
<li><a href="class-names.md#ht-slide-time-3sec">ht-slide-time-3sec</a>
<li><a href="class-names.md#ht-slide-time-7sec">ht-slide-time-7sec</a></ul></li>
<li><a href="class-names.md#transition-phase-class-names">Transition Phase Class Names</a><ul>
<li><a href="class-names.md#ht-before-transition">ht-before-transition</a>
<li><a href="class-names.md#ht-during-transition">ht-during-transition</a>
<li><a href="class-names.md#ht-after-transition">ht-after-transition</a></ul></li>
<li><a href="class-names.md#transition-marker-class-names">Transition Marker Class Names</a><ul>
<li><a href="class-names.md#ht-slide-from">ht-slide-from</a>
<li><a href="class-names.md#ht-slide-to">ht-slide-to</a></ul></li>
<li><a href="class-names.md#layout-class-names">Layout Class Names</a><ul>
<li><a href="class-names.md#ht-layout--slider">ht-layout--slider</a>
<li><a href="class-names.md#ht-layout--slide">ht-layout--slide</a>
<li><a href="class-names.md#ht-layout--background">ht-layout--background</a>
<li><a href="class-names.md#ht-layout--content">ht-layout--content</a>
<li><a href="class-names.md#ht-layout--controls">ht-layout--controls</a>
<li><a href="class-names.md#ht-layout--arrow">ht-layout--arrow</a>
<li><a href="class-names.md#ht-layout--arrow-left">ht-layout--arrow-left</a>
<li><a href="class-names.md#ht-layout--arrow-right">ht-layout--arrow-right</a>
<li><a href="class-names.md#ht-layout--dots">ht-layout--dots</a>
<li><a href="class-names.md#ht-layout--dot">ht-layout--dot</a></ul></li>
<li><a href="class-names.md#flag-class-names">Flag Class Names</a><ul>
<li><a href="class-names.md#is-upgraded">is-upgraded</a>
<li><a href="class-names.md#is-active">is-active</a></ul></li>
<li><a href="class-names.md#other-class-names">Other Class Names</a><ul>
<li><a href="class-names.md#ht-transition--\sg">/ht-transition--([^\s]+)/g</a>
<li><a href="class-names.md#ht-theme--\sg">/ht-theme--([^\s]+)/g</a>
<li><a href="class-names.md#ht-slide-id-\s">/ht-slide-id-([^\s]+)/</a></ul></li>
</ol>

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
<a href="class-names.md#ht-autoboot">ht-autoboot</a> | Automatically creates <a href="javascript-api.md#slider">Slider</a> objects for all sliders declared on the page and invokes their <a href="javascript-api.md#sliderprototypestartcallback">Slider.prototype.start(callback)</a> methods. | once | document's `<body>` | mandatory
<a href="class-names.md#ht-slider">ht-slider</a> | Alias for <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>. | once | <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> | mandatory
<a href="class-names.md#ht-defaults">ht-defaults</a> | Adds <a href="class-names.md#ht-option--defaults">ht-option--defaults</a> and <a href="class-names.md#ht-theme--defaults">ht-theme--defaults</a> classes to the slider. | once | <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> | optional

### Details

#### ht-autoboot

Automatically creates <a href="javascript-api.md#slider">Slider</a> objects for all sliders declared on the page
and invokes their <a href="javascript-api.md#sliderprototypestartcallback">Slider.prototype.start(callback)</a> methods.

This options can be set only on `<body>` element.
It enabled using HyperText Slider without any JavaScript programming.

> ***WARNING***
>
> When using HyperText Slider via node and broserify, this option is ignored.

*@checked* - [once](#once)

*@target* - document's `<body>`

*@see* - <a href="javascript-api.md#bootcontainerelement">boot(containerElement)</a>

*@see* - <a href="javascript-api.md#sliderprototypestartcallback">Slider.prototype.start(callback)</a>

#### ht-slider

Alias for <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>.

*@checked* - [once](#once)

*@target* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-defaults

Adds <a href="class-names.md#ht-option--defaults">ht-option--defaults</a> and <a href="class-names.md#ht-theme--defaults">ht-theme--defaults</a> classes to the slider.

*@checked* - [once](#once)

*@target* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

<!-- End lib/enums/common.js -->

<!-- Start lib/enums/option.js -->

## Option Class Names

Option classes enable features of the slider.

Most options are intended to be set on <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> element, but they can also be
set on document's `<body>`. Options set on `<body>` are treated as defaults for each <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> declared on the page.

### Summary

Name | Description | Checked | Target Element
--- | --- | --- | ---
<a href="class-names.md#ht-option--defaults">ht-option--defaults</a> | Adds <a href="class-names.md#ht-option--autoplay">ht-option--autoplay</a>, <a href="class-names.md#ht-option--arrow-keys">ht-option--arrow-keys</a> classes to the slider. | once | `<body` or <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>
<a href="class-names.md#ht-option--autoplay">ht-option--autoplay</a> | Automatically moves slider to next slide. | continuously | `<body` or <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>
<a href="class-names.md#ht-option--arrow-keys">ht-option--arrow-keys</a> | Adds keyboard control to slider. | once | `<body` or <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

### Details

#### ht-option--defaults

Adds
<a href="class-names.md#ht-option--autoplay">ht-option--autoplay</a>,
<a href="class-names.md#ht-option--arrow-keys">ht-option--arrow-keys</a>
classes to the slider.

*@checked* - [once](#once)

*@target* - `<body` or <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-option--autoplay

Automatically moves slider to next slide.

Slider is moved to the next after time specified in [time class name](class-names.md#time-class-names).

*@checked* - [continuously](#continuously)

*@target* - `<body` or <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

*@see* - <a href="javascript-api.md#sliderprototypemovetonext">Slider.prototype.moveToNext()</a>

#### ht-option--arrow-keys

Adds keyboard control to slider.

`keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
slide, with `RightArrow` key moves slider to next slide.

*@checked* - [once](#once)

*@target* - `<body` or <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

*@see* - <a href="javascript-api.md#sliderprototypecurrentindex">Slider.prototype.currentIndex</a>

<!-- End lib/enums/option.js -->

<!-- Start lib/enums/theme.js -->

## Theme Class Names

Themes make slide look god without any other styling. Their purpose is to set default styles
for a slide (typically background and font colors, typography and control elements).

Multiple themes MAY be specified for each slide element (<a href="class-names.md#ht-layout--slide">ht-layout--slide</a>) in client HTML.
During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no theme specified
receives theme classes which were declared on the slider element (<a href="class-names.md#ht-layout--slider">ht-layout--slider</a>).
If there is no theme specified on the slider, default themes are used.

[How to add custom theme?](custom-themes.md)

### Summary

Name | Description | Is Default Theme
--- | --- | ---
<a href="class-names.md#ht-theme--responsive-arrows">ht-theme--responsive-arrows</a> | Adds screen responsiveness to slider arrows. | true
<a href="class-names.md#ht-theme--white">ht-theme--white</a> | White background, dark foreground elements (texts, dots, arrows). | true
<a href="class-names.md#ht-theme--hover-visible-arrows">ht-theme--hover-visible-arrows</a> | Adds hover-dependent visibility change to arrows. | false
<a href="class-names.md#ht-theme--basic-dots">ht-theme--basic-dots</a> | Shows dot button for each slide. | true
<a href="class-names.md#ht-theme--black">ht-theme--black</a> | Black background, white foreground elements (texts, dots, arrows). | false
<a href="class-names.md#ht-theme--hover-visible-dots">ht-theme--hover-visible-dots</a> | Adds hover-dependent visibility change to dots. | false
<a href="class-names.md#ht-theme--hover-opaque-dots">ht-theme--hover-opaque-dots</a> | Adds hover-dependent opacity change to dots. | true
<a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a> | Shows basic side arrow buttons. | true
<a href="class-names.md#ht-theme--hover-opaque-arrows">ht-theme--hover-opaque-arrows</a> | Adds hover-dependent opacity change to arrows. | true
<a href="class-names.md#ht-theme--basic-controls">ht-theme--basic-controls</a> | Adds <a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a>, <a href="class-names.md#ht-theme--basic-dots">ht-theme--basic-dots</a> classes to the slide. | false
<a href="class-names.md#ht-theme--hover-visible-controls">ht-theme--hover-visible-controls</a> | Adds <a href="class-names.md#ht-theme--hover-visible-arrows">ht-theme--hover-visible-arrows</a>, <a href="class-names.md#ht-theme--hover-visible-dots">ht-theme--hover-visible-dots</a> classes to the slide. | false
<a href="class-names.md#ht-theme--hover-opaque-controls">ht-theme--hover-opaque-controls</a> | Adds <a href="class-names.md#ht-theme--hover-opaque-arrows">ht-theme--hover-opaque-arrows</a>, <a href="class-names.md#ht-theme--hover-opaque-dots">ht-theme--hover-opaque-dots</a> classes to the slide. | false
<a href="class-names.md#ht-theme--defaults">ht-theme--defaults</a> | Adds <a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a>, <a href="class-names.md#ht-theme--basic-dots">ht-theme--basic-dots</a>. <a href="class-names.md#ht-theme--hover-opaque-arrows">ht-theme--hover-opaque-arrows</a>, <a href="class-names.md#ht-theme--hover-opaque-dots">ht-theme--hover-opaque-dots</a> <a href="class-names.md#ht-theme--responsive-arrows">ht-theme--responsive-arrows</a>, <a href="class-names.md#ht-theme--white">ht-theme--white</a> classes to the slide. | false

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
> with <a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a>.

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
> with <a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a> or custom theme that defines arrow visuals.

*@is-default-theme* - false

#### ht-theme--basic-dots

Shows dot button for each slide.

This theme provides basic dot visuals. In case different styling of dots is needed, either
extend this theme class or create your own from scratch. Extending this class may be
prefereable as other themes (<a href="class-names.md#ht-theme--black">ht-theme--black</a>, <a href="class-names.md#ht-theme--white">ht-theme--white</a>) are compatible
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
> with <a href="class-names.md#ht-theme--basic-dots">ht-theme--basic-dots</a> or custom theme that defines dot visuals.

*@is-default-theme* - false

#### ht-theme--hover-opaque-dots

Adds hover-dependent opacity change to dots.

Dots become more opaque twhen mouseis hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for dots. It must be used in combination
> with <a href="class-names.md#ht-theme--basic-dots">ht-theme--basic-dots</a> or custom theme that defines dot visuals.

*@is-default-theme* - true

#### ht-theme--basic-arrows

Shows basic side arrow buttons.

This theme provides basic arrow visuals. In case different styling of arrows is needed, either
extend this theme class or create your own from scratch. Extending this class may be
prefereable if you also want to use <a href="class-names.md#ht-theme--responsive-arrows">ht-theme--responsive-arrows</a>.

*@is-default-theme* - true

#### ht-theme--hover-opaque-arrows

Adds hover-dependent opacity change to arrows.

Arrows become more opaque twhen mouseis hovering above the slider.

> **NOTE**
>
> This class does not provide visual styles for arrows. It must be used in combination
> with <a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a> or custom theme that defines arrow visuals.

*@is-default-theme* - true

#### ht-theme--basic-controls

Adds
<a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a>,
<a href="class-names.md#ht-theme--basic-dots">ht-theme--basic-dots</a>
classes to the slide.

*@is-default-theme* - false

#### ht-theme--hover-visible-controls

Adds
<a href="class-names.md#ht-theme--hover-visible-arrows">ht-theme--hover-visible-arrows</a>,
<a href="class-names.md#ht-theme--hover-visible-dots">ht-theme--hover-visible-dots</a>
classes to the slide.

*@is-default-theme* - false

#### ht-theme--hover-opaque-controls

Adds
<a href="class-names.md#ht-theme--hover-opaque-arrows">ht-theme--hover-opaque-arrows</a>,
<a href="class-names.md#ht-theme--hover-opaque-dots">ht-theme--hover-opaque-dots</a>
classes to the slide.

*@is-default-theme* - false

#### ht-theme--defaults

Adds
<a href="class-names.md#ht-theme--basic-arrows">ht-theme--basic-arrows</a>,
<a href="class-names.md#ht-theme--basic-dots">ht-theme--basic-dots</a>.
<a href="class-names.md#ht-theme--hover-opaque-arrows">ht-theme--hover-opaque-arrows</a>,
<a href="class-names.md#ht-theme--hover-opaque-dots">ht-theme--hover-opaque-dots</a>
<a href="class-names.md#ht-theme--responsive-arrows">ht-theme--responsive-arrows</a>,
<a href="class-names.md#ht-theme--white">ht-theme--white</a>
classes to the slide.

*@is-default-theme* - false

<!-- End lib/enums/theme.js -->

<!-- Start lib/enums/transition.js -->

## Transition Class Names

Transitions add nice animations to slide changes. Typically, one transition adds animation
to slide's content (<a href="class-names.md#ht-layout--content">ht-layout--content</a>) or slide's background (<a href="class-names.md#ht-layout--background">ht-layout--background</a>),
or both. Custom transitions may also animate only parts of slide's content (e.g. to display
some parts of the slide with a delay).

Multiple transitions MAY be added on each slide element (<a href="class-names.md#ht-layout--slide">ht-layout--slide</a>) in client HTML.
During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no transitions
specified receives transitions which were declared on the slider element (<a href="class-names.md#ht-layout--slider">ht-layout--slider</a>).
If there is no transition specified on the slider, <a href="class-names.md#ht-transition--zoom-out-in">ht-transition--zoom-out-in</a>
and <a href="class-names.md#ht-transition--bg-zoom-in-out">ht-transition--bg-zoom-in-out</a> are used as default.

### Summary

Name | Description
--- | ---
<a href="class-names.md#ht-transition--zoom-out-in">ht-transition--zoom-out-in</a> | Delicate content zoom out when slide appears, zoom in when it disappears.
<a href="class-names.md#ht-transition--bg-zoom-in-out">ht-transition--bg-zoom-in-out</a> | Delicate background zoom in when slide appears, zoom out when it disappears.

### Details

#### ht-transition--zoom-out-in

Delicate content zoom out when slide appears, zoom in when it disappears.

#### ht-transition--bg-zoom-in-out

Delicate background zoom in when slide appears, zoom out when it disappears.

<!-- End lib/enums/transition.js -->

<!-- Start lib/enums/time.js -->

## Time Class Names

Time classes configure <a href="class-names.md#ht-option--autoplay">ht-option--autoplay</a> option. They control
time duration of one slide being visible before automatic change to the next.

If no slide time is specified, slide is visible for 5 seconds.

### Summary

Name | Description
--- | ---
<a href="class-names.md#ht-slide-time-3sec">ht-slide-time-3sec</a> | Makes slide visible for 3 seconds before moving to next.
<a href="class-names.md#ht-slide-time-7sec">ht-slide-time-7sec</a> | Makes slide visible for 7 seconds before moving to next.

### Details

#### ht-slide-time-3sec

Makes slide visible for 3 seconds before moving to next.

*@checked* - [continously](#continously)

*@target* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-slide-time-7sec

Makes slide visible for 7 seconds before moving to next.

*@checked* - [continously](#continously)

*@target* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

<!-- End lib/enums/time.js -->

<!-- Start lib/enums/phase.js -->

## Transition Phase Class Names

All phase classes are automatically set on slider element (<a href="class-names.md#ht-layout--slider">ht-layout--slider</a>).
They MUST NOT be manipulated from client HTML or JavaScript. They **should be used only
in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
<a href="class-names.md#ht-before-transition">ht-before-transition</a> | Set on slider element just before transition starts.
<a href="class-names.md#ht-during-transition">ht-during-transition</a> | Set on slider element while transition of <a href="class-names.md#ht-layout--content">ht-layout--content</a> element is run.
<a href="class-names.md#ht-after-transition">ht-after-transition</a> | Set on slider element after transition of <a href="class-names.md#ht-layout--content">ht-layout--content</a> element ends.

### Details

#### ht-before-transition

Set on slider element just before transition starts.

This phase lasts for 1 millisecond. It exists just for the purpose of setting CSS properties
to initial values before transition.

#### ht-during-transition

Set on slider element while transition of <a href="class-names.md#ht-layout--content">ht-layout--content</a> element is run.

#### ht-after-transition

Set on slider element after transition of <a href="class-names.md#ht-layout--content">ht-layout--content</a> element ends.

<!-- End lib/enums/phase.js -->

<!-- Start lib/enums/marker.js -->

## Transition Marker Class Names

They are automatically set on slide elements (<a href="class-names.md#ht-layout--slide">ht-layout--slide</a>).
Marker class names MUST NOT be manipulated from client HTML or JavaScript
and **SHOULD be used only in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
<a href="class-names.md#ht-slide-from">ht-slide-from</a> | Automatically set on previously active <a href="class-names.md#ht-layout--slide">ht-layout--slide</a>.
<a href="class-names.md#ht-slide-to">ht-slide-to</a> | Automatically set on currently active <a href="class-names.md#ht-layout--slide">ht-layout--slide</a>.

### Details

#### ht-slide-from

Automatically set on previously active <a href="class-names.md#ht-layout--slide">ht-layout--slide</a>.

*@invariant* - After starting first transition this class name is set on only one slide.

#### ht-slide-to

Automatically set on currently active <a href="class-names.md#ht-layout--slide">ht-layout--slide</a>.

This class name is set on first slide after starting a slider
and then set on currently active slide each time it changes.

*@invariant* - After starting slider this class name is set on only one slide.

<!-- End lib/enums/marker.js -->

<!-- Start lib/enums/layout.js -->

## Layout Class Names

In most cases, most of layout classes **SHOULD not be used in client HTML**, as they are
automatially applied to apropriate elements during [slider's upgrade procedure](dom-upgrade.md)
(<a href="class-names.md#ht-slider">ht-slider</a> is the only layout class name that MUST be applied in client HTML).

Layout classes play following roles in slider's inner-workings.
 1. **role-id** - class names are used to identify element's role during slider upgrade,
 2. **transition** - class names must be used in definitions of CSS transitions,
 3. **styling** - class names are recommended for usage in slide's styling.

### Summary

Name | Description | Usage | Client HTML
--- | --- | --- | ---
<a href="class-names.md#ht-layout--slider">ht-layout--slider</a> | Identifies main slider element. | role-id styling | mandatory
<a href="class-names.md#ht-layout--slide">ht-layout--slide</a> | Identifies a slide. | role-id styling | optional
<a href="class-names.md#ht-layout--background">ht-layout--background</a> | Identifies background of a slide. | role-id styling transition | optional
<a href="class-names.md#ht-layout--content">ht-layout--content</a> | Identifies content of a slide. | role-id styling transition | optional
<a href="class-names.md#ht-layout--controls">ht-layout--controls</a> | Set during upgrade on all generated controls. | styling | forbidden
<a href="class-names.md#ht-layout--arrow">ht-layout--arrow</a> | Set during upgrade on generated arrow buttons. | styling | forbidden
<a href="class-names.md#ht-layout--arrow-left">ht-layout--arrow-left</a> | Set during upgrade on generated left arrow button. | styling | forbidden
<a href="class-names.md#ht-layout--arrow-right">ht-layout--arrow-right</a> | Set during upgrade on generated right arrow button. | styling | forbidden
<a href="class-names.md#ht-layout--dots">ht-layout--dots</a> | Set during upgrade on container elements that contains dot buttons. | styling | forbidden
<a href="class-names.md#ht-layout--dot">ht-layout--dot</a> | Set during upgrade on each dot button element. | styling | forbidden

### Details

#### ht-layout--slider

Identifies main slider element.

This class must be set on all slider elements in client HTML.
It can be used in client CSS code for styling.

#### ht-layout--slide

Identifies a slide.

At least 2 slides must be defined in each slider.
It can be used in client CSS code for styling.

*@parent-element* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-layout--background

Identifies background of a slide.

For slides in which this element is not present in slider declaration, empty background
element will be generated during slider upgrade. This class name must be used in all
definitions of background transitions.

*@parent-element* - <a href="class-names.md#ht-layout--slide">ht-layout--slide</a>

#### ht-layout--content

Identifies content of a slide.

For slides in which this element is not present in slider declaration, it will be generated
during slider upgrade. Contents of a slide will be moved inside generated element. If element
is present in slider declaration, it must contain all contents of a slide. This class name
must be used in all definitions of content transitions.

*@parent-element* - <a href="class-names.md#ht-layout--slide">ht-layout--slide</a>

#### ht-layout--controls

Set during upgrade on all generated controls.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-layout--arrow

Set during upgrade on generated arrow buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-layout--arrow-left

Set during upgrade on generated left arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-layout--arrow-right

Set during upgrade on generated right arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-layout--dots

Set during upgrade on container elements that contains dot buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - <a href="class-names.md#ht-layout--slider">ht-layout--slider</a>

#### ht-layout--dot

Set during upgrade on each dot button element.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - <a href="class-names.md#ht-layout--dots">ht-layout--dots</a>

<!-- End lib/enums/layout.js -->

<!-- Start lib/enums/flag.js -->

## Flag Class Names

They are automatically set by the slider. Flag class names MUST NOT be manipulated from
client HTML or JavaScript and **SHOULD be used only in client CSS**.

### Summary

Name | Description
--- | ---
<a href="class-names.md#is-upgraded">is-upgraded</a> | Automatically set on slider after its upgrade.
<a href="class-names.md#is-active">is-active</a> | Automatically set on <a href="class-names.md#ht-layout--dot">ht-layout--dot</a> button connected with currently active slide.

### Details

#### is-upgraded

Automatically set on slider after its upgrade.

#### is-active

Automatically set on <a href="class-names.md#ht-layout--dot">ht-layout--dot</a> button connected with currently active slide.

*@invariant* - This class is set on only one dot button.

<!-- End lib/enums/flag.js -->

<!-- Start lib/enums/pattern.js -->

## Other Class Names

### Summary

Name | Description
--- | ---
<a href="class-names.md#ht-transition--\sg">/ht-transition--([^\s]+)/g</a> | All transitions used by the slider must match this regular expression.
<a href="class-names.md#ht-theme--\sg">/ht-theme--([^\s]+)/g</a> | All themes used by the slider must match this regular expression.
<a href="class-names.md#ht-slide-id-\s">/ht-slide-id-([^\s]+)/</a> | Slider keeps class name with id of current slide on <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> element.

### Details

#### /ht-transition--([^\s]+)/g

All transitions used by the slider must match this regular expression.

During [slider's DOM upgrade](dom-upgrade.md) <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> element is checked
for presence of transition class names. Transitions declared this way will be randomly used
by the slider. After upgrade all declared transitions are removed from slider element and
added again for the duration of a transition between slides.

Transitions may also be declared on <a href="class-names.md#ht-layout--slide">ht-layout--slide</a> elements. Slider will always
use transition declared on slide element when moving to this slide. Transition declarations of
this type are [checked continuously](#continuously), therefore they may be added/removed
on slides at runtime (client JavaScript).

*@invariant* - Class name of currently running transition is set on slider element.

#### /ht-theme--([^\s]+)/g

All themes used by the slider must match this regular expression.

During [slider's DOM upgrade](dom-upgrade.md) <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> element is checked for
presence of theme class names. Themes declared this way are then removed from the slider
and added to all slides, which have no theme specified. Themes are added again to slider's
element for the duration of slide being visible.

Themes may also be declared on <a href="class-names.md#ht-layout--slide">ht-layout--slide</a> elements. Theme declarations of
this type are [checked continuously](#continuously), therefore they may be added/removed
on slides at runtime (client JavaScript).

HyperText Slider provides very basic [built-in themes](class-names.md#theme-class-names)
(see [Adding Custom Themes](custom-themes.md)).

*@invariant* - Theme class name's of currently active slide is added to slider element.

#### /ht-slide-id-([^\s]+)/

Slider keeps class name with id of current slide on <a href="class-names.md#ht-layout--slider">ht-layout--slider</a> element.

This functionality may be useful if slides other than current are to be partially visible
or if appearence of controls or even whole slider needs to change from one slide to another.

*@invariant* - Class name with id of current slide is set on slider element.

<!-- End lib/enums/pattern.js -->

<!-- End Template class-names.md.ejs -->

