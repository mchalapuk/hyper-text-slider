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

// polyfills must no use full offensivejs library
// (it would be loaded in the browser twice otherwise)
var nodsl = require('offensive/lib/nodsl');

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
  nodsl.check(typeof object === 'object', 'object must be an object; got ', object);
  nodsl.check(typeof key === 'string', 'key must be a string; got ', key);
  nodsl.check(typeof object[key] === 'string', 'object.', key, ' must be a string; got ', object[key]);

  var that = this;

  that.add = function() {
    var tokens = [].slice.apply(arguments);
    tokens.forEach(function(token, i) {
      nodsl.check(typeof token === 'string', 'tokens[', i, '] must be a string; got ', token);
    });
    object[key] += (object[key].length ?' ' :'') + tokens.join(' ');
  };
  that.remove = function(token) {
    nodsl.check(typeof token === 'string', 'token must be a string; got ', token);
    object[key] = object[key].replace(new RegExp('\\b'+ token +'\\b\\s*'), '').replace(/^\\s*/, '');
  };
  that.contains = function(token) {
    nodsl.check(typeof token === 'string', 'token must be a string; got ', token);
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

