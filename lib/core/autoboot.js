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

var boot = require('./boot');
var Common = require('../enums/common');
var check = require('../utils/check');

module.exports = autoboot;

/**
 * Calls ${link boot} with passed element if it contains ${link Common.AUTOBOOT} option.
 *
 * @params {Element} containerElement element that will be passed to ${link boot}
 */
function autoboot(containerElement) {
  check(containerElement, 'containerElement').is.anInstanceOf(Element);

  if (containerElement.classList.contains(Common.AUTOBOOT)) {
    boot(containerElement);
  }
}

