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

var upgrader = require('./upgrader');

var Layout = require('../enums/phase');
var Flag = require('../enums/flag');

describe('upgrader,', function() {
  var testedElement = null;
  var testedUpgrader = null;

  beforeEach(function() {
    testedElement = createElement('div', Layout.SLIDER_SHORT);
    testedUpgrader = upgrader(testedElement);
  });

  describe('after calling start', function() {
    beforeEach(function() {
      testedUpgrader.start();
    });

    [ Layout.SLIDER, Flag.UPGRADED ].forEach(function(className) {
      it('adds '+ className +' class name on slider element', function() {
        testedElement.classList.contains(className);
      });
    });
  });
});

/*
  eslint-env node, jasmine
 */

/*
  eslint
    max-nested-callbacks: 0,
 */

/*
  global createElement
 */
