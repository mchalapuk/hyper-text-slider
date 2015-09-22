

<!-- Start src/node/_layout.js -->

## Layout Class Names

name | usage | client | parent
---- | ----- | ------ | ------
hermes-layout--slider | role-id styling | mandatory | 
hermes-layout--slide | role-id styling | mandatory at least 2 slides must be defined in each slider | hermes-layout--slider
hermes-layout--background | role-id styling transition | optional will be generated during slider upgrade if not present in the declaration | hermes-layout--slide
hermes-layout--content | role-id styling transition | optional will be generated during slider upgrade if not present in the declaration | hermes-layout--slide
hermes-layout--inner | transition | optional | hermes-layout--content
hermes-layout--arrow | styling | forbidden | hermes-layout--slider
hermes-layout--arrow-left | styling | forbidden | hermes-layout--slider
hermes-layout--arrow-right | styling | forbidden | hermes-layout--slider
hermes-layout--dots | styling | forbidden | hermes-layout--slider
hermes-layout--dot | styling | forbidden | hermes-layout--dots

## hermes-layout--slider

Identifies main slider element.

This class must be set on all slider elements in client HTML.
It can be used in client CSS code for styling.

## hermes-layout--slide

Identifies a slide.

## hermes-layout--background

Identifies background of a slide.

## hermes-layout--content

Identifies content of a slide.

## hermes-layout--inner

May be set on selected elements of content of a slide. Used in some transitions.

## hermes-layout--arrow

Set during upgrade on both arrow buttons.

## hermes-layout--arrow-left

Set during upgrade on left arrow button.

## hermes-layout--arrow-right

Set during upgrade on right arrow button.

## hermes-layout--dots

Set during upgrade on container for dot buttons.

## hermes-layout--dot

Set during upgrade on each dot button.

<!-- End src/node/_layout.js -->

