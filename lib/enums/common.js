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
 * Most commonly used class names.
 *
 * Each class is checked by the slider in one of two ways:
 *  1. <a href='#once' id='once'>**checked once**</a> - class name should be set
 *    in client HTML, slider will check for it only once during upgrade, adding/removing class
 *    after upgrade make no effect,
 *  2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
 *    class name may be added/removed at any time, slider will check if it is set every time
 *    a decission connected with this class is made.
 *
 * There are two categories of class names:
 *  1. **functional classes** - each of which enables one feature,
 *  2. **class groups** - that adds many class names to the slider during its
 *    [upgrade](dom-upgrade.md).
 *
 * @name Common Class Names
 * @summary-column checked Checked
 * @summary-column target Target Element
 * @summary-column client-html Client HTML
 */
var Common = {

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
   * @client-html mandatory
   * @see boot
   * @see Slider.prototype.start
   *
   * @fqn Common.AUTOBOOT
   */
  AUTOBOOT: 'hermes-autoboot',

  /**
   * Alias for ${link Layout.SLIDER}.
   *
   * @target ${link Layout.SLIDER}
   * @checked once
   * @client-html mandatory
   *
   * @fqn Common.SLIDER_SHORT
   */
  SLIDER_SHORT: 'hermes-slider',

  /**
   * Adds ${link Option.DEFAULTS} and ${link Theme.DEFAULTS} classes to the slider.
   *
   * @target ${link Layout.SLIDER}
   * @checked once
   * @client-html optional
   *
   * @fqn Common.DEFAULTS
   */
  DEFAULTS: 'hermes-defaults',
};

module.exports = Common;

/*
  eslint-env node
*/

