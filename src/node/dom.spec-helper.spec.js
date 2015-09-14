'use strict';

describe('Node', function() {
  describe('just after creation', function() {
    var testedNode;
    beforeEach(function() {
      testedNode = new Node('TEST');
    });

    it ('has proper node name', function() {
      expect(testedNode.nodeName).toEqual('TEST');
    });

    it ('has no child nodes', function() {
      expect(testedNode.childNodes.length).toEqual(0);
    });
  });

  describe('after adding one child node', function() {
    var testedNode;
    var childNode;
    beforeEach(function() {
      testedNode = new Node('TEST');
      childNode = new Node('CHILD');
      testedNode.appendChild(childNode);
    });

    it ('has one child node', function() {
      expect(testedNode.childNodes.length).toEqual(1);
    });

    it ('has proper child node on index 0', function() {
      expect(testedNode.childNodes[0]).toBe(childNode);
    });
  });

  describe('after adding two child nodes', function() {
    var testedNode;
    var firstChild, secondChild;
    beforeEach(function() {
      testedNode = new Node('TEST');
      firstChild = new Node('CHILD');
      testedNode.appendChild(firstChild);
      secondChild = new Node('CHILD');
      testedNode.appendChild(secondChild);
    });

    it ('has two child nodes', function() {
      expect(testedNode.childNodes.length).toEqual(2);
    });

    it ('has proper child node on index 0', function() {
      expect(testedNode.childNodes[0]).toBe(firstChild);
    });

    it ('has proper child node on index 1', function() {
      expect(testedNode.childNodes[1]).toBe(secondChild);
    });
  });
});

