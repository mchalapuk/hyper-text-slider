(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*

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


/**
 * During project build, this script is compiled to `dist/polyfills.js`,
 * which contains ES5 code that can be run in not-so-modern browsers.
 * It is to be used only when programming in vanilla-browser style.
 * When using nodejs-based javascript preprocessor, it's better to load
 * `hyper-text-slider` module and polyfills with `require()` function.
 */
Object.values = require('./polyfills/values');
require('./polyfills/class-list')(window.Element);


},{"./polyfills/class-list":2,"./polyfills/values":4}],2:[function(require,module,exports){
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


},{"./dom-token-list":3}],3:[function(require,module,exports){
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

module.exports = Polyfill;

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


},{"offensive/lib/nodsl":5}],4:[function(require,module,exports){
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

module.exports = Object.values || polyfill;

function polyfill(object) {
  nodsl.check(typeof object !== 'undefined' && object !== null,
      'object must be not empty; got ', object);

  var values = [];
  for (var key in object) {
    values.push(object[key]);
  }
  return values;
}


},{"offensive/lib/nodsl":5}],5:[function(require,module,exports){
'use strict';

module.exports = {
  check: noDslCheck,
};

function noDslCheck(condition) {
  if (!condition) {
    throw new Error([].slice.call(arguments, 1).join(''));
  }
}

/*
  eslint-env node
 */


},{}]},{},[1]);
