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
var Option = require('../enums/option');
var Common = require('../enums/common');
var Layout = require('../enums/layout');
var check = require('../utils/check');

module.exports = boot;

/**
 * Default Hermes boot procedure.
 *
 * For each element with ${link Layout.SLIDER} class name found in passed container
 * (typically document's `<body>`):
 *
 *  1. Adds ${link Option options class names} found on container element,
 *  1. Creates ${link Slider} object,
 *  2. Invokes its ${link Slider.prototype.start} method.
 *
 * If you are using browserify, you may want to call this function at some point...
 *
 * ```javascript
 * var hermes = require('hermes-slider');
 * hermes.boot(document.body);
 * ```
 *
 * ...or even consider implementing bootup by yourself.
 *
 * @param {Element} containerElement element that contains sliders in (not necessarily immediate) children
 * @return {Array<Slider>} array containing all created ${link Slider} instances
 *
 * @see Common.AUTOBOOT
 * @fqn boot
 */
function boot(containerElement) {
  check(containerElement, 'containerElement').is.anInstanceOf(Element);

  var containerOptions = getEnabledOptions(containerElement);
  var sliderElems = concatUnique(
      [].slice.call(containerElement.querySelectorAll('.'+ Layout.SLIDER)),
      [].slice.call(containerElement.querySelectorAll('.'+ Common.SLIDER_SHORT))
      );

  var sliders = sliderElems.map(function(elem) {
    containerOptions.forEach(function(option) {
      if (elem.classList.contains(option)) {
        return;
      }
      elem.classList.add(option);
    });

    return new Slider(elem);
  });

  sliders.forEach(function(slider) { slider.start(); });
  return sliders;
}

// finds option class names on passed element
function getEnabledOptions(element) {
  var retVal = [];
  Object.values(Option).forEach(function(option) {
    if (element.classList.contains(option)) {
      retVal.push(option);
    }
  });
  return retVal;
}

function concatUnique(unique, candidate) {
  return unique.concat(candidate.filter(function(element) { return unique.indexOf(element) === -1; }));
}

/*
  eslint-env node, browser
*/

