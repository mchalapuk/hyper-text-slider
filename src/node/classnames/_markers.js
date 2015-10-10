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
 * They are automatically set on slide elements (${link ${value Layout.SLIDE}}).
 * Marker class names MUST NOT be manipulated from client HTML or JavaScript
 * and **SHOULD be used only in definitions of CSS transitions**.
 *
 * @name Transition Marker Class Names
 */
var Marker = {

  /**
   * Automatically set on previously active ${link ${value Layout.SLIDE}}.
   *
   * @invariant After starting first transition this class name is set on only one slide.
   *
   * @fqn Marker.SLIDE_FROM
   */
  SLIDE_FROM: 'hermes-slide-from',

  /**
   * Automatically set on currently active ${link ${value Layout.SLIDE}}.
   *
   * This class name is set on first slide after starting a slider
   * and then set on currently active slide each time it changes.
   *
   * @invariant After starting slider this class name is set on only one slide.
   *
   * @fqn Marker.SLIDE_TO
   */
  SLIDE_TO: 'hermes-slide-to',
};

module.exports = Marker;

/*
  eslint-env node
*/