describe('Element,', function() {
  var testedElement;
  beforeEach(function() {
    testedElement = new Element('TEST');
  });

  describe('just after creation', function() {
    it('has proper nodeName', function() {
      expect(testedElement.nodeName).toBe('TEST');
    });

    it('with empty className', function() {
      expect(testedElement.className).toBe('');
    });

    it('with empty classList', function() {
      expect(testedElement.classList.length).toEqual(0);
    });

    it('with empty style list', function() {
      for (var key in testedElement.style) {
        expect(testedElement.style[key]).toBeNull();
      }
    });
  });

  var nobody = document.createElement('CHILD');
  var jay = document.createElement('CHILD');
  jay.className = 'jay';
  var silentBob = document.createElement('CHILD');
  silentBob.className = 'silent-bob';
  var jayAndSilentBob = document.createElement('CHILD');
  jayAndSilentBob.className = 'jay silent-bob';

  var tests = [
    {
      title: 'no children',
      children: [],
      querySelector: { '.jay': null, '.silent-bob': null },
      querySelectorAll: { '.jay': [], '.silent-bob': [] }
    }, {
      title: 'one child without className',
      children: [ nobody ],
      querySelector: { '.jay': null, '.silent-bob': null },
      querySelectorAll: { '.jay': [], '.silent-bob': [] }
    }, {
      title: 'one child without class ".jay"',
      children: [ jay ],
      querySelector: { '.jay': jay, '.silent-bob': null },
      querySelectorAll: { '.jay': [ jay ], '.silent-bob': [] }
    }, {
      title: 'two children with class ".silent-bob"',
      children: [ silentBob, silentBob ],
      querySelector: { '.jay': null, '.silent-bob': silentBob },
      querySelectorAll: { '.jay': [], '.silent-bob': [ silentBob, silentBob ] }
    }, {
      title: 'one child with class ".jay", '+
        'two children with class ".silent-bob", '+
        'four children wihout className',
      children: [ nobody, jay, nobody, silentBob, nobody, silentBob, nobody ],
      querySelector: { '.jay': jay, '.silent-bob': silentBob },
      querySelectorAll: { '.jay': [ jay ], '.silent-bob': [ silentBob, silentBob ] }
    },
  ];

  tests.forEach(function(args) {
    describe('given '+ args.title +',', function() {
      beforeEach(function() {
        args.children.forEach(function(child) {
          testedElement.appendChild(child);
        });
      });

      Object.keys(args.querySelector).forEach(function(selector) {
        var toBeFound = args.querySelector[selector];
        it('#querySelector("'+ selector +'") returns '+ toBeFound, function() {
          var found = testedElement.querySelector(selector);
          expect(found).toBe(toBeFound);
        });
      });

      Object.keys(args.querySelectorAll).forEach(function(selector) {
        var toBeFound = args.querySelectorAll[selector];
        it('#querySelectorAll("'+ selector +'") returns '+ toBeFound, function() {
          var found = testedElement.querySelectorAll(selector);
          expect(found).toEqual(toBeFound);
        });
      });
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

describe('Document', function() {
  var testedDocument;
  beforeEach(function() {
    testedDocument = new Document();
  });

  describe('#createElement produces object', function() {
    var testedElement;
    beforeEach(function() {
      testedElement = testedDocument.createElement('div');
    });

    it('wich is instance of Element', function() {
      expect(testedElement instanceof Element).toBe(true);
    });

    it('with proper nodeName', function() {
      expect(testedElement.nodeName).toBe('div');
    });
  });
});

describe('Window,', function() {
  var testedWindow;
  beforeEach(function() {
    testedWindow = new Window(new Document());
  });

  var timeoutTests = [
    {
      timeouts: { a: 100, },
      results: { a: [ 0 ], '': [], },
    },
    {
      timeouts: { a: 100, b: 200, },
      results: { ab: [ 0, 1 ], a: [ 0 ], b: [ 1 ], },
    },
    {
      timeouts: { a: 100, b: 50, },
      results: { ba: [ 0, 1 ], a: [ 0 ], b: [ 1 ], },
    },
    {
      timeouts: { a: 100, b: 100, c: 100, },
      results: { abc: [ 0, 1, 2 ], b: [ 1 ], '': [], },
    },
  ];

  timeoutTests.forEach(function(args) {
    var setCalls = Object.keys(args.timeouts).map(function(c) {
      return '#setTimeout(concat, '+ args.timeouts[c] +', '+ c +')';
    });

    describe('when after calling '+ setCalls.join(', '), function() {
      var timeoutIds;
      var timeoutsApplied;

      function concat(c) {
        timeoutsApplied += c;
      }

      beforeEach(function() {
        timeoutsApplied = '';
        timeoutIds = [];

        Object.keys(args.timeouts).forEach(function(c) {
          timeoutIds.push(testedWindow.setTimeout(concat, args.timeouts[c], c));
        });
      });

      Object.keys(args.results).forEach(function(expected) {
        var timeoutsNotRemoved = args.results[expected];

        var timeoutsToBeRemoved = [];
        Object.keys(args.timeouts).forEach(function(_, i) {
          if (timeoutsNotRemoved.indexOf(i) === -1) {
            timeoutsToBeRemoved.push(i);
          }
        });

        var clearCalls = timeoutsToBeRemoved.map(function(i) {
          return '#clearTimeout(timeoutIds['+ i +'])';
        });

        describe(clearCalls.length? 'and after calling '+ clearCalls.join(', '):
          'and not clearing any timeouts', function() {

          beforeEach(function() {
            timeoutsToBeRemoved.forEach(function(i) {
              testedWindow.clearTimeout(timeoutIds[i]);
            });
          });

          it('then results string is "'+ expected +'"', function() {
            testedWindow.$applyTimeouts();
            expect(timeoutsApplied).toEqual(expected);
          });
        });
      });
    });
  });
});

describe('global.document', function() {
  it('is instance of Document', function() {
    expect(document instanceof Document).toBe(true);
  });
});

describe('global.window', function() {
  it('is instance of Window', function() {
    expect(window instanceof Window).toBe(true);
  });

  it('has global.document as its document', function() {
    expect(window.document).toBe(document);
  });
});

