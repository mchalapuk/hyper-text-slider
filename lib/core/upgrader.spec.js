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
var Option = require('../enums/option');
var Transition = require('../enums/transition');
var Pattern = require('../enums/pattern');
var Common = require('../enums/common');

describe('upgrader,', function() {
  describe('constructed with empty slider', function() {
    var testedElement = null;
    var testedUpgrader = null;

    beforeEach(function() {
      testedElement = createElement('div', Common.SLIDER_SHORT);
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

      it('then slider contains left arrow', function() {
        var arrow = testedElement.querySelector('.ht-layout--arrow-left');
        expect(arrow).not.toBe(null);
        expect(arrow.classList.contains('ht-layout--arrow')).toBe(true);
      });
      it('then slider contains right arrow', function() {
        var arrow = testedElement.querySelector('.ht-layout--arrow-right');
        expect(arrow).not.toBe(null);
        expect(arrow.classList.contains('ht-layout--arrow')).toBe(true);
      });

      it('then slider element contains dots container', function() {
        expect(testedElement.querySelector('.ht-layout--dots')).not.toBe(null);
      });
    });
  });

  describe('constructed with a slider containing one slide', function() {
    var testedElement = null;
    var testedUpgrader = null;

    beforeEach(function() {
      testedElement = createElement('div', Common.SLIDER_SHORT);
      testedElement.appendChild(createElement('div'));
      testedUpgrader = upgrader(testedElement);
    });

    describe('after upgrading the slide,', function() {
      beforeEach(function() {
        testedUpgrader.start();

        var evt = new AnimationEvent('animationstart', 'htSlideInserted');
        testedElement.childNodes[0].dispatchEvent(evt);
        testedElement.childNodes[0].dispatchEvent(evt);
      });

      it('then slide contains default transition class', function() {
        expect(testedElement.childNodes[0].classList.contains(Transition.ZOOM_OUT_IN)).toBe(true);
        expect(testedElement.childNodes[0].classList.contains(Transition.BG_ZOOM_IN_OUT)).toBe(true);
      });
      it('then slide contains default theme classes', function() {
        expect(testedElement.childNodes[0].classList.contains(Theme.WHITE)).toBe(true);
        expect(testedElement.childNodes[0].classList.contains(Theme.BASIC_ARROWS)).toBe(true);
        expect(testedElement.childNodes[0].classList.contains(Theme.RESPONSIVE_ARROWS)).toBe(true);
        expect(testedElement.childNodes[0].classList.contains(Theme.HOVER_OPAQUE_ARROWS)).toBe(true);
        expect(testedElement.childNodes[0].classList.contains(Theme.BASIC_DOTS)).toBe(true);
        expect(testedElement.childNodes[0].classList.contains(Theme.HOVER_OPAQUE_DOTS)).toBe(true);
      });

      it('then slider element contains 1 dot', function() {
        expect(testedElement.querySelector('.ht-layout--dots')
          .querySelectorAll('.ht-layout--dot').length).toEqual(1);
      });
    });
  });

  describe('constructed with a slider with black theme '+
      'and two slides, one with white theme,', function() {
    var testedElement = null;
    var testedUpgrader = null;

    beforeEach(function() {
      testedElement = createElement('div', Common.SLIDER_SHORT, Theme.BLACK);
      testedElement.appendChild(createElement('div'));
      testedElement.appendChild(createElement('div', Theme.WHITE));
      testedUpgrader = upgrader(testedElement);
    });

    describe('after calling start,', function() {
      beforeEach(function() {
        testedUpgrader.start();
      });

      it('theme class names are removed from slider element', function() {
        expect(testedElement.className.match(Pattern.THEME)).toBe(null);
      });

      describe('and upgrading all slides,', function() {
        beforeEach(function() {
          testedElement.childNodes.forEach(function(slideElement) {
            slideElement.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
            slideElement.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
          });
        });

        it('adds theme from the slider to slide without theme', function() {
          expect(testedElement.childNodes[0].classList.contains(Theme.BLACK)).toBe(true);
        });
        it('then slide doesn\'t contain default theme', function() {
          expect(testedElement.childNodes[0].classList.contains(Theme.WHITE)).toBe(false);
        });
        it('doesn\'t add theme from the slider to slide with theme', function() {
          expect(testedElement.childNodes[1].classList.contains(Theme.BLACK)).toBe(false);
        });
      });
    });
  });

  describe('constructed with a slider with a 2 transitions '+
      'and two slides, one with another transition,', function() {
    var testedElement = null;
    var testedUpgrader = null;

    beforeEach(function() {
      testedElement = createElement('div', Common.SLIDER_SHORT,
          'ht-transition--test', 'ht-transition--test2');
      testedElement.appendChild(createElement('div'));
      testedElement.appendChild(createElement('div', Theme.WHITE, 'ht-transition--test3'));
      testedUpgrader = upgrader(testedElement);
    });

    describe('after calling start,', function() {
      beforeEach(function() {
        testedUpgrader.start();
      });

      it('transition class names are removed from slider element', function() {
        expect(testedElement.className.match(Pattern.TRANSITION)).toBe(null);
      });

      describe('and upgrading all slides,', function() {
        beforeEach(function() {
          testedElement.childNodes.forEach(function(slideElement) {
            slideElement.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
            slideElement.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
          });
        });

        it('adds transitions from the slider to slide without a transition', function() {
          expect(testedElement.childNodes[0].classList.contains('ht-transition--test')).toBe(true);
          expect(testedElement.childNodes[0].classList.contains('ht-transition--test2')).toBe(true);
        });
        it('no slide contains default transition', function() {
          expect(testedElement.childNodes[0].classList.contains(Transition.ZOOM_OUT_IN)).toBe(false);
          expect(testedElement.childNodes[1].classList.contains(Transition.ZOOM_OUT_IN)).toBe(false);
          expect(testedElement.childNodes[0].classList.contains(Transition.BG_ZOOM_IN_OUT)).toBe(false);
          expect(testedElement.childNodes[1].classList.contains(Transition.BG_ZOOM_IN_OUT)).toBe(false);
        });
        it('doesn\'t add trantition from the slider to slide with a transition', function() {
          expect(testedElement.childNodes[1].classList.contains('ht-transition--test')).toBe(false);
          expect(testedElement.childNodes[1].classList.contains('ht-transition--test2')).toBe(false);
        });
      });
    });
  });

  var groupTests = [
    [ Common.DEFAULTS, [ Option.DEFAULTS ] ],
    [ Option.DEFAULTS, [ Option.AUTOPLAY, Option.ARROW_KEYS ] ],
  ];

  groupTests.forEach(function(params) {
    var group = params[0];
    var expectedClasses = params[1];

    describe('with containing "'+ group +'"', function() {
      var testedElement = null;
      var testedUpgrader = null;
      beforeEach(function() {
        testedElement = createElement(group);
        testedElement.appendChild(createElement());
        testedElement.appendChild(createElement());
        testedUpgrader = upgrader(testedElement);
      });

      describe('when after calling #start', function() {
        beforeEach(function() {
          testedUpgrader.start();

          testedElement.childNodes.forEach(function(child) {
            child.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
            child.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
          });
          window.$applyTimeouts();
        });

        expectedClasses.forEach(function(className) {
          it('then it has "'+ className +'" class', function() {
            expect(testedElement.classList.contains(className)).toBe(true);
          });
        });
      });
    });
  });

  var slideGroupTests = [
    [ Theme.BASIC_CONTROLS, [ Theme.BASIC_ARROWS, Theme.BASIC_DOTS ] ],
    [ Theme.HOVER_VISIBLE_CONTROLS, [ Theme.HOVER_VISIBLE_ARROWS, Theme.HOVER_VISIBLE_DOTS ] ],
    [ Theme.HOVER_OPAQUE_CONTROLS, [ Theme.HOVER_OPAQUE_ARROWS, Theme.HOVER_OPAQUE_DOTS ] ],
  ];

  slideGroupTests.forEach(function(params) {
    var group = params[0];
    var expectedClasses = params[1];

    describe('with one slide containing "'+ group +'"', function() {
      var testedElement = null;
      var testedUpgrader = null;
      beforeEach(function() {
        testedElement = createElement();
        testedElement.appendChild(createElement(group));
        testedUpgrader = upgrader(testedElement);
      });

      describe('when after calling #start', function() {
        beforeEach(function() {
          testedUpgrader.start();

          testedElement.childNodes.forEach(function(child) {
            child.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
            child.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
          });
          window.$applyTimeouts();
        });

        expectedClasses.forEach(function(className) {
          it('then it has "'+ className +'" class', function() {
            expect(testedElement.childNodes[0].classList.contains(className)).toBe(true);
          });
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
    max-nested-callbacks: 0
 */

/*
  global createElement
 */

