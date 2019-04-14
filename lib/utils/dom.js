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

var check = require('../utils/check');

module.exports = {
  findClassNames: findClassNames,
  removeClassNames: removeClassNames,
  extractClassNames: extractClassNames,
};

function findClassNames(elem, pattern) {
  check(elem, 'elem').is.anInstanceOf(Element)();
  check(pattern, 'pattern').is.anInstanceOf(RegExp).or.aString();

  var matches = elem.className.match(pattern);
  if (!matches) {
    return null;
  }

  var retVal = [];
  for (var i = 0; i < matches.length; ++i) {
    retVal.push(matches[i]);
  }
  return retVal;
}

function removeClassNames(elem, pattern) {
  check(elem, 'elem').is.anInstanceOf(Element)();
  check(pattern, 'pattern').is.anInstanceOf(RegExp).or.aString();

  elem.className = elem.className.replace(pattern, '').replace('\s+', ' ');
}

function extractClassNames(elem, pattern) {
  check(elem, 'elem').is.anInstanceOf(Element)();
  check(pattern, 'pattern').is.anInstanceOf(RegExp).or.aString();

  var retVal = findClassNames(elem, pattern);
  removeClassNames(elem, pattern);
  return retVal;
}

