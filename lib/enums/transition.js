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
 * Transitions add nice animations to slide changes. Typically, one transition adds animation
 * to slide's content (${link Layout.CONTENT}) or slide's background (${link Layout.BACKGROUND}),
 * or both. Custom transitions may also animate only parts of slide's content (e.g. to display
 * some parts of the slide with a delay).
 *
 * Multiple transitions MAY be added on each slide element (${link Layout.SLIDE}) in client HTML.
 * During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no transitions
 * specified receives transitions which were declared on the slider element (${link Layout.SLIDER}).
 * If there is no transition specified on the slider, ${link Transition.ZOOM_OUT_IN}
 * and ${link Transition.BG_ZOOM_IN_OUT} are used as default.
 *
 * @name Transition Class Names
 */
var Transition = {

  /**
   * Delicate content zoom out when slide appears, zoom in when it disappears.
   *
   * @fqn Transition.ZOOM_OUT_IN
   */
  ZOOM_OUT_IN: 'ht-transition--zoom-out-in',

  /**
   * Delicate background zoom in when slide appears, zoom out when it disappears.
   *
   * @fqn Transition.BG_ZOOM_IN_OUT
   */
  BG_ZOOM_IN_OUT: 'ht-transition--bg-zoom-in-out',
};

module.exports = Transition;

