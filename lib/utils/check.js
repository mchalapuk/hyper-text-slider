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

var check = require('offensive');
var Assertion = require('offensive/lib/model/assertion');

module.exports = check;

var customAssertions = {
  'anEventTarget': new Assertion(function(context) {
    context._push();
    context.has.method('addEventListener')
      .and.method('removeEventListener')
      .and.method('dispatchEvent')
      ;
    context._pop();
  }),
};

for (var name in customAssertions) {
  check.addAssertion(name, customAssertions[name]);
}

/*
  eslint-env node
 */

/*
  eslint
    no-invalid-this: 0,
    no-underscore-dangle: 0,
 */

