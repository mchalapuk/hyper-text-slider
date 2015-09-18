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

// from Modernizr
function getTransitionEventName() {
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };

  for (var t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
  return 'transitionend';
}

function getTransformPropertyName() {
  var el = document.createElement('fakeelement');
  var transforms = {
    'transform': 'transform',
    'OTransform': '-o-transform',
    'MozTransform': '-moz-transform',
    'WebkitTransform': '-webkit-transform'
  };

  for (var t in transforms) {
    if (el.style[t] !== undefined) {
      return transforms[t];
    }
  }
}

var transitionEventName = getTransitionEventName();
var transformPropertyName = getTransformPropertyName();

module.exports = {
  transitionEventName: transitionEventName,
  transformPropertyName: transformPropertyName,
};

