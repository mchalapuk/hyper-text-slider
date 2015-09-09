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
      arg.phase = (arg.phase === null ? null: 'hermes-'+ arg.phase);
      arg.nextPhase = (arg.nextPhase === null ? null: 'hermes-'+ arg.nextPhase);

      var hermesElement;
      var testedInstance;
      beforeEach(function() {
        hermesElement = document.createElement('div');
        testedInstance = hermes(hermesElement);
        for (var j = 0; j !== i; ++j) {
          testedInstance.nextPhase();
        }
      });

      it('is in "'+ arg.phase +'" phase', function() {
        expect(testedInstance.getPhase()).toBe(arg.phase);
      });

      it('calling #startTransition() moves to "before-transition" phase', function() {
        testedInstance.startTransition();
        expect(testedInstance.getPhase()).toBe('hermes-before-transition');
      });

      it('calling #startTransition() adds "before-transition" class to element', function() {
        testedInstance.startTransition();
        expect(hermesElement.classList.contains('hermes-before-transition')).toBe(true);
      });

      it('calling #nextPhase() moves to "'+ arg.nextPhase +'" phase', function() {
        testedInstance.nextPhase();
        expect(testedInstance.getPhase()).toBe(arg.nextPhase);
      });

      values(hermes.Phase).forEach(function(phase) {
        if (phase === arg.phase) {
          it('has element with class "'+ phase +'"', function() {
            expect(hermesElement.classList.contains(phase)).toBe(true);
          });
        } else {
          it('has element without class "'+ phase +'"', function() {
            expect(hermesElement.classList.contains(phase)).toBe(false);
          });
        }
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

function values(object) {
  var retVal = [];
  for (var key in object) {
    retVal.push(object[key]);
  }
  return retVal;
}

