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

describe('DOMTokenList', function() {
  var tokenized = null;
  var testedList = null;

  beforeEach(function() {
    tokenized = { string: '' };
    testedList = new DOMTokenList(tokenized, 'string');
  });

  describe('just after creation', function() {
    it('is os length 0', function() {
      expect(testedList.length).toEqual(0);
    });
  });

  describe('after adding one token', function() {
    beforeEach(function() {
      testedList.add('token0');
    });

    it('is of length 1', function() {
      expect(testedList.length).toEqual(1);
    });

    it('added token can be found with #contains', function() {
      expect(testedList.contains('token0')).toBe(true);
    });

    it('not added token can not be found with #contains', function() {
      expect(testedList.contains('token1')).toBe(false);
    });

    it('tokenized string contains added token', function() {
      expect(tokenized.string).toEqual('token0');
    });
  });

  describe('after adding second token', function() {
    beforeEach(function() {
      testedList.add('token0');
      testedList.add('token1');
    });

    it('is of length 2', function() {
      expect(testedList.length).toEqual(2);
    });

    it('both added tokens can be found with #contains', function() {
      expect(testedList.contains('token0')).toBe(true);
      expect(testedList.contains('token1')).toBe(true);
    });

    it('not added token can not be found with #contains', function() {
      expect(testedList.contains('token2')).toBe(false);
    });

    it('tokenized string contains both added tokens', function() {
      expect(tokenized.string).toEqual('token0 token1');
    });
  });

  describe('after removing first token', function() {
    beforeEach(function() {
      testedList.add('token0');
      testedList.add('token1');
      testedList.remove('token0');
    });

    it('is of length 1', function() {
      expect(testedList.length).toEqual(1);
    });

    it('not removed token can be found with #contains', function() {
      expect(testedList.contains('token1')).toBe(true);
    });

    it('removed token can not be found with #contains', function() {
      expect(testedList.contains('token0')).toBe(false);
    });

    it('tokenized string does not contain removed token', function() {
      expect(tokenized.string).toEqual('token1');
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

