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
 * It is an internal used by the ${link Slider}, but it can be used on any other DOM element
 * that require explicit control (from JavaScript) of CSS transitions.
 * To better illustrate how Phaser works, contents of a slide with `zoom-in-out` transition
 * will be used as an example throughout this documentation.
 *
 * There are 3 phases of a transition. Each phase is identified by a ${link Phase phase class name}
 * that is set by the Phaser on the container DOM element. Transitions are as follows.
 *
 *  1. When transition is started, ${link Phase.BEFORE_TRANSITION} class name is set on container
 *    DOM element. This phase is used to prepare all DOM elements inside a container element.
 *    In case of slide's content, `opacity` is set to `0` and `transform` is set to `scale(1.15)`.
 *    Slide is invisible and slightly zoomed-in. This phase lasts for 1 millisecond.
 *  2. After 1 millisecond, next phase (${link Phase.DURING_TRANSITION}) is automatically started.
 *    This is when all animation happens. Contents of current slide fading away
 *    (`opacity:0; transform:scale(1);`) and next slide is fading-in
 *    (`opacity:1; transform:scale(1.35);`). This phase last long (typically seconds).
 *    Time varies depending on transition being used.
 *  3. After animation is done, Phaser sets the phase to ${link Phase.AFTER_TRANSITION}.
 *    There is a possibility of altering CSS in this phase (e.g. slight change of font color),
 *    but in zoom-in-out there is no style change after transition.
 *
 * For all automatic phase changes to work, one of DOM elements that have transition specified
 * must be added to the phaser as a phase trigger (see ${link Phaser.prototype.addPhaseTrigger}).
 * Each time a transition on a phase trigger ends, ${link Phaser.prototype.nextPhase} method
 * is called. During its startup, ${link Slider} sets phase change triggers on ${link Layout
 * layout elements} (background and contents) of each slide and calls proper phase change methods
 * when slider controls are being used.
 *
 * > **NOTE**
 * >
 * > Implementation based on `window.setTimeout` function instead of `transitionend` event could
 * > be simpler, but implementing a transition would have to involve JavaScript programming (now
 * > it's purely declarative, CSS-only). Besides, using `window.setTimeout` would also mean using
 * > `window.requestAnimationFrame` as timeout can pass without any rendering, which could result
 * > in wrong animation (or no animation at all).
 *
 * @fqn Phaser
 */
module.exports = Phaser;

var Phase = require('../enums/phase');
var feature = require('../utils/detect-features');
var check = require('../utils/check');

var PHASE_VALUES = [ null, Phase.BEFORE_TRANSITION, Phase.DURING_TRANSITION, Phase.AFTER_TRANSITION ];

/**
 * Creates Phaser.
 *
 * This constructor has no side-effects. This means that no ${link Phase phase class name}
 * is set on given **element** and no eventlistener is set after calling it. For phaser to start
 * doing some work, ${link Phaser.prototype.setPhase}, ${link Phaser.prototype.startTransition}
 * or ${link Phaser.prototype.addPhaseTrigger} must be invoked.
 *
 * @param {Element} element container DOM element that will receive proper phase class names
 * @fqn Phaser.prototype.constructor
 */
function Phaser(element) {
  check(element, 'element').is.anInstanceOf(Element)();

  var priv = {};
  priv.elem = element;
  priv.phase = null;
  priv.listeners = [];
  priv.phaseTriggers = new MultiMap();
  priv.started = false;

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
  setPhase(priv, PHASE_VALUES[(PHASE_VALUES.indexOf(priv.phase) + 1) % PHASE_VALUES.length]);
}

/**
 * Changes current phase.
 *
 * Invoking this method will result in setting CSS class name
 * of requested phase on container element.
 *
 * @param {String} phase desired phase
 * @fqn Phaser.prototype.setPhase
 */
function setPhase(priv, phase) {
  check(phase, 'phase').is.oneOf(PHASE_VALUES)();
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
  maybeStart(priv);
}

/**
 * Adds passed target to phase triggers.
 *
 * Phase will be automatically set to next each time a `transitionend` event of matching
 * **target** and **propertyName** bubbles up to Phaser's container element.
 *
 * @param {Node} target (typically DOM Element) that will trigger next phase when matched
 * @param {String} propertyName will trigger next phase when matched (optional, defaults to 'transform')
 * @precondition **target** has container element as ancestor (see ${link Phaser.prototype.constructor})
 * @precondition given pair of **target** and **propertyName** is not already a phase trigger
 *
 * @fqn Phaser.prototype.addPhaseTrigger
 */
function addPhaseTrigger(priv, target, propertyName) {
  check(target, 'target').is.anEventTarget();
  var property = propertyName || 'transform';
  check(property, 'property').is.aString();

  if (property === 'transform') {
    property = feature.transformPropertyName;
  }
  priv.phaseTriggers.put(property, target);
  maybeStart(priv);
}

/**
 * Adds a listener that will be notified on phase changes.
 *
 * It is used by the ${link Slider} to change styles of dots representing slides.
 *
 * @param {Function} listener listener to be added
 *
 * @fqn Phaser.prototype.addPhaseListener
 */
function addPhaseListener(priv, listener) {
  priv.listeners.push(check(listener, 'listener').is.aFunction());
}

/**
 * Removes passed target from phase triggers.
 *
 * @param {Node} target that will no longer be used as a phase trigger
 * @param {String} transitionProperty that will no longer be a trigger (optional, defaults to 'transform')
 * @precondition given pair of **target** and **propertyName** is registered as phase trigger
 *
 * @fqn Phaser.prototype.removePhaseTrigger
 */
function removePhaseTrigger(priv, target, propertyName) {
  var property = propertyName || 'transform';
  check(property, 'property').is.aString();
  var triggerElements = priv.phaseTriggers.get(property);
  check(target, 'target').is.instanceOf(EventTarget).and.is.oneOf(triggerElements, 'phase triggers')();

  triggerElements.splice(triggerElements.indexOf(target), 1);
}

/**
 * Removes passed listener from the phaser.
 *
 * @param {Function} listener listener to be removed
 * @fqn Phaser.prototype.removePhaseListener
 */
function removePhaseListener(priv, listener) {
  check(listener, 'listener').is.aFunction.and.is.oneOf(priv.listeners, 'registered listeners')();
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


// Attaches event listener to phasers DOM element, if phaser was not previously started.
function maybeStart(priv) {
  if (priv.started) {
    return;
  }
  priv.elem.addEventListener(feature.transitionEventName, handleTransitionEnd.bind(null, priv));
  priv.started = true;
}

// Moves to next phase if transition that ended matches one of phase triggers.
function handleTransitionEnd(priv, evt) {
  if (evt.propertyName in priv.phaseTriggers &&
      priv.phaseTriggers[evt.propertyName].indexOf(evt.target) !== -1) {
    nextPhase(priv);
  }
}

// A map of lists.
function MultiMap() {}

// Returns a list stored in **key**.
// New list is created if instance doesn't given **key**.
MultiMap.prototype.get = function(key) {
  check(key, 'key').is.aString();
  return this[key] || (this[key] = []);
};

// Adds new **value** to the list stored in **key**.
MultiMap.prototype.put = function(key, value) {
  check(key, 'key').is.aString();
  this.get(key).push(value);
};

