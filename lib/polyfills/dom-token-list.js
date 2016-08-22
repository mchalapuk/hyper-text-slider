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

var check = require('../utils/check');

var namespace = typeof window !== 'undefined'? window: global;

module.exports = namespace.DOMTokenList || Polyfill;

/**
 * Constructs Polyfill of DOMTokenList.
 *
 * The list will be represented as a string located in given **object**
 * under property of name **key**.
 *
 * @see https://developer.mozilla.org/pl/docs/Web/API/DOMTokenList
 */
function Polyfill(object, key) {
  check(object, 'object').is.anObject();
  check(key, 'key').is.aString();
  check(object[key], 'object.'+ key).is.aString();

  var that = this;

  that.add = function() {
    var tokens = [].slice.apply(arguments);
    check(tokens, 'tokens').contains.onlyStrings();
    object[key] += (object[key].length ?' ' :'') + tokens.join(' ');
  };
  that.remove = function(token) {
    check(token, 'token').is.aString();
    object[key] = object[key].replace(new RegExp('\\b'+ token +'\\b\\s*'), '').replace(/^\\s*/, '');
  };
  that.contains = function(token) {
    check(token, 'token').is.aString();
    return object[key].search(new RegExp('\\b'+ token +'\\b')) !== -1;
  };
  Object.defineProperty(that, 'length', {
    get: function() {
      return (object[key].match(/[^\s]+/g) || []).length;
    },
  });

  return that;
}

/*
  eslint-env node, browser
 */

