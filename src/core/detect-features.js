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

var element = document.createElement('div');
//var nameFromDomProperty = featureNameFromProperty.bind(null, element);
var nameFromCssProperty = featureNameFromProperty.bind(null, element.style);

module.exports = {
  transformPropertyName: nameFromCssProperty('transform', {
    transform: 'transform',
    OTransform: '-o-transform',
    MozTransform: '-moz-transform',
    WebkitTransform: '-webkit-transform',
  }),
  transitionEventName: nameFromCssProperty('transitionend', {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  }),
  animationEventName: nameFromCssProperty('animationstart', {
    animation: 'animationstart',
    webkitAnimation: 'webkitAnimationStart',
    MSAnimation: 'MSAnimationStart',
    MozAnimation: 'MozAnimationStart',
  }),
};

/**
 * Detects browser-specific names of browser features by checking availability
 * of browser-specific properties in given object instance.
 *
 * @param {Object} instance object that will be checked for existence of properties
 * @param {String} defaultName name used if nothing else detected (standard-compliant name)
 * @param {Object} candidateMap browser-specific properties (keys) mapped to feature names (values)
 * @return {String} value from candidateMap or defaultName
 */
function featureNameFromProperty(instance, defaultName, candidateMap) {
  for (var key in candidateMap) {
    if (typeof instance[key] !== 'undefined') {
      return candidateMap[key];
    }
  }

  console.warn('no feature name detected for '+ defaultName +' using default');
  return defaultName;
}

/*
  eslint-env node, browser
*/

