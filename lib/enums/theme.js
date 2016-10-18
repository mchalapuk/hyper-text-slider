/*!

   Copyright 2016 Maciej Chałapuk

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

'use strict';

/**
 * Themes make slide look god without any other styling. Their purpose is to set default styles
 * for a slide (typically background and font colors, typography and control elements).
 *
 * Multiple themes MAY be specified for each slide element (${link Layout.SLIDE}) in client HTML.
 * During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no theme specified
 * receives theme classes which were declared on the slider element (${link Layout.SLIDER}).
 * If there is no theme specified on the slider, default themes are used.
 *
 * [How to add custom theme?](custom-themes.md)
 *
 * @name Theme Class Names
 * @summary-column default Is Default Theme
 */
var Theme = {

  /**
   * White background, dark foreground elements (texts, dots, arrows).
   *
   * @default false
   * @fqn Theme.WHITE
   */
  WHITE: 'hermes-theme--white',

  /**
   * Black background, white foreground elements (texts, dots, arrows).
   *
   * @default true
   * @fqn Theme.BLACK
   */
  BLACK: 'hermes-theme--black',

  /**
   * Shows dot button for each slide.
   *
   * This theme provides basic dot visuals. In case different styling of dots is needed, either
   * extend this theme class or create your own from scratch. Extending this class may be
   * prefereable as other themes (${link Theme.BLACK}, ${link Theme.WHITE}) are compatible
   * with this one.
   *
   * @default true
   * @fqn Theme.DEFAULT_DOTS
   */
  DEFAULT_DOTS: 'hermes-theme--default-dots',

  /**
   * Shows default side arrow buttons.
   *
   * This theme provides basic arrow visuals. In case different styling of arrows is needed, either
   * extend this theme class or create your own from scratch. Extending this class may be
   * prefereable if you also want to use ${link Theme.RESPONSIVE_ARROWS}.
   *
   * @default true
   * @fqn Theme.DEFAULT_ARROWS
   */
  DEFAULT_ARROWS: 'hermes-theme--default-arrows',

  /**
   * Adds screen responsiveness to slider arrows.
   *
   * Slider controls come in 3 different layouts. Each for different range of screen width.
   *
   * 1. On wide screens arrows are located on sides out of content area,
   * 2. On mid-sized screens arrows are located on sides above content area,
   * 3. On small screens arrows are smaller and located on the bottom at the same height as dots.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.DEFAULT_ARROWS}.
   *
   * @see [Screen Responsiveness](responsiveness.md)
   * @see Slider.breakpointNarrowToNormal
   * @see Slider.breakpointNormalToWide
   *
   * @default true
   * @fqn Theme.RESPONSIVE_ARROWS
   */
  RESPONSIVE_ARROWS: 'hermes-theme--responsive-arrows',

  /**
   * Adds hover-dependent visibility change to arrows.
   *
   * Arrows become visible when mouse is hovering above the slider.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.DEFAULT_ARROWS} or custom theme that defines arrow visuals.
   *
   * @default false
   * @fqn Theme.HOVER_VISIBLE_ARROWS
   */
  HOVER_VISIBLE_ARROWS: 'hermes-theme--hover-visible-arrows',

  /**
   * Adds hover-dependent opacity change to arrows.
   *
   * Arrows become more opaque twhen mouseis hovering above the slider.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.DEFAULT_ARROWS} or custom theme that defines arrow visuals.
   *
   * @default true
   * @fqn Theme.HOVER_OPAQUE_ARROWS
   */
  HOVER_OPAQUE_ARROWS: 'hermes-theme--hover-opaque-arrows',
};

module.exports = Theme;

/*
  eslint-env node
*/

