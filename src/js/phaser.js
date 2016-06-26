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
 * This class controls phases of CSS transitions by setting proper
 * ${link Phase phase class names} on slider element.
 *
 * It is an internally used by the {$link Slider}, but it can be used on any other DOM element
 * that require explicit control (from JavaScript) of CSS transitions.
 * To better illustrate how Phaser works, contents of a slide with `zoom-in-out` transition
 * will be used as an example throughout this documentation.
 *
 * There are 3 phases of a transition. Each phase is identified by a ${link Phase CSS class name}
 * that is set by the Phaser on the container DOM element. Transitions are as follows.
 *
 *  1. When transition is started (${link Slider} invokes ${link Phaser.prototype.startTransition}),
 *    ${link Phase.BEFORE_TRANSITION} class name is set on container DOM element. This phase
 *    is used to prepare all DOM elements inside a container element. In case of slide's content,
 *    `opacity` is set to `0` and `transform` is set to `scale(1.15)`. Slide is invisible
 *    and slightly zoomed-in. This phase lasts for 1 millisecond.
 *  2. After 1 millisecond, next phase (${link Phase.DURING_TRANSITION}) is automatically started.
 *    This is when all animation happens. Contents of current slide fading away
 *    (`opacity:0; transform:scale(1);`) and next slide is fading-in
 *    (`opacity:1; transform:scale(1.35);`). This phase last long (typically for seconds).
 *    Time varies depending on the transition being used.
 *  3. After animation is done, Phaser sets the phase to ${link Phase.AFTER_TRANSITION}.
 *    There is a possibility of altering CSS in this phase (e.g. slight change of font color),
 *    but in zoom-in-out there is no style change after transition.
 *
 * For all automatic phase changes to work, one of DOM elements that have transition specified
 * must be added to the phaser as a phase trigger (see ${link Phaser.prototype.addPhaseTrigger}).
 * ${link Phaser.prototype.nextPhase} is called each time a transition on a phase trigger ends.
 * During its startup, {$link Slider} sets phase change triggers on ${link Layout layout elements}
 * (background and contents) of each slide and calls proper phase change methods when slider
 * controls are being used.
 *
 * @fqn Phaser
 */
module.exports = Phaser;

var Phase = require('./classnames/_phases');
var domCompat = require('./_dom-compat');
var precond = require('precond');

/**
 * Creates Phaser.
 *
 * This constructor has no side-effects. This means that no ${link Phase phase class name} is set
 * after calling it. For phaser to start doing some work, ${link Phaser.prototype.setPhase}
 * or ${link Phaser.prototype.startTransition} needs to be invoked.
 *
 * @param {Element} elem container DOM element that will receive proper phase class names
 * @fqn Phaser.prototype.constructor
 */
function Phaser(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.phase = null;
  priv.listeners = [];

  var pub = {};
  var methods = [
    getPhase,
    nextPhase,
    addPhaseListener,
    removePhaseListener,
    addPhaseTrigger,
    removePhaseTrigger,
    startTransition,
  ];

  // This trick binds all methods to the public object
  // passing `priv` as the first argument to each call.
  methods.forEach(function(method) {
    pub[method.name] = method.bind(pub, priv);
  });

  return pub;
}

/**
 * A higher level method for starting a transition.
 *
 * ```javascript
 * // a shorthand for
 * phaser.setPhase(Phase.BEFORE_TRANSITION)
 * ```
 *
 * @fqn Phaser.prototype.startTransition
 */
function startTransition(priv) {
  setPhase(priv, Phase.BEFORE_TRANSITION);
}

/**
 * Switches phase to next one.
 *
 * This method is automatically invoked each time a transition ends
 * on DOM element added as phase trigger.
 *
 * @fqn Phaser.prototype.nextPhase
 */
function nextPhase(priv) {
  var phases = [ null, Phase.BEFORE_TRANSITION, Phase.DURING_TRANSITION, Phase.AFTER_TRANSITION ];
  setPhase(priv, phases[(phases.indexOf(priv.phase) + 1) % phases.length]);
}

/**
 * Changes current phase.
 *
 * Invoking this method will result in setting CSS class name of requested phase on container
 * element.
 *
 * @param {String} phase desired phase
 * @fqn Phaser.prototype.setPhase
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
 * Adds passed element as phase trigger.
 *
 * Phase will be automatically set to next each time transition
 * of passed property ends on passed element.
 *
 * @param {Element} elem DOM element that will be used as a phase trigger
 * @param {String} transitionProperty CSS property that is used in the transition
 * @fqn Phaser.prototype.addPhaseTrigger
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
 * Adds a listener that will be notified on phase changes.
 *
 * It is used by the ${link Slider} to change styles of dots representing slides.
 *
 * @param {Function} listener listener to be added
 * @fqn Phaser.prototype.addPhaseListener
 */
function addPhaseListener(priv, listener) {
  priv.listeners.push(listener);
}

/**
 * Removes passed element from phase triggers.
 *
 * @param {Element} elem DOM element that will no longer be used as a phase trigger
 * @fqn Phaser.prototype.removePhaseTrigger
 */
function removePhaseTrigger(priv, elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  precond.checkIsFunction(elem.hermesPhaseTrigger, 'no trigger found on given element');

  elem.removeEventListener(domCompat.transitionEventName, elem.hermesPhaseTrigger);
}

/**
 * Removes passed listener from the phaser.
 *
 * @param {Function} listener listener to be removed
 * @fqn Phaser.prototype.removePhaseListener
 */
function removePhaseListener(priv, listener) {
  priv.listeners.splice(priv.listeners.indexOf(listener), 1);
}

/**
 * Returns a class name of the current phase.
 *
 * @return {String} current phase
 * @fqn Phaser.prototype.getPhase
 */
function getPhase(priv) {
  return priv.phase;
}

/*
  eslint-env node, browser
*/

