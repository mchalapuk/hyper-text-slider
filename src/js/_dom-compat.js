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

module.exports = {
  transformPropertyName: getFeatureName('transform', {
    OTransform: '-o-transform',
    MozTransform: '-moz-transform',
    WebkitTransform: '-webkit-transform',
  }),
  transitionEventName: getFeatureName('transitionend', {
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  }),
};

/**
 * Detects browser-specific names of browser features by checking availability
 * of browser-specific CSS atributes in a DOM element.
 *
 * @param defaultName name used if nothing else detected (standard-compliant name)
 * @param candidateMap browser-specific css attribute names (keys) mapped to feature names (values)
 * @return value from candidateMap or defaultName
 */
function getFeatureName(defaultName, candidateMap) {
  var elem = document.createElement('fakeelement');

  for (var key in candidateMap) {
    if (typeof elem.style[key] !== 'undefined') {
      return candidateMap[key];
    }
  }
  return defaultName;
}

/*
  eslint-env node, browser
*/

