
<!-- Start src/node/classnames/_layout.js -->
<!-- Template: class-names -->

## Layout Class Names

### Summary

Name | Description | Usage | Client HTML
---- | ----------- | ----- | -----------
[hermes-layout--slider](#hermes-layout--slider) | Identifies main slider element. | role-id styling | mandatory
[hermes-layout--slide](#hermes-layout--slide) | Identifies a slide. | role-id styling | mandatory
[hermes-layout--background](#hermes-layout--background) | Identifies background of a slide. | role-id styling transition | optional
[hermes-layout--content](#hermes-layout--content) | Identifies content of a slide. | role-id styling transition | optional
[hermes-layout--inner](#hermes-layout--inner) | May be set on selected elements of content of a slide. | transition | optional
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

For slides in which this element is not present in slider declaration, empty background element
will be generated during slider upgrade.

Parent Element: [hermes-layout--slide](#hermes-layout--slide)

#### hermes-layout--content

Identifies content of a slide.

For slides in which this element is not present in slider declaration, it will be generated
during slider upgrade. Contents of a slide will be moved inside generated element.

If element is present in slider declaration, it must contain all contents of a slide.

Parent Element: [hermes-layout--slide](#hermes-layout--slide)

#### hermes-layout--inner

May be set on selected elements of content of a slide.

Used in some transitions.

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

