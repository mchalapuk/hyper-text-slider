'use strict';

var slider = require('./slider');

describe('Slider', function() {

  var illegalArgs = [
    { name: 'undefined', value: undefined, },
    { name: 'null', value: null, },
    { name: 'not element', value: [], },
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

  describe('given element argument,', function() {
    describe('when constructor called', function() {
      it('returns object instance', function() {
        var testedInstance = slider(document.createElement('div'));
        expect(testedInstance).toBeDefined();
      });
    });
  });


});

