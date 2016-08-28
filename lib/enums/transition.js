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
 * A theme MAY be specified for each slide element (${link Layout.SLIDE}) in client HTML.
 * During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no ttransitions
 * specified receives transitions which was declared on the slider element (${link Layout.SLIDER}).
 * If there is no transition specified on the slider, ${link Transition.ZOOM_IN_OUT}
 * is used as default. Each slider element MAY contain multiple transition class names.
 *
 * @name Transition Class Names
 */
var Transition = {

  /**
   * Delicate zooms in when slide appears, zoom-out when it disappears.
   *
   * @fqn Transition.ZOOM_IN_OUT
   */
  ZOOM_IN_OUT: 'hermes-transition--zoom-in-out',
};

module.exports = Transition;

/*
  eslint-env node
*/

