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

var precond = require('precond');

/**
 * Fired by the slider when currently visible slide changes.
 *
 * @see Slider.prototype.on
 * @fqn SlideChangeEvent
 */
module.exports = SlideChangeEvent;

/**
 * Creates SlideChangeEvent.
 *
 * @param {Number} from index of a previous slide
 * @param {Number} to index of current slide
 * @fqn SlideChangeEvent.prototype.constructor
 */
function SlideChangeEvent(fromIndex, toIndex) {
  precond.checkIsNumber(fromIndex, 'fromIndex must be a number');
  precond.checkIsNumber(toIndex, 'toIndex must be a number');

  var pub = Object.create(SlideChangeEvent.prototype);

  /**
   * Index of previous slide.
   *
   * @type Number
   * @access read-only
   * @fqn SlideChangeEvent.prototype.fromIndex
   */
  pub.fromIndex = fromIndex;

  /**
   * Index of current slide.
   *
   * @type Number
   * @access read-only
   * @fqn SlideChangeEvent.prototype.toIndex
   */
  pub.toIndex = toIndex;

  return pub;
}

SlideChangeEvent.prototype = {

  /**
   * Always set to 'slideChange'.
   *
   * @type String
   * @access read-only
   * @fqn SlideChangeEvent.prototype.eventName
   */
  eventName: 'slideChange',

  /**
   * Slider instance in which slide has changed.
   *
   * @type Slider
   * @access read-only
   * @fqn SlideChangeEvent.prototype.target
   */
  target: null,
};

/*
  eslint-env node
 */


