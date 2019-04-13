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

var autoboot = require('./autoboot');
var Common = require('../enums/common');
var Flag = require('../enums/flag');

describe('autoboot', function() {
  afterEach(function() {
    window.$clearEventListeners();
  });

  var sliderElems = null;
  var bodyElem = null;

  beforeEach(function() {
    sliderElems = [
      createSliderElement(2),
      createSliderElement(2),
    ];
    bodyElem = createElement('body');
    sliderElems.forEach(function(elem) {
      bodyElem.appendChild(elem);
    });
  });

  describe('when called on element containing ht-autoboot option', function() {
    beforeEach(function() {
      bodyElem.classList.add(Common.AUTOBOOT);
      autoboot(bodyElem);

      sliderElems.forEach(function(elem) {
        elem.childNodes.forEach(function(slideElem) {
          slideElem.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
          slideElem.dispatchEvent(new AnimationEvent('animationstart', 'htSlideInserted'));
        });
      });
    });

    it('all sliders are upgraded', function() {
      sliderElems.forEach(function(elem) {
        expect(elem.classList.contains(Flag.UPGRADED)).toBe(true);
      });
    });
  });

  describe('when called on element without ht-autoboot option', function() {
    beforeEach(function() {
      autoboot(bodyElem);
    });

    it('all sliders are not upgraded', function() {
      sliderElems.forEach(function(elem) {
        expect(elem.classList.contains(Flag.UPGRADED)).toBe(false);
      });
    });
  });
});

