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
 * Option classes enable features of the slider.
 *
 * Most options are intended to be set on ${link Layout.SLIDER} element, but they can also be
 * set on document's `<body>`. Options set on `<body>` are treated as defaults for each ${link
 * Layout.SLIDER} declared on the page.
 *
 * @name Option Class Names
 * @summary-column checked Checked
 * @summary-column target Target Element
 */
var Option = {

  /**
   * Adds
   * ${link Option.AUTOPLAY},
   * ${link Option.ARROW_KEYS}
   * classes to the slider.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   *
   * @fqn Option.DEFAULTS
   */
  DEFAULTS: 'ht-option--defaults',

  /**
   * Automatically moves slider to next slide.
   *
   * Slider is moved to the next after time specified in ${link Time time class name}.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked continuously
   * @see Slider.prototype.moveToNext
   *
   * @fqn Option.AUTOPLAY
   */
  AUTOPLAY: 'ht-option--autoplay',

  /**
   * Adds keyboard control to slider.
   *
   * `keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
   * slide, with `RightArrow` key moves slider to next slide.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   * @see Slider.prototype.currentIndex
   *
   * @fqn Option.ARROW_KEYS
   */
  ARROW_KEYS: 'ht-option--arrow-keys',
};

module.exports = Option;

/*
  eslint-env node
*/

