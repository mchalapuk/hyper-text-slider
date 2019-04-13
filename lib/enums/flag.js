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
 * They are automatically set by the slider. Flag class names MUST NOT be manipulated from
 * client HTML or JavaScript and **SHOULD be used only in client CSS**.
 *
 * @name Flag Class Names
 */
var Flag = {

  /**
   * Automatically set on slider after its upgrade.
   *
   * @fqn Flag.UPGRADED
   */
  UPGRADED: 'is-upgraded',

  /**
   * Automatically set on ${link Layout.DOT} button connected with currently active slide.
   *
   * @invariant This class is set on only one dot button.
   *
   * @fqn Flag.ACTIVE
   */
  ACTIVE: 'is-active',
};

module.exports = Flag;

