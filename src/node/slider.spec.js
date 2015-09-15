'use strict';

var slider = require('./slider');

describe('slider', function() {

  var illegalArgs = [
    { name: 'undefined', value: undefined, },
    { name: 'null', value: null, },
    { name: 'not element', value: [], },
    { name: 'empty element', value: document.createElement('div'), },
  ];

  illegalArgs.forEach(function(arg) {
    describe('given '+ arg.name +' argument,', function() {
      describe('when created', function() {
        it('throws exception', function() {
          expect(function() { slider(arg.value); }).toThrow();
        });
      });
    });
  });

  describe('given element argument with one alide as child node,', function() {
    var element;
    beforeEach(function() {
      element = document.createElement('div');
      var slide = document.createElement('div');
      slide.className = 'hermes-layout--slide';
      element.appendChild(slide);
    });

    describe('when constructor called', function() {
      it('returns object instance', function() {
        var testedInstance = slider(element);
        expect(testedInstance).toBeDefined();
      });
    });
  });
});

