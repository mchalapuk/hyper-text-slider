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

/**
 * Controls phases of CSS transitions and sets proper
 * ${link Phase phase class names} on slider element.
 *
 * Phases can be changed explicitly (see ${link Phaser.prototype.setPhase},
 * ${link Phaser.prototype.nextPhase}, ${link Phaser.prototype.startTransition})
 * or triggered by end of CSS transition on DOM elements marked as phase trigger
 * (see ${link Phaser.prototype.addPhaseTrigger}).
 *
 * > **DISCLAIMER**
 * > Hermes slider automatically sets phase change triggers on ${link Layout layout elements}
 * > of each slide and calls proper phase change methods when slider controls are being used.
 *
 * @fqn Phaser
 */
module.exports = Phaser;

var precond = require('precond');
var domCompat = require('./_dom-compat');
var Phase = require('./classnames/_phases');

/**
 * Creates Phaser.
 *
 * @param elem slider element
 */
function Phaser(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.phase = null;
  priv.listeners = [];

  var pub = {};
  bindMethods(pub, [
    getPhase,
    nextPhase,
    addPhaseListener,
    removePhaseListener,
    addPhaseTrigger,
    removePhaseTrigger,
    startTransition,
  ], priv);
  return pub;
}

/**
 * @return current phase
 */
function getPhase(priv) {
  return priv.phase;
}

/**
 * Changes current phase.
 *
 * @param phase desired phase
 */
function setPhase(priv, phase) {
  if (priv.phase !== null) {
    priv.elem.classList.remove(priv.phase);
  }
  priv.phase = phase;

  if (phase !== null) {
    priv.elem.classList.add(phase);
  }
  priv.listeners.forEach(function(listener) {
    listener(phase);
  });
}

/**
 * Add a listener for phasechange event
 *
 * @param listener listener to be added
 */
function addPhaseListener(priv, listener) {
  priv.listeners.push(listener);
}

/**
 * Removes passed listener from the phaser
 *
 * @param listener litener to be removed
 */
function removePhaseListener(priv, listener) {
  priv.listeners.splice(priv.listeners.indexOf(listener), 1);
}

/**
 * Switches phase to next one.
 */
function nextPhase(priv) {
  var phases = [ null, Phase.BEFORE_TRANSITION, Phase.DURING_TRANSITION, Phase.AFTER_TRANSITION ];
  setPhase(priv, phases[(phases.indexOf(priv.phase) + 1) % phases.length]);
}

/**
 * Starts the transition.
 *
 * @postcondition getPhase() === Phase.BEFORE_TRANSITION
 */
function startTransition(priv) {
  setPhase(priv, Phase.BEFORE_TRANSITION);
}

/**
 * Adds passed element as phase trigger.
 *
 * Phase will be automatically set to next each time transition
 * of passed property ends on passed element.
 *
 * @param elem DOM element that will be used as a phase trigger
 * @param transitionProperty CSS property that is used in the transition
 */
function addPhaseTrigger(priv, elem, transitionProperty) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  var property = transitionProperty || 'transform';
  precond.checkIsString(property, 'transitionProperty is not a String');

  if (property === 'transform') {
    // maybe a prefixed version
    property = domCompat.transformPropertyName;
  }

  elem.hermesPhaseTrigger = function(event) {
    if (event.propertyName !== property || event.target !== this) {
      return;
    }
    nextPhase(priv);
  };
  elem.addEventListener(domCompat.transitionEventName, elem.hermesPhaseTrigger);
}

/**
 * @param elem DOM element that will no longer be used as a phase trigger
 */
function removePhaseTrigger(priv, elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  precond.checkIsFunction(elem.hermesPhaseTrigger, 'no trigger found on given element');

  elem.removeEventListener(domCompat.transitionEventName, elem.hermesPhaseTrigger);
}

function bindMethods(wrapper, methods, arg) {
  methods.forEach(function(method) {
    wrapper[method.name] = method.bind(wrapper, arg);
  });
}

/*
  eslint-env node, browser
*/

