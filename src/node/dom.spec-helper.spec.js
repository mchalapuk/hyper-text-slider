'use strict';

describe('document', function() {
  it ('is window.document', function() {
    expect(document).toBe(window.document);
  });

  describe('#createElement produces object', function() {
    var elem;
    beforeEach(function() {
      elem = document.createElement('div');
    });

    it('wich is instance of Element', function() {
      expect(elem instanceof Element).toBe(true);
    });

    it('with proper nodeName', function() {
      expect(elem.nodeName).toBe('div');
    });

    it('with empty className', function() {
      expect(elem.className).toBe('');
    });

    it('with empty classList', function() {
      expect(elem.classList.length).toEqual(0);
    });

    it('with empty style list', function() {
      for (var key in elem.style) {
        expect(elem.style[key]).toBeNull();
      }
    });
  });
});

describe('DOMTokenList', function() {
  var tokenized;
  var testedList;
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

describe('TransitionEndEvent', function() {
  var targetElement;
  var testedEvent;
  beforeEach(function() {
    targetElement = document.createElement('div');
    testedEvent = new TransitionEndEvent(targetElement, 'property');
  });

  it('contains proper event type', function() {
    expect(testedEvent.type).toBe('transitionend');
  });

  it('contains proper target element', function() {
    expect(testedEvent.target).toBe(targetElement);
  });

  it('contains proper property name', function() {
    expect(testedEvent.propertyName).toBe('property');
  });
});

