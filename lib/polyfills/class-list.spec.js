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

var applyPolyfill = require('./class-list');

describe('ElementClass.prototype.classList polyfill,', function() {
  var ElementClass = null;

  beforeEach(function() {
    ElementClass = function Constructor() {
      this.className = '';
    };
  });

  describe('when called on prototype containing classList', function() {
    beforeEach(function() {
      ElementClass.prototype.classList = {};
    });

    it('does nothing', function() {
      var original = ElementClass.prototype.classList;
      applyPolyfill(ElementClass);
      expect(ElementClass.prototype.classList).toBe(original);
    });
  });

  describe('when called on prototype without classList', function() {
    beforeEach(function() {
      applyPolyfill(ElementClass);
    });

    it('should create classList getter', function() {
      expect(ElementClass.prototype.hasOwnProperty('classList')).toBe(true);
    });

    it('getting classList directly from prototype should throw error', function() {
      expect(function() { return ElementClass.prototype.classList; }).toThrow(new Error(
            '\'get classList\' called on an object that does not implement interface Element.'));
    });

    it('getting classList from instance should return an object', function() {
      var instance = new ElementClass();
      expect(instance.classList).toEqual(jasmine.any(Object));
    });

    it('getting classList from instance twice should return the same object', function() {
      var instance = new ElementClass();
      expect(instance.classList).toBe(instance.classList);
    });

    it('adding a class to classList results in this class written in className property', function() {
      var instance = new ElementClass();
      instance.classList.add('test');
      expect(instance.className).toBe('test');
    });

    it('adding a class to className results in this class contained in classList', function() {
      var instance = new ElementClass();
      instance.className = 'test';
      expect(instance.classList.contains('test')).toBe(true);
    });
  });
});

