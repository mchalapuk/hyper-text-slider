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
 * All option classes are intended to be set on slider element (${link Layout.SLIDER}).
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
 */
var Option = {

  /**
   * Adds ${link Option.AUTOSTART}, ${link Option.AUTOPLAY},
   *  ${link Option.CREATE_ARROWS}, ${link Option.CREATE_DOTS},
   *  ${link Option.ARROW_KEYS} classes to the slider.
   *
   * @checked once
   *
   * @fqn Option.DEFAULTS
   */
  DEFAULTS: 'hermes-defaults',

  /**
   * Shows first slide automatically.
   *
   * @checked once
   * @see Slider.prototype.start
   *
   * @fqn Option.AUTOSTART
   */
  AUTOSTART: 'hermes-autostart',

  /**
   * Automatically moves slider to next slide.
   *
   * Slider is moved after content transition of current slide ends.
   *
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
   * @checked once
   * @see Slider.prototype.currentIndex
   *
   * @fqn Option.ARROW_KEYS
   */
  ARROW_KEYS: 'hermes-arrow-keys',
};

module.exports = Option;

/*
  eslint-env node
*/

