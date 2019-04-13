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

Object.values = require('../polyfills/values');

var phaser = require('./phaser');
var Phase = require('../enums/phase');

describe('phaser,', function() {

  var illegalArgs = [
    { name: 'undefined', value: undefined },
    { name: 'null', value: null },
    { name: 'not element', value: [] },
  ];

  illegalArgs.forEach(function(arg) {
    describe('given '+ arg.name +' argument,', function() {
      describe('when created', function() {
        it('throws exception', function() {
          expect(function() { phaser(arg.value); }).toThrow();
        });
      });
    });
  });

  describe('given element argument,', function() {
    describe('when constructor called', function() {
      it('returns object instance', function() {
        var testedInstance = phaser(document.createElement('div'));
        expect(testedInstance).toBeDefined();
      });
    });
  });

  var phaseChanges = [
    { title: 'just after creation', phase: null, nextPhase: 'before-transition' },
    { title: 'in "before-transition" phase', phase: 'before-transition', nextPhase: 'during-transition' },
    { title: 'in "during-transition" phase', phase: 'during-transition', nextPhase: 'after-transition' },
    { title: 'in "after-transition" phase', phase: 'after-transition', nextPhase: null },
  ];

  phaseChanges.forEach(function(arg, i) {
    describe('when '+ arg.title, function() {
      arg.phase = arg.phase === null ? null: 'ht-'+ arg.phase;
      arg.nextPhase = arg.nextPhase === null ? null: 'ht-'+ arg.nextPhase;

      var htElement = null;
      var testedInstance = null;
      beforeEach(function() {
        htElement = document.createElement('div');
        testedInstance = phaser(htElement);
        for (var j = 0; j !== i; ++j) {
          testedInstance.nextPhase();
        }
      });

      it('is in "'+ arg.phase +'" phase', function() {
        expect(testedInstance.getPhase()).toBe(arg.phase);
      });

      it('calling #startTransition() moves to "before-transition" phase', function() {
        testedInstance.startTransition();
        expect(testedInstance.getPhase()).toBe('ht-before-transition');
      });

      it('calling #startTransition() adds "before-transition" class to element', function() {
        testedInstance.startTransition();
        expect(htElement.classList.contains('ht-before-transition')).toBe(true);
      });

      it('calling #nextPhase() moves to "'+ arg.nextPhase +'" phase', function() {
        testedInstance.nextPhase();
        expect(testedInstance.getPhase()).toBe(arg.nextPhase);
      });

      Object.values(Phase).forEach(function(phase) {
        if (phase === arg.phase) {
          it('has element with class "'+ phase +'"', function() {
            expect(htElement.classList.contains(phase)).toBe(true);
          });
        } else {
          it('has element without class "'+ phase +'"', function() {
            expect(htElement.classList.contains(phase)).toBe(false);
          });
        }
      });
    });
  });

  describe('given transition end trigger attached,', function() {
    var testedInstance = null;
    var triggerElement = null;
    beforeEach(function() {
      var phaserElement = document.createElement('div');
      triggerElement = document.createElement('trigger');
      phaserElement.appendChild(triggerElement);
      testedInstance = phaser(phaserElement);
      testedInstance.addPhaseTrigger(triggerElement, 'transform');
    });

    describe('when transitionend event fires,', function() {
      beforeEach(function() {
        triggerElement.dispatchEvent(new TransitionEvent('transitionend', triggerElement, 'transform'));
      });

      it('moves to next phase', function() {
        expect(testedInstance.getPhase()).toEqual('ht-before-transition');
      });
    });

    describe('after detaching trigger,', function() {
      beforeEach(function() {
        testedInstance.removePhaseTrigger(triggerElement);
      });

      describe('when transitionend event fires,', function() {
        beforeEach(function() {
          triggerElement.dispatchEvent(new TransitionEvent('transiontionend', triggerElement, 'transform'));
        });

        it('does not move to next phase', function() {
          expect(testedInstance.getPhase()).toBeNull();
        });
      });
    });
  });
});

