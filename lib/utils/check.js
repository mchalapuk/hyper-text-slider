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

var check = require('offensive').default;
var Registry = require('offensive/Registry').default;

require('offensive/assertions/method/register');
require('offensive/assertions/anInstanceOf/register');
require('offensive/assertions/aString/register');
require('offensive/assertions/aNumber/register');
require('offensive/assertions/inRange/register');
require('offensive/assertions/Undefined/register');
require('offensive/assertions/oneOf/register');
require('offensive/assertions/True/register');
require('offensive/assertions/False/register');

module.exports = check;

Registry.instance.addAssertion({
  'anEventTarget': {
    assert: function(value, name, check) {
      return check(value, name)
        .has.method('addEventListener')
        .and.method('removeEventListener')
        .and.method('dispatchEvent')
      ;
    },
  },
});

