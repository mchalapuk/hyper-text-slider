/*

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

var Slider = require('./slider');

module.exports = boot;

/**
 * Default Hermes boot procedure.
 *
 * For each element with ${Layout.SLIDER} class name found in passed container:
 *
 *  1. Creates ${Slider} object,
 *  2. Invokes its ${Slider.prototype.start} method.
 *
 * If you are using browserify, you may want to call this function at some point...
 *
 * ```
 * var hermes = require('hermes-slider');
 * hermes.boot();
 * ```
 *
 * ...or event consider implementing bootup by yourself.
 *
 * @see Option.AUTOBOOT
 * @fqn boot
 */
function boot(containerElement) {
  // TODO tests
  var sliderElems = [].slice.call(containerElement.querySelectorAll('.hermes-layout--slider'));

  var sliders = sliderElems.map(function(elem) {
    // TODO this should be a feature of Phaser
    // turn off vanilla behavior (vertical scroll bar)
    elem.classList.add('is-upgraded');
    return new Slider(elem);
  });

  // TODO maybe requestAnimationFrame with a polyfill instead of setTimeout?
  window.setTimeout([].forEach.bind(sliders, function(slider) { slider.start(); }), 100);
}

/*
  eslint-env node, browser
*/

