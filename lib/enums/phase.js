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
 * All phase classes are automatically set on slider element (${link Layout.SLIDER}).
 * They MUST NOT be manipulated from client HTML or JavaScript. They **should be used only
 * in definitions of CSS transitions**.
 *
 * @name Transition Phase Class Names
 */
var Phase = {

  /**
   * Set on slider element just before transition starts.
   *
   * This phase lasts for 1 millisecond. It exists just for the purpose of setting CSS properties
   * to initial values before transition.
   *
   * @fqn Phase.BEFORE_TRANSITION
   */
  BEFORE_TRANSITION: 'hermes-before-transition',

  /**
   * Set on slider element while transition of ${link Layout.CONTENT} element is run.
   *
   * @fqn Phase.DURING_TRANSITION
   */
  DURING_TRANSITION: 'hermes-during-transition',

  /**
   * Set on slider element after transition of ${link Layout.CONTENT} element ends.
   *
   * @fqn Phase.AFTER_TRANSITION
   */
  AFTER_TRANSITION: 'hermes-after-transition',
};

module.exports = Phase;

/*
  eslint-env node
*/

