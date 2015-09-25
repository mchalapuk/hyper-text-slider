<!-- Start Template class-names.md.ejs -->

# Class Names

**Table of Contents**

1. [Layout Class Names](#Layout Class Names)<ul>
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

Parent Element: [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--background

Identifies background of a slide.

For slides in which this element is not present in slider declaration, empty background
element will be generated during slider upgrade. This class name must be used in all
definitions of background transitions.

Parent Element: [hermes-layout--slide](#hermes-layout--slide)

#### hermes-layout--content

Identifies content of a slide.

For slides in which this element is not present in slider declaration, it will be generated
during slider upgrade. Contents of a slide will be moved inside generated element. If element
is present in slider declaration, it must contain all contents of a slide. This class name
must be used in all definitions of content transitions.

Parent Element: [hermes-layout--slide](#hermes-layout--slide)

#### hermes-layout--inner

May be used in definitions of content transitions.

In cases when some parts of slide's content need another transition this class name must be
used in definition of the transition and in client HTML.

Parent Element: [hermes-layout--content](#hermes-layout--content)

#### hermes-layout--arrow

Set during upgrade on generated arrow buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

Parent Element: [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--arrow-left

Set during upgrade on generated left arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

Parent Element: [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--arrow-right

Set during upgrade on generated right arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

Parent Element: [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--dots

Set during upgrade on container elements that contains dot buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

Parent Element: [hermes-layout--slider](#hermes-layout--slider)

#### hermes-layout--dot

Set during upgrade on each dot button element.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

Parent Element: [hermes-layout--dots](#hermes-layout--dots)

<!-- End src/node/classnames/_layout.js -->

<!-- End Template class-names.md.ejs -->


<!-- Start Template class-names.md.ejs -->

# Class Names

**Table of Contents**

1. [Option Class Names](#Option Class Names)<ul>
<li>[hermes-defaults](#hermes-defaults)
<li>[hermes-autostart](#hermes-autostart)
<li>[hermes-autoplay](#hermes-autoplay)
<li>[hermes-create-arrows](#hermes-create-arrows)
<li>[hermes-create-dots](#hermes-create-dots)
<li>[hermes-arrow-keys](#hermes-arrow-keys)</ul>

<!-- Start src/node/classnames/_options.js -->

## Option Class Names

All option classes are intended to be set on slider element
([hermes-layout--slider](#hermes-layout--slider));

They may be divided into two categories:
 1. **single options** - each of which enables one feature,
 2. **option groups** - that adds many option classes to the slider during upgrade.

Each option is read in one of slider's life-cycle phases:
 1. **upgrade** - class name should be set in client HTML,
   slider will check for it only once during upgrade,
 2. **runtime** - class name may be added/removed at any time,
   slider will check for it every time a decission connected with this class is made.

### Summary

Name | Description | Checked During Phase
--- | --- | ---
[hermes-defaults](#hermes-defaults) | Adds ${Option.AUTOSTART}, ${Option.AUTOPLAY}, ${Option.CREATE_ARROWS},${Option.CREATE_DOTS}, ${Option.ARROW_KEYS} to the slider. | upgrade
[hermes-autostart](#hermes-autostart) | Shows first slide automatically. | upgrade
[hermes-autoplay](#hermes-autoplay) | Automatically moves slider to next slide. | runtime
[hermes-create-arrows](#hermes-create-arrows) | Creates side arrow buttons. | upgrade
[hermes-create-dots](#hermes-create-dots) | Creates dot button for each slide. | upgrade
[hermes-arrow-keys](#hermes-arrow-keys) | Adds keyboard control to slider. | upgrade

### Details

#### hermes-defaults

Adds ${Option.AUTOSTART}, ${Option.AUTOPLAY}, ${Option.CREATE_ARROWS},
${Option.CREATE_DOTS}, ${Option.ARROW_KEYS} to the slider.

Checked During Phase: `upgrade`

#### hermes-autostart

Shows first slide automatically.

Checked During Phase: `upgrade`

See: Slider.start

#### hermes-autoplay

Automatically moves slider to next slide.

Slider is moved after content transition of current slide ends.

Checked During Phase: `runtime`

See: Slider.moveToNext

#### hermes-create-arrows

Creates side arrow buttons.

`click` event on dispatched on left arrow moves slider to previous slide.
`click` event on dispatched on right arrow moves slider to next slide.

Checked During Phase: `upgrade`

See: Slider.moveToNext

#### hermes-create-dots

Creates dot button for each slide.

`click` event displatched on dot button moves slider to slide asociated with this dot button.

Checked During Phase: `upgrade`

See: Slider.slides.currentIndex

#### hermes-arrow-keys

Adds keyboard control to slider.

`keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
slide, with `RightArrow` key moves slider to next slide.

Checked During Phase: `upgrade`

See: Slider.slides.currentIndex

<!-- End src/node/classnames/_options.js -->

<!-- End Template class-names.md.ejs -->

