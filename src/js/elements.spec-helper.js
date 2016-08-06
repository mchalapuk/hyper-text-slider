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

var Layout = require('../enums/layout');

/**
 * Creates element with given nodeName and className.
 */
function createElement(nodeName, className) {
  var elem = document.createElement(nodeName);
  elem.className = className || '';
  return elem;
}

/**
 * Creates valid slider element containing slides of given count.
 */
function createSliderElement(slidesCount) {
  var sliderElement = createElement('div', Layout.SLIDER);
  for (var i = 0; i < slidesCount; ++i) {
    sliderElement.appendChild(createElement('div', Layout.SLIDE));
  }
  return sliderElement;
}

global.createElement = createElement;
global.createSliderElement = createSliderElement;

/*
  eslint-env node, browser
*/

