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
var Regexp = {

  /**
   * All transitions used by the slider must match this regular expression.
   *
   * During slider upgrade ${link ${value Layout.SLIDER}} element is checked for presence of
   * transition class names. Transitions declared this way will be randomly used by the slider.
   * After upgrade all declared transitions are removed from slider element.
   *
   * Transitions may also be declared on ${link ${value Layout.SLIDE}} elements. Slider will always
   * use transition declared on slide element when moving to this slide. Transition declarations of
   * this type are ${link continuously checked continuously}, therefore they may be added/removed
   * on slides at runtime (client JavaScript).
   *
   * @invariant Class name of currently running transition is set on slider element.
   *
   * @fqn Regexps.TRANSITION
   */
  TRANSITION: /hermes-transition--([^ ]+)/g,
};

module.exports = Regexp;

