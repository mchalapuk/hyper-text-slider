'use strict';

var hermes = require('./hermes');

describe('hermes,', function() {

  var illegalArgs = [
    { name: 'undefined', value: undefined, },
    { name: 'null', value: null, },
    { name: 'not element', value: [], },
  ];

  illegalArgs.forEach(function(arg) {
    describe('given '+ arg.name +' argument,', function() {
      describe('when created', function() {
        it('throws exception', function() {
          expect(function() { hermes(arg.value); }).toThrow();
        });
      });
    });
  });

  describe('given element argument,', function() {
    describe('when constructor called', function() {
      it('returns object instance', function() {
        var testedInstance = hermes(document.createElement('div'));
        expect(testedInstance).toBeDefined();
      });
    });
  });

  var phaseChanges = [
    { title: 'just after creation', phase: null, nextPhase: 'before-transition', },
    { title: 'in "before-transition" phase', phase: 'before-transition', nextPhase: 'during-transition', },
    { title: 'in "during-transition" phase', phase: 'during-transition', nextPhase: 'after-transition', },
    { title: 'in "after-transition" phase', phase: 'after-transition', nextPhase: null, },
  ];

  phaseChanges.forEach(function(arg, i) {
    describe('when '+ arg.title, function() {
      var testedInstance;
      beforeEach(function() {
        testedInstance = hermes(document.createElement('div'));
        for (var j = 0; j !== i; ++j) {
          testedInstance.nextPhase();
        }
      });

      it('is in "'+ arg.phase +'" phase', function() {
        if (arg.phase !== null) {
          arg.phase = 'hermes-'+ arg.phase;
        }
        expect(testedInstance.getPhase()).toBe(arg.phase);
      });

      it('calling #startTransition() moves to "before-transition" phase', function() {
        testedInstance.startTransition();
        expect(testedInstance.getPhase()).toBe('hermes-before-transition');
      });

      it('calling #nextPhase() moves to "'+ arg.nextPhase +'" phase', function() {
        testedInstance.nextPhase();
        if (arg.nextPhase !== null) {
          arg.nextPhase = 'hermes-'+ arg.nextPhase;
        }
        expect(testedInstance.getPhase()).toBe(arg.nextPhase);
      });
    });
  });

  describe('given transition end trigger attached,', function() {
    var testedInstance;
    var triggerElement;
    beforeEach(function() {
      testedInstance = hermes(document.createElement('div'));
      triggerElement = document.createElement('trigger');
      testedInstance.addPhaseChangeTrigger(triggerElement);
    });

    describe('when transitionend event fires on trigger', function() {
      beforeEach(function() {
        triggerElement.dispatchEvent(new TransitionEndEvent(triggerElement, 'transform'));
      });

      it('moves to next phase', function() {
        expect(testedInstance.getPhase()).toEqual('hermes-before-transition');
      });
    });

    describe('after detaching trigger', function() {
      beforeEach(function() {
        testedInstance.removePhaseChangeTrigger(triggerElement);
      });

      describe('when transitionend event fires on trigger', function() {
        beforeEach(function() {
          triggerElement.dispatchEvent(new TransitionEndEvent(triggerElement, 'transform'));
        });

        it('does not move to next phase', function() {
          expect(testedInstance.getPhase()).toBeNull();
        });
      });
    });
  });
});

