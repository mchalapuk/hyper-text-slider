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
 * @name Other Class Names
 */
var Pattern = {

  /**
   * All transitions used by the slider must match this regular expression.
   *
   * During slider upgrade ${link Layout.SLIDER} element is checked for presence of
   * transition class names. Transitions declared this way will be randomly used by the slider.
   * After upgrade all declared transitions are removed from slider element.
   *
   * Transitions may also be declared on ${link Layout.SLIDE} elements. Slider will always
   * use transition declared on slide element when moving to this slide. Transition declarations of
   * this type are [checked continuously](#continuously), therefore they may be added/removed
   * on slides at runtime (client JavaScript).
   *
   * @invariant Class name of currently running transition is set on slider element.
   *
   * @fqn Pattern.TRANSITION
   */
  TRANSITION: /hermes-transition--([^\s]+)/g,

  /**
   * Slider keeps class name with id of current slide on ${link Layout.SLIDER} element.
   *
   * This functionality may be useful if slides other than current are to be partially visible
   * or if appearence of controls or even whole slider needs to change from one slide to another.
   *
   * @invariant Class name with id of current slide is set on slider element.
   *
   * @fqn Pattern.SLIDE_ID
   */
  SLIDE_ID: /hermes-slide-id-([^\s]+)/,
};

module.exports = Pattern;

/*
  eslint-env node
*/

