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
 * Time classes configure ${link Option.AUTOPLAY} option. They control
 * time duration of one slide being visible before automatic change to the next.
 *
 * @name Time Class Names
 */
var Time = {
  // TODO default slide time

  /**
   * Makes slide visible for 3 seconds before moving to next.
   *
   * @target Layout.SLIDER
   * @checked continously
   *
   * @fqn Time.SECONDS_3
   */
  SECONDS_3: 'hermes-slide-time-3sec',

  /**
   * Makes slide visible for 5 seconds before moving to next.
   *
   * @target Layout.SLIDER
   * @checked continously
   *
   * @fqn Time.SECONDS_5
   */
  SECONDS_5: 'hermes-slide-time-5sec',

  /**
   * Makes slide visible for 7 seconds before moving to next.
   *
   * @target Layout.SLIDER
   * @checked continously
   *
   * @fqn Time.SECONDS_7
   */
  SECONDS_7: 'hermes-slide-time-7sec',
};

module.exports = Time;

/*
  eslint-env node
*/

