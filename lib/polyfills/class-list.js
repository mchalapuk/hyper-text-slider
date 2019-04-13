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

var DOMTokenList = require('./dom-token-list');

module.exports = applyPolyfill;

/**
 * Checks if prototype of passed ElementClass contains classList and,
 * in case not, creates a polyfill implementation.
 */
function applyPolyfill(ElementClass) {
  if (ElementClass.prototype.hasOwnProperty('classList')) {
    return;
  }

  Object.defineProperty(ElementClass.prototype, 'classList', {
    get: lazyDefinePropertyValue('classList', function() {
      if (!(this instanceof ElementClass)) {
        throw new Error(
            '\'get classList\' called on an object that does not implement interface Element.');
      }
      return new DOMTokenList(this, 'className');
    }),
    set: throwError('classList property is read-only'),
    enumerable: true,
    configurable: true,
  });
}

/**
 * Returns a function that:
 *  1. Calls fiven **loader** on first call,
 *  2. Defines a property of given **propertyName** with value returned from loader.
 */
function lazyDefinePropertyValue(propertyName, loader) {
  return function() {
    var value = loader.apply(this, arguments);

    Object.defineProperty(this, propertyName, {
      value: value,
      enumerable: true,
      configurable: true,
    });

    return value;
  };
}

/**
 * Returns a function that throws an Error with given **message**.
 */
function throwError(message) {
  return function() { throw new Error(message); };
}

