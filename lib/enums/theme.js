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
 * Themes make slide look god without any other styling. It's purpose is to set default color
 * for background and all foreground elements (text and all controls).
 *
 * A theme MAY be specified for each slide element (${link Layout.SLIDE}) in client HTML.
 * During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no theme specified
 * receives a theme class which was declared on the slider element (${link Layout.SLIDER}).
 * If there is no theme specified on the slider, ${link Theme.WHITE} is used as default.
 *
 * @name Theme Class Names
 */
var Theme = {

  /**
   * White background, dark foreground. This is the default theme if none specified.
   *
   * @fqn Theme.WHITE
   */
  WHITE: 'hermes-theme--white',

  /**
   * Black background, white foreground.
   *
   * @fqn Theme.BLACK
   */
  BLACK: 'hermes-theme--black',
};

module.exports = Theme;

/*
  eslint-env node
*/

