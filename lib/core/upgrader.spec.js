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

var Layout = require('../enums/layout');
var Flag = require('../enums/flag');
var Theme = require('../enums/theme');

describe('upgrader,', function() {
  describe('constructed with empty slider', function() {
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
          expect(testedElement.classList.contains(className)).toBe(true);
        });
      });
    });
  });

  describe('constructed with a slider containing two slides,', function() {
    var testedElement = null;
    var testedUpgrader = null;

    beforeEach(function() {
      testedElement = createElement('div', Layout.SLIDER_SHORT, Theme.BLACK);
      testedElement.appendChild(createElement('div'));
      testedElement.appendChild(createElement('div', Theme.WHITE));
      testedUpgrader = upgrader(testedElement);
    });

    describe('after calling start,', function() {
      beforeEach(function() {
        testedUpgrader.start();
      });

      it('theme class names are removed from slider element', function() {
        expect(testedElement.classList.contains(Theme.BLACK)).toBe(false);
      });

      describe('and upgrading all slides,', function() {
        beforeEach(function() {
          testedElement.childNodes.forEach(function(slideElement) {
            slideElement.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
            slideElement.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
          });
        });

        it('adds theme from the slider to slide without theme', function() {
          expect(testedElement.childNodes[0].classList.contains(Theme.BLACK)).toBe(true);
        });
        it('doesn\'t add theme from the slider to slide with theme', function() {
          expect(testedElement.childNodes[1].classList.contains(Theme.BLACK)).toBe(false);
        });
      });
    });
  });
});

/*
  eslint-env node, jasmine, browser
 */

/*
  eslint
    max-nested-callbacks: 0,
 */

/*
  global createElement
 */

