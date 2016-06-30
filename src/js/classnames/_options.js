/*!

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

*/

'use strict';

/**
 * Option classes enable features of the slider.
 *
 * Most options are intended to be set on {$link Layout.SLIDER} element, but they can also be
 * set on document's `<body>`. Options set on `<body>` are treated as defaults for each {$link
 * Layout.SLIDER} declared on the page.
 *
 * Two categories:
 *  1. **single options** - each of which enables one feature,
 *  2. **option groups** - that adds many option classes to the slider during upgrade.
 *
 * Each option class is checked by the slider in one of two ways:
 *  1. <a href='#once' id='once'>**checked once**</a> - class name should be set
 *    in client HTML, slider will check for it only once during upgrade, adding/removing class
 *    after upgrade make no effect,
 *  2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
 *    class name may be added/removed at any time, slider will check if it is set every time
 *    a decission connected with this class is made.
 *
 * @name Option Class Names
 * @summary-column checked Checked
 * @summary-column target Target Element
 */
var Option = {

  /**
   * Automatically creates ${link Slider} objects for all sliders declared on the page
   * and invokes their ${link Slider.prototype.start} methods.
   *
   * This options can be set only on `<body>` element.
   * It enabled using Hermes without any JavaScript programming.
   *
   * > ***WARNING***
   * >
   * > When using Hermes via node and broserify, this option is ignored.
   *
   * @target document's `<body>`
   * @checked once
   * @see boot
   * @see Slider.prototype.start
   *
   * @fqn Option.AUTOBOOT
   */
  AUTOBOOT: 'hermes-autoboot',

  /**
   * Adds
   * ${link Option.AUTOPLAY},
   * ${link Option.CREATE_ARROWS},
   * ${link Option.CREATE_DOTS},
   * ${link Option.ARROW_KEYS},
   * ${link Option.RESPONSIVE_CONTROLS}
   * classes to the slider.
   *
   * @target `<body` or {$link Layout.SLIDER}
   * @checked once
   *
   * @fqn Option.DEFAULTS
   */
  DEFAULTS: 'hermes-defaults',

  /**
   * Automatically moves slider to next slide.
   *
   * Slider is moved to the next after time specified in ${link Time time class name}.
   *
   * @target `<body` or {$link Layout.SLIDER}
   * @checked continuously
   * @see Slider.prototype.moveToNext
   *
   * @fqn Option.AUTOPLAY
   */
  AUTOPLAY: 'hermes-autoplay',

  /**
   * Creates side arrow buttons.
   *
   * `click` event on dispatched on left arrow moves slider to previous slide.
   * `click` event on dispatched on right arrow moves slider to next slide.
   *
   * @target `<body` or {$link Layout.SLIDER}
   * @checked once
   * @see Slider.prototype.moveToPrevious
   * @see Slider.prototype.moveToNext
   *
   * @fqn Option.CREATE_ARROWS
   */
  CREATE_ARROWS: 'hermes-create-arrows',

  /**
   * Creates dot button for each slide.
   *
   * `click` event displatched on dot button moves slider to slide asociated with this dot button.
   *
   * @target `<body` or {$link Layout.SLIDER}
   * @checked once
   * @see Slider.prototype.currentIndex
   *
   * @fqn Option.CREATE_DOTS
   */
  CREATE_DOTS: 'hermes-create-dots',

  /**
   * Adds keyboard control to slider.
   *
   * `keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
   * slide, with `RightArrow` key moves slider to next slide.
   *
   * @target `<body` or {$link Layout.SLIDER}
   * @checked once
   * @see Slider.prototype.currentIndex
   *
   * @fqn Option.ARROW_KEYS
   */
  ARROW_KEYS: 'hermes-arrow-keys',

  /**
   * Adds screen responsiveness to slider controls.
   *
   * Slider controls come in 3 different layouts. Each for different range of screen width.
   *
   * @target `<body` or {$link Layout.SLIDER}
   * @checked once
   * @see [Screen Responsiveness](responsiveness.md)
   * @see Slider.breakpointNarrowToNormal
   * @see Slider.breakpointNormalToWide
   *
   * @fqn Option.RESPONSIVE_CONTROLS
   */
  RESPONSIVE_CONTROLS: 'hermes-responsive-controls',
};

module.exports = Option;

/*
  eslint-env node
*/

