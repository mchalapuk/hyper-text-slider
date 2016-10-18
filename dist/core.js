(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var autoboot = require('./core/autoboot');

/**
 * During project build, this script is compiled to `dist/hermes.js`,
 * which contains ES5 code that can be run in all modern browsers.
 * It is to be used only when programming in vanilla-browser style.
 * When using nodejs-based javascript preprocessor, it's better to load
 * hermes module and call ${link boot} function from client code.
 */
window.addEventListener('load', function() {
  autoboot(document.body);
});

/*
  eslint-env node, browser
 */


},{"./core/autoboot":2}],2:[function(require,module,exports){
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

var boot = require('./boot');
var Option = require('../enums/option');
var check = require('../utils/check');

module.exports = autoboot;

/**
 * Calls ${link boot} with passed element if it contains ${link Option.AUTOBOOT} option.
 *
 * @params {Element} containerElement element that will be passed to ${link boot}
 */
function autoboot(containerElement) {
  check(containerElement, 'containerElement').is.anInstanceOf(Element);

  if (containerElement.classList.contains(Option.AUTOBOOT)) {
    boot(containerElement);
  }
}

/*
  eslint-env node, browser
*/


},{"../enums/option":11,"../utils/check":16,"./boot":3}],3:[function(require,module,exports){
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

var Slider = require('./slider');
var Option = require('../enums/option');
var Layout = require('../enums/layout');
var check = require('../utils/check');

module.exports = boot;

/**
 * Default Hermes boot procedure.
 *
 * For each element with ${link Layout.SLIDER} class name found in passed container
 * (typically document's `<body>`):
 *
 *  1. Adds ${link Option options class names} found on container element,
 *  1. Creates ${link Slider} object,
 *  2. Invokes its ${link Slider.prototype.start} method.
 *
 * If you are using browserify, you may want to call this function at some point...
 *
 * ```javascript
 * var hermes = require('hermes-slider');
 * hermes.boot(document.body);
 * ```
 *
 * ...or even consider implementing bootup by yourself.
 *
 * @param {Element} containerElement element that contains sliders in (not necessarily immediate) children
 * @return {Array<Slider>} array containing all created ${link Slider} instances
 *
 * @see Option.AUTOBOOT
 * @fqn boot
 */
function boot(containerElement) {
  check(containerElement, 'containerElement').is.anInstanceOf(Element);

  var containerOptions = getEnabledOptions(containerElement);
  var sliderElems = concatUnique(
      [].slice.call(containerElement.querySelectorAll('.'+ Layout.SLIDER)),
      [].slice.call(containerElement.querySelectorAll('.'+ Layout.SLIDER_SHORT))
      );

  var sliders = sliderElems.map(function(elem) {
    containerOptions.forEach(function(option) {
      if (elem.classList.contains(option)) {
        return;
      }
      elem.classList.add(option);
    });

    return new Slider(elem);
  });

  sliders.forEach(function(slider) { slider.start(); });
  return sliders;
}

// finds option class names on passed element
function getEnabledOptions(element) {
  var retVal = [];
  Object.values(Option).forEach(function(option) {
    if (element.classList.contains(option) && option !== Option.AUTOBOOT) {
      retVal.push(option);
    }
  });
  return retVal;
}

function concatUnique(unique, candidate) {
  return unique.concat(candidate.filter(function(element) { return unique.indexOf(element) === -1; }));
}

/*
  eslint-env node, browser
*/


},{"../enums/layout":9,"../enums/option":11,"../utils/check":16,"./slider":6}],4:[function(require,module,exports){
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
  check(element, 'element').is.anInstanceOf(Element);

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
  check(phase, 'phase').is.oneOf(PHASE_VALUES);
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
  check(target, 'target').is.instanceOf(EventTarget).and.is.oneOf(triggerElements, 'phase triggers');

  triggerElements.splice(triggerElements.indexOf(target), 1);
}

/**
 * Removes passed listener from the phaser.
 *
 * @param {Function} listener listener to be removed
 * @fqn Phaser.prototype.removePhaseListener
 */
function removePhaseListener(priv, listener) {
  check(listener, 'listener').is.aFunction.and.is.oneOf(priv.listeners, 'registered listeners');
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

/*
  eslint-env node, browser
*/


},{"../enums/phase":13,"../utils/check":16,"../utils/detect-features":17}],5:[function(require,module,exports){
/*!

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

var check = require('../utils/check');

/**
 * Fired by the slider when currently visible slide changes.
 *
 * @see Slider.prototype.on
 * @fqn SlideChangeEvent
 */
module.exports = SlideChangeEvent;

/**
 * Creates SlideChangeEvent.
 *
 * @param {Number} from index of a previous slide
 * @param {Number} to index of current slide
 * @fqn SlideChangeEvent.prototype.constructor
 */
function SlideChangeEvent(fromIndex, toIndex) {
  check(fromIndex, 'fromIndex').is.aNumber();
  check(toIndex, 'toIndex').is.aNumber();

  var pub = Object.create(SlideChangeEvent.prototype);

  /**
   * Index of previous slide.
   *
   * @type Number
   * @access read-only
   * @fqn SlideChangeEvent.prototype.fromIndex
   */
  pub.fromIndex = fromIndex;

  /**
   * Index of current slide.
   *
   * @type Number
   * @access read-only
   * @fqn SlideChangeEvent.prototype.toIndex
   */
  pub.toIndex = toIndex;

  return pub;
}

SlideChangeEvent.prototype = {

  /**
   * Always set to 'slideChange'.
   *
   * @type String
   * @access read-only
   * @fqn SlideChangeEvent.prototype.eventName
   */
  eventName: 'slideChange',

  /**
   * Slider instance in which slide has changed.
   *
   * @type Slider
   * @access read-only
   * @fqn SlideChangeEvent.prototype.target
   */
  target: null,
};

/*
  eslint-env node
 */



},{"../utils/check":16}],6:[function(require,module,exports){
/*!

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

var phaser = require('./phaser');
var upgrader = require('./upgrader');
var slidechange = require('./slide-change-event');
var DOM = require('../utils/dom');
var check = require('../utils/check');

/**
 * > **NOTE**
 * >
 * > Hermes JavaScript API should be used only when specific initialization or integration
 * > with other parts of the website is required. In other (simpler) cases please consider
 * > using [declarative API](class-names.md).
 *
 * ### Example
 *
 * ```javascript
 * // browserify is supported
 * var hermes = require('hermes-slider');
 *
 * window.addEventListener('load', function() {
 *   var slider = new hermes.Slider(document.getElementById('my-slider'));
 *   slider.start();
 * });
 * ```
 *
 * @fqn Slider
 */
module.exports = Slider;

// constants

var Layout = require('../enums/layout');
var Option = require('../enums/option');
var Marker = require('../enums/marker');
var Flag = require('../enums/flag');
var Pattern = require('../enums/pattern');

var EVENT_NAMES = [ 'slideChange' ];

// public

/**
 * Constructs the slider.
 *
 * @param {Element} elem DOM element for the slider
 *
 * @fqn Slider.prototype.constructor
 */
function Slider(elem) {
  check(elem, 'elem').is.anInstanceOf(Element);

  var priv = {};
  priv.elem = elem;
  priv.transitions = [];
  priv.phaser = phaser(elem);
  priv.slides = [];
  priv.upgrader = upgrader(elem);
  priv.listeners = {};
  priv.tempClasses = [];
  priv.fromIndex = 1;
  priv.toIndex = 0;
  priv.started = false;

  var pub = {};

  /**
   * Array containing all slide elements.
   *
   * @type Array
   * @access read-only
   *
   * @fqn Slider.prototype.slides
   */
  pub.slides = priv.slides;

  /**
   * Index of currently active slide.
   *
   * Set to `null` if ${link Slider.prototype.start} was not called on this slider.
   *
   * @type Number
   * @access read-write
   *
   * @fqn Slider.prototype.currentIndex
   */
  pub.currentIndex = null;
  Object.defineProperty(pub, 'currentIndex', {
    get: function() { return priv.slides.length !== 0? priv.toIndex: null; },
    set: partial(moveTo, priv),
  });

  /**
   * Currently active slide element.
   *
   * Set to `null` if ${link Slider.prototype.start} was not called on this slider.
   *
   * @type Element
   * @access read-write
   *
   * @fqn Slider.prototype.currentSlide
   */
  pub.currentSlide = null;
  Object.defineProperty(pub, 'currentSlide', {
    get: function() { return priv.slides.length !== 0? priv.slides[priv.toIndex]: null; },
    set: function() { throw new Error('read only property! please use currentIndex instead'); },
  });

  bindMethods(pub, [
    start,
    moveTo,
    moveToNext,
    moveToPrevious,
    on,
    removeListener,
  ], priv);

  priv.pub = pub;
  return pub;
}

/**
 * Upgrades DOM elements and shows the first slide.
 *
 * Starting procedure involves manipuilating DOM and waiting for changes to be visible on the
 * screen, therefore slider will not be started immediately after returning from this call.
 * After all slides are upgraded and visible on the screen, given **callback** will be called
 * by the slider. At that time it's safe to use all features of the slider.
 *
 * ```js
 * slider.start(function() {
 *   slider.currentIndex = 1;
 * });
 * ```
 *
 * @param {Function} callback that will be called after all slides are upgraded
 * @precondition ${link Slider.prototype.start} was not called on this slider
 * @postcondition calling ${link Slider.prototype.start} again will throw exception
 * @see ${link Option.AUTOBOOT}
 *
 * @fqn Slider.prototype.start
 */
function start(priv, callback) {
  check(priv.started, 'slider.started').is.False();
  check(callback, 'callback').is.either.aFunction.or.Undefined();

  priv.startCallback = callback || noop;

  window.addEventListener('keydown', partial(keyBasedMove, priv), false);
  priv.elem.addEventListener('click', partial(clickBasedMove, priv), false);

  priv.upgrader.onSlideUpgraded = acceptSlide.bind(null, priv);
  priv.upgrader.start();
  priv.phaser.addPhaseListener(partial(onPhaseChange, priv));

  on(priv, 'slideChange', changeDot.bind(null, priv));
  priv.started = true;
}

/**
 * Moves slider to next slide.
 *
 * @precondition ${link Slider.prototype.start} was called on this slider
 * @see ${link Option.AUTOPLAY}
 *
 * @fqn Slider.prototype.moveToNext
 */
function moveToNext(priv) {
  moveTo(priv, (priv.toIndex + 1) % priv.slides.length);
}

/**
 * Moves slider previous slide.
 *
 * @precondition ${link Slider.prototype.start} was called on this slider
 *
 * @fqn Slider.prototype.moveToPrevious
 */
function moveToPrevious(priv) {
  moveTo(priv, (priv.toIndex - 1 + priv.slides.length) % priv.slides.length);
}

/**
 * Moves slider slide of given index.
 *
 * @param {Number} index index of the slide that slider will be moved to
 * @precondition ${link Slider.prototype.start} was called on this slider
 *
 * @fqn Slider.prototype.moveTo
 */
function moveTo(priv, index) {
  check(priv.started, 'slider.started').is.True();
  check(index, 'index').is.inRange(0, priv.slides.length);

  var toIndex = index <= priv.slides.length? index % priv.slides.length: index;
  if (priv.toIndex === toIndex) {
    return;
  }

  removeTempClasses(priv);
  removeMarkers(priv);

  priv.fromIndex = priv.toIndex;
  priv.toIndex = toIndex;

  addMarkers(priv);
  addTempClasses(priv);

  priv.phaser.startTransition();
  emitEvent(priv, slidechange(priv.fromIndex, priv.toIndex));
}

/**
 * Registers a listener on given eventName.
 *
 * @param {String} eventName name of event
 * @param {Function} listener a function
 * @postcondition given listener will be notified about current slide changes
 * @fqn Slider.prototype.on
 */
function on(priv, eventName, listener) {
  check(eventName, 'eventName').is.aString.and.oneOf(EVENT_NAMES);
  check(listener, 'listener').is.aFunction();

  getListeners(priv, eventName).push(listener);
}

/**
 * Unregisters a listener from given eventName.
 *
 * @param {String} eventName name of event
 * @param {Function} listener a function
 * @precondition given listener was previously passed to ${link Slider.prototype.on}
 * @postcondition given listener will no longer be notified about current slide changes
 * @fqn Slider.prototype.removeListener
 */
function removeListener(priv, eventName, listener) {
  check(eventName, 'eventName').is.aString.and.oneOf(EVENT_NAMES);
  var listeners = getListeners(priv, eventName);
  check(listener, 'listener').is.aFunction.and.is.oneOf(listeners, 'registered listeners');

  listeners.splice(listeners.indexOf(listener), 1);
}

// private

// initialization functions

function acceptSlide(priv, slideElement) {
  slideElement.classList.add(Flag.UPGRADED);
  insertSlide(priv, slideElement);

  priv.phaser.addPhaseTrigger(slideElement.querySelector('.'+ Layout.CONTENT));

  if (priv.slides.length === 1) {
    priv.startCallback.call(null, priv.pub);
    // moving this to next tick is required in chromium for some reason
    window.setTimeout(moveToFirstSlide.bind(null, priv), 1);
  }
}

function insertSlide(priv, slideElement) {
  var domIndex = [].indexOf.call(priv.elem.childNodes, slideElement);
  var index = 0;

  for (var i = 0; i < priv.slides.length; ++i) {
    var next = priv.slides[i];
    var nextDomIndex = [].indexOf.call(priv.elem.childNodes, next);
    if (nextDomIndex > domIndex) {
      break;
    }
    index += 1;
  }

  priv.slides.splice(index, 0, slideElement);
}

function moveToFirstSlide(priv) {
  var firstSlide = priv.slides[priv.toIndex];

  firstSlide.classList.add(Marker.SLIDE_TO);
  addTempClasses(priv);
  priv.phaser.startTransition();

  emitEvent(priv, slidechange(priv.fromIndex, priv.toIndex));
}

// transition functions

function removeMarkers(priv) {
  var fromSlide = priv.slides[priv.fromIndex];
  var toSlide = priv.slides[priv.toIndex];
  fromSlide.classList.remove(Marker.SLIDE_FROM);
  toSlide.classList.remove(Marker.SLIDE_TO);
}

function addMarkers(priv) {
  var fromSlide = priv.slides[priv.fromIndex];
  var toSlide = priv.slides[priv.toIndex];
  fromSlide.classList.add(Marker.SLIDE_FROM);
  toSlide.classList.add(Marker.SLIDE_TO);
}

function removeTempClasses(priv) {
  priv.tempClasses.forEach(function(className) {
    priv.elem.classList.remove(className);
  });
  priv.tempClasses = [];
}

function addTempClasses(priv) {
  var currentSlide = priv.slides[priv.toIndex];

  priv.tempClasses = (currentSlide.id !== null? [ 'hermes-slide-id-'+ currentSlide.id ]: [])
    .concat(DOM.findClassNames(currentSlide, Pattern.TRANSITION))
    .concat(DOM.findClassNames(currentSlide, Pattern.THEME))
    ;

  priv.tempClasses.forEach(function(className) {
    priv.elem.classList.add(className);
  });
}

function onPhaseChange(priv, phase) {
  if (phase === 'hermes-after-transition' && priv.elem.classList.contains(Option.AUTOPLAY)) {
    moveToNext(priv);
  }
}

function clickBasedMove(priv, event) {
  var target = event.target;
  if (!target.classList.contains(Layout.CONTROLS)) {
    return;
  }

  if (target.classList.contains(Layout.ARROW_LEFT)) {
    moveToPrevious(priv);
    return;
  }
  if (target.classList.contains(Layout.ARROW_RIGHT)) {
    moveToNext(priv);
    return;
  }
  if (target.classList.contains(Layout.DOT)) {
    moveTo(priv, [].indexOf.call(target.parentNode.childNodes, target));
    return;
  }

  throw new Error('unknown controls element clicked');
}

function keyBasedMove(priv, event) {
  if (!priv.elem.classList.contains(Option.ARROW_KEYS)) {
    return;
  }
  switch (event.key) {
    case 'ArrowLeft': moveToPrevious(priv); break;
    case 'ArrowRight': moveToNext(priv); break;
    default: break;
  }
}

function getListeners(priv, eventName) {
  return priv.listeners[eventName] || (priv.listeners[eventName] = []);
}

function emitEvent(priv, evt) {
  evt.target = priv.pub;

  getListeners(priv, evt.eventName)
    .forEach(function(listener) { listener(evt); });
}

function changeDot(priv) {
  var dotsElement = priv.elem.querySelector('.'+ Layout.DOTS);
  var active = dotsElement.querySelector('.'+ Flag.ACTIVE);
  if (active) {
    active.classList.remove(Flag.ACTIVE);
  }
  dotsElement.childNodes[priv.toIndex].classList.add(Flag.ACTIVE);
}

// utilities

function bindMethods(wrapper, methods, arg) {
  methods.forEach(function(method) {
    wrapper[method.name] = method.bind(wrapper, arg);
  });
}

function partial(func) {
  return func.bind.apply(func, [ null ].concat([].slice.call(arguments, 1)));
}

function noop() {
  // noop
}

/*
  eslint-env node, browser
 */

/*
  eslint
    complexity: [2, 5],
 */


},{"../enums/flag":8,"../enums/layout":9,"../enums/marker":10,"../enums/option":11,"../enums/pattern":12,"../utils/check":16,"../utils/dom":18,"./phaser":4,"./slide-change-event":5,"./upgrader":7}],7:[function(require,module,exports){
/*!

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

module.exports = Upgrader;

var feature = require('../utils/detect-features');
var DOM = require('../utils/dom');
var check = require('../utils/check');

var Layout = require('../enums/layout');
var Flag = require('../enums/flag');
var Theme = require('../enums/theme');
var Transition = require('../enums/transition');
var Pattern = require('../enums/pattern');
var Option = require('../enums/option');

var Selector = (function() {
  var selectors = {};
  for (var name in Layout) {
    selectors[name] = '.' + Layout[name];
  }
  return selectors;
}());

var DEFAULT_THEMES = [
  Theme.WHITE,
  Theme.DEFAULT_DOTS,
  Theme.DEFAULT_ARROWS,
  Theme.RESPONSIVE_ARROWS,
  Theme.HOVER_OPAQUE_ARROWS,
];
var DEFAULT_TRANSITIONS = [
  Transition.ZOOM_OUT_IN,
  Transition.BG_ZOOM_IN_OUT,
];

function Upgrader(elem) {
  check(elem, 'elem').is.anInstanceOf(Element);

  var priv = {};
  priv.onSlideUpgraded = noop;
  priv.elem = elem;
  priv.dotsElement = null;
  priv.defaultThemes = null;
  priv.started = false;

  var pub = {};
  pub.start = start.bind(pub, priv);

  Object.defineProperty(pub, 'onSlideUpgraded', {
    set: function(callback) { priv.onSlideUpgraded = callback; },
    get: function() { return priv.onSlideUpgraded; },
    enumerable: true,
  });
  return pub;
}

function start(priv) {
  check(priv.started, 'upgrader.started').is.False();
  priv.started = true;

  priv.defaultThemes = DOM.extractClassNames(priv.elem, Pattern.THEME) || DEFAULT_THEMES;
  priv.defaultTransitions = DOM.extractClassNames(priv.elem, Pattern.TRANSITION) || DEFAULT_TRANSITIONS;

  expandOptionGroups(priv);
  createArrowButtons(priv);
  createDotButtons(priv);
  upgradeSlides(priv);

  if (!priv.elem.classList.contains(Layout.SLIDER)) {
    priv.elem.classList.add(Layout.SLIDER);
  }
  priv.elem.classList.add(Flag.UPGRADED);
}

function expandOptionGroups(priv) {
  var list = priv.elem.classList;

  if (list.contains(Option.DEFAULTS)) {
    list.add(Option.AUTOPLAY);
    list.add(Option.ARROW_KEYS);
  }
}

function createArrowButtons(priv) {
  var previousButton = create(Layout.ARROW, Layout.CONTROLS, Layout.ARROW_LEFT);
  priv.elem.appendChild(previousButton);

  var nextButton = create(Layout.ARROW, Layout.CONTROLS, Layout.ARROW_RIGHT);
  priv.elem.appendChild(nextButton);
}

function createDotButtons(priv) {
  priv.dotsElement = create(Layout.CONTROLS, Layout.DOTS);
  priv.elem.appendChild(priv.dotsElement);
}

function upgradeSlides(priv) {
  priv.elem.addEventListener(feature.animationEventName, maybeUpgradeSlide, false);

  function maybeUpgradeSlide(evt) {
    if (evt.animationName === 'hermesSlideInserted' &&
        evt.target.parentNode === priv.elem &&
        !evt.target.classList.contains(Layout.CONTROLS)) {
      upgradeSlide(priv, evt.target);
    }
  }
}

function upgradeSlide(priv, slideElement) {
  supplementClassNames(priv, slideElement);

  var contentElement = slideElement.querySelector(Selector.CONTENT);
  var backgroundElement = slideElement.querySelector(Selector.BACKGROUND);

  if (contentElement !== null && backgroundElement !== null) {
    createDot(priv, slideElement);
    priv.onSlideUpgraded.call(null, slideElement);
    return;
  }

  if (contentElement === null) {
    contentElement = createContentElement(slideElement);
    slideElement.appendChild(contentElement);
  }

  if (backgroundElement === null) {
    backgroundElement = createBackgroundElement(slideElement);
    slideElement.insertBefore(backgroundElement, contentElement);
  }

  reinsertNode(slideElement);
}

function supplementClassNames(priv, slideElement) {
  if (!slideElement.classList.contains(Layout.SLIDE)) {
    slideElement.classList.add(Layout.SLIDE);
  }
  if (!DOM.findClassNames(slideElement, Pattern.THEME)) {
    priv.defaultThemes.forEach(function(className) {
      slideElement.classList.add(className);
    });
  }
  if (!DOM.findClassNames(slideElement, Pattern.TRANSITION)) {
    priv.defaultTransitions.forEach(function(className) {
      slideElement.classList.add(className);
    });
  }
}

function createDot(priv, slideElement) {
  var dot = create(Layout.CONTROLS, Layout.DOT);
  var index = [].indexOf.call(slideElement.parentNode.childNodes, slideElement);

  var parent = priv.dotsElement;
  if (index === parent.length) {
    parent.appendChild(dot);
  } else {
    parent.insertBefore(dot, parent.childNodes[index]);
  }
}

function createContentElement(slideElement) {
  var contentElement = create(Layout.CONTENT);
  while (slideElement.childNodes.length) {
    contentElement.appendChild(slideElement.childNodes[0]);
  }
  return contentElement;
}

function createBackgroundElement() {
  return create(Layout.BACKGROUND);
}

function reinsertNode(node) {
  var parent = node.parentNode;
  var next = node.nextSibling;
  parent.removeChild(node);
  if (next) {
    parent.insertBefore(node, next);
  } else {
    parent.appendChild(node);
  }
}

function create() {
  var elem = document.createElement('div');
  elem.className = [].join.call(arguments, ' ');
  return elem;
}

function noop() {
  // noop
}

/*
  eslint-env node, browser
 */

/*
  eslint
    complexity: [2, 6],
 */


},{"../enums/flag":8,"../enums/layout":9,"../enums/option":11,"../enums/pattern":12,"../enums/theme":14,"../enums/transition":15,"../utils/check":16,"../utils/detect-features":17,"../utils/dom":18}],8:[function(require,module,exports){
/*!

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
 * They are automatically set by the slider. Flag class names MUST NOT be manipulated from
 * client HTML or JavaScript and **SHOULD be used only in client CSS**.
 *
 * @name Flag Class Names
 */
var Flag = {

  /**
   * Automatically set on slider after its upgrade.
   *
   * @fqn Flag.UPGRADED
   */
  UPGRADED: 'is-upgraded',

  /**
   * Automatically set on ${link Layout.DOT} button connected with currently active slide.
   *
   * @invariant This class is set on only one dot button.
   *
   * @fqn Flag.ACTIVE
   */
  ACTIVE: 'is-active',
};

module.exports = Flag;

/*
  eslint-env node
*/


},{}],9:[function(require,module,exports){
/*!

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
 * In most cases, most of layout classes **SHOULD not be used in client HTML**, as they are
 * automatially applied to apropriate elements during [slider's upgrade procedure](dom-upgrade.md)
 * (${link Layout.SLIDER_SHORT} is the only layout class name that MUST be applied in client HTML).
 *
 * Layout classes play following roles in slider's inner-workings.
 *  1. **role-id** - class names are used to identify element's role during slider upgrade,
 *  2. **transition** - class names must be used in definitions of CSS transitions,
 *  3. **styling** - class names are recommended for usage in slide's styling.
 *
 * @name Layout Class Names
 * @summary-column usage Usage
 * @summary-column client-html Client HTML
 */
var Layout = {

  /**
   * Alias for ${link Layout.SLIDER}.
   *
   * @usage role-id styling
   * @client-html mandatory
   *
   * @fqn Layout.SLIDER_SHORT
   */
  SLIDER_SHORT: 'hermes-slider',

  /**
   * Identifies main slider element.
   *
   * This class must be set on all slider elements in client HTML.
   * It can be used in client CSS code for styling.
   *
   * @usage role-id styling
   * @client-html mandatory
   *
   * @fqn Layout.SLIDER
   */
  SLIDER: 'hermes-layout--slider',

  /**
   * Identifies a slide.
   *
   * At least 2 slides must be defined in each slider.
   * It can be used in client CSS code for styling.
   *
   * @usage role-id styling
   * @client-html optional
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.SLIDE
   */
  SLIDE: 'hermes-layout--slide',

  /**
   * Identifies background of a slide.
   *
   * For slides in which this element is not present in slider declaration, empty background
   * element will be generated during slider upgrade. This class name must be used in all
   * definitions of background transitions.
   *
   * @usage role-id styling transition
   * @client-html optional
   * @parent-element Layout.SLIDE
   *
   * @fqn Layout.BACKGROUND
   */
  BACKGROUND: 'hermes-layout--background',

  /**
   * Identifies content of a slide.
   *
   * For slides in which this element is not present in slider declaration, it will be generated
   * during slider upgrade. Contents of a slide will be moved inside generated element. If element
   * is present in slider declaration, it must contain all contents of a slide. This class name
   * must be used in all definitions of content transitions.
   *
   * @usage role-id styling transition
   * @client-html optional
   * @parent-element Layout.SLIDE
   *
   * @fqn Layout.CONTENT
   */
  CONTENT: 'hermes-layout--content',

  /**
   * Set during upgrade on all generated controls.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.CONTROLS
   */
  CONTROLS: 'hermes-layout--controls',

  /**
   * Set during upgrade on generated arrow buttons.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.ARROW
   */
  ARROW: 'hermes-layout--arrow',

  /**
   * Set during upgrade on generated left arrow button.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.ARROW_LEFT
   */
  ARROW_LEFT: 'hermes-layout--arrow-left',

  /**
   * Set during upgrade on generated right arrow button.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.ARROW_RIGHT
   */
  ARROW_RIGHT: 'hermes-layout--arrow-right',

  /**
   * Set during upgrade on container elements that contains dot buttons.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.DOTS
   */
  DOTS: 'hermes-layout--dots',

  /**
   * Set during upgrade on each dot button element.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.DOTS
   *
   * @fqn Layout.DOT
   */
  DOT: 'hermes-layout--dot',
};

module.exports = Layout;

/*
  eslint-env node
*/


},{}],10:[function(require,module,exports){
/*!

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
 * They are automatically set on slide elements (${link Layout.SLIDE}).
 * Marker class names MUST NOT be manipulated from client HTML or JavaScript
 * and **SHOULD be used only in definitions of CSS transitions**.
 *
 * @name Transition Marker Class Names
 */
var Marker = {

  /**
   * Automatically set on previously active ${link Layout.SLIDE}.
   *
   * @invariant After starting first transition this class name is set on only one slide.
   *
   * @fqn Marker.SLIDE_FROM
   */
  SLIDE_FROM: 'hermes-slide-from',

  /**
   * Automatically set on currently active ${link Layout.SLIDE}.
   *
   * This class name is set on first slide after starting a slider
   * and then set on currently active slide each time it changes.
   *
   * @invariant After starting slider this class name is set on only one slide.
   *
   * @fqn Marker.SLIDE_TO
   */
  SLIDE_TO: 'hermes-slide-to',
};

module.exports = Marker;

/*
  eslint-env node
*/


},{}],11:[function(require,module,exports){
/*!

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
 * Option classes enable features of the slider.
 *
 * Most options are intended to be set on ${link Layout.SLIDER} element, but they can also be
 * set on document's `<body>`. Options set on `<body>` are treated as defaults for each ${link
 * Layout.SLIDER} declared on the page.
 *
 * Two categories:
 *  1. **single options** - each of which enables one feature,
 *  2. **option groups** - that adds many option classes to the slider during
 *    [upgrade](dom-upgrade.md).
 *
 * Each option class is checked by the slider in one of two ways:
 *  1. <a href='#once' id='once'>**checked once**</a> - class name should be set
 *    in client HTML, slider will check for it only once during upgrade, adding/removing class
 *    after upgrade make no effect,
 *  2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
 *    class name may be added/removed at any time, slider will check if it is set every time
 *    a decission connected with this class is made.
 *
 * @name Option Class Names
 * @summary-column checked Checked
 * @summary-column target Target Element
 */
var Option = {

  /**
   * Automatically creates ${link Slider} objects for all sliders declared on the page
   * and invokes their ${link Slider.prototype.start} methods.
   *
   * This options can be set only on `<body>` element.
   * It enabled using Hermes without any JavaScript programming.
   *
   * > ***WARNING***
   * >
   * > When using Hermes via node and broserify, this option is ignored.
   *
   * @target document's `<body>`
   * @checked once
   * @see boot
   * @see Slider.prototype.start
   *
   * @fqn Option.AUTOBOOT
   */
  AUTOBOOT: 'hermes-autoboot',

  /**
   * Adds
   * ${link Option.AUTOPLAY},
   * ${link Option.ARROW_KEYS}.
   * classes to the slider.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   *
   * @fqn Option.DEFAULTS
   */
  DEFAULTS: 'hermes-defaults',

  /**
   * Automatically moves slider to next slide.
   *
   * Slider is moved to the next after time specified in ${link Time time class name}.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked continuously
   * @see Slider.prototype.moveToNext
   *
   * @fqn Option.AUTOPLAY
   */
  AUTOPLAY: 'hermes-autoplay',

  /**
   * Adds keyboard control to slider.
   *
   * `keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
   * slide, with `RightArrow` key moves slider to next slide.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   * @see Slider.prototype.currentIndex
   *
   * @fqn Option.ARROW_KEYS
   */
  ARROW_KEYS: 'hermes-arrow-keys',
};

module.exports = Option;

/*
  eslint-env node
*/


},{}],12:[function(require,module,exports){
/*!

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
 * @name Other Class Names
 */
var Pattern = {

  /**
   * All transitions used by the slider must match this regular expression.
   *
   * During [slider's DOM upgrade](dom-upgrade.md) ${link Layout.SLIDER} element is checked
   * for presence of transition class names. Transitions declared this way will be randomly used
   * by the slider. After upgrade all declared transitions are removed from slider element and
   * added again for the duration of a transition between slides.
   *
   * Transitions may also be declared on ${link Layout.SLIDE} elements. Slider will always
   * use transition declared on slide element when moving to this slide. Transition declarations of
   * this type are [checked continuously](#continuously), therefore they may be added/removed
   * on slides at runtime (client JavaScript).
   *
   * @invariant Class name of currently running transition is set on slider element.
   *
   * @fqn Pattern.TRANSITION
   */
  TRANSITION: /hermes-transition--([^\s]+)/g,

  /**
   * All themes used by the slider must match this regular expression.
   *
   * During [slider's DOM upgrade](dom-upgrade.md) ${link Layout.SLIDER} element is checked for
   * presence of theme class names. Themes declared this way are then removed from the slider
   * and added to all slides, which have no theme specified. Themes are added again to slider's
   * element for the duration of slide being visible.
   *
   * Themes may also be declared on ${link Layout.SLIDE} elements. Theme declarations of
   * this type are [checked continuously](#continuously), therefore they may be added/removed
   * on slides at runtime (client JavaScript).
   *
   * Hermes provides very basic ${link Theme built-in themes}
   * (see [Adding Custom Themes](custom-themes.md)).
   *
   * @invariant Theme class name's of currently active slide is added to slider element.
   *
   * @fqn Pattern.THEME
   */
  THEME: /hermes-theme--([^\s]+)/g,

  /**
   * Slider keeps class name with id of current slide on ${link Layout.SLIDER} element.
   *
   * This functionality may be useful if slides other than current are to be partially visible
   * or if appearence of controls or even whole slider needs to change from one slide to another.
   *
   * @invariant Class name with id of current slide is set on slider element.
   *
   * @fqn Pattern.SLIDE_ID
   */
  SLIDE_ID: /hermes-slide-id-([^\s]+)/,
};

module.exports = Pattern;

/*
  eslint-env node
*/


},{}],13:[function(require,module,exports){
/*!

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
 * All phase classes are automatically set on slider element (${link Layout.SLIDER}).
 * They MUST NOT be manipulated from client HTML or JavaScript. They **should be used only
 * in definitions of CSS transitions**.
 *
 * @name Transition Phase Class Names
 */
var Phase = {

  /**
   * Set on slider element just before transition starts.
   *
   * This phase lasts for 1 millisecond. It exists just for the purpose of setting CSS properties
   * to initial values before transition.
   *
   * @fqn Phase.BEFORE_TRANSITION
   */
  BEFORE_TRANSITION: 'hermes-before-transition',

  /**
   * Set on slider element while transition of ${link Layout.CONTENT} element is run.
   *
   * @fqn Phase.DURING_TRANSITION
   */
  DURING_TRANSITION: 'hermes-during-transition',

  /**
   * Set on slider element after transition of ${link Layout.CONTENT} element ends.
   *
   * @fqn Phase.AFTER_TRANSITION
   */
  AFTER_TRANSITION: 'hermes-after-transition',
};

module.exports = Phase;

/*
  eslint-env node
*/


},{}],14:[function(require,module,exports){
/*!

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

/**
 * Themes make slide look god without any other styling. Their purpose is to set default styles
 * for a slide (typically background and font colors, typography and control elements).
 *
 * Multiple themes MAY be specified for each slide element (${link Layout.SLIDE}) in client HTML.
 * During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no theme specified
 * receives theme classes which were declared on the slider element (${link Layout.SLIDER}).
 * If there is no theme specified on the slider, default themes are used.
 *
 * [How to add custom theme?](custom-themes.md)
 *
 * @name Theme Class Names
 * @summary-column default Is Default Theme
 */
var Theme = {

  /**
   * White background, dark foreground elements (texts, dots, arrows).
   *
   * @default false
   * @fqn Theme.WHITE
   */
  WHITE: 'hermes-theme--white',

  /**
   * Black background, white foreground elements (texts, dots, arrows).
   *
   * @default true
   * @fqn Theme.BLACK
   */
  BLACK: 'hermes-theme--black',

  /**
   * Shows dot button for each slide.
   *
   * This theme provides basic dot visuals. In case different styling of dots is needed, either
   * extend this theme class or create your own from scratch. Extending this class may be
   * prefereable as other themes (${link Theme.BLACK}, ${link Theme.WHITE}) are compatible
   * with this one.
   *
   * @default true
   * @fqn Theme.DEFAULT_DOTS
   */
  DEFAULT_DOTS: 'hermes-theme--default-dots',

  /**
   * Shows default side arrow buttons.
   *
   * This theme provides basic arrow visuals. In case different styling of arrows is needed, either
   * extend this theme class or create your own from scratch. Extending this class may be
   * prefereable if you also want to use ${link Theme.RESPONSIVE_ARROWS}.
   *
   * @default true
   * @fqn Theme.DEFAULT_ARROWS
   */
  DEFAULT_ARROWS: 'hermes-theme--default-arrows',

  /**
   * Adds screen responsiveness to slider arrows.
   *
   * Slider controls come in 3 different layouts. Each for different range of screen width.
   *
   * 1. On wide screens arrows are located on sides out of content area,
   * 2. On mid-sized screens arrows are located on sides above content area,
   * 3. On small screens arrows are smaller and located on the bottom at the same height as dots.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.DEFAULT_ARROWS}.
   *
   * @see [Screen Responsiveness](responsiveness.md)
   * @see Slider.breakpointNarrowToNormal
   * @see Slider.breakpointNormalToWide
   *
   * @default true
   * @fqn Theme.RESPONSIVE_ARROWS
   */
  RESPONSIVE_ARROWS: 'hermes-theme--responsive-arrows',

  /**
   * Adds hover-dependent visibility change to arrows.
   *
   * Arrows become visible when mouse is hovering above the slider.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.DEFAULT_ARROWS} or custom theme that defines arrow visuals.
   *
   * @default false
   * @fqn Theme.HOVER_VISIBLE_ARROWS
   */
  HOVER_VISIBLE_ARROWS: 'hermes-theme--hover-visible-arrows',

  /**
   * Adds hover-dependent opacity change to arrows.
   *
   * Arrows become more opaque twhen mouseis hovering above the slider.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.DEFAULT_ARROWS} or custom theme that defines arrow visuals.
   *
   * @default true
   * @fqn Theme.HOVER_OPAQUE_ARROWS
   */
  HOVER_OPAQUE_ARROWS: 'hermes-theme--hover-opaque-arrows',
};

module.exports = Theme;

/*
  eslint-env node
*/


},{}],15:[function(require,module,exports){
/*!

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

/**
 * Transitions add nice animations to slide changes. Typically, one transition adds animation
 * to slide's content (${link Layout.CONTENT}) or slide's background (${link Layout.BACKGROUND}),
 * or both. Custom transitions may also animate only parts of slide's content (e.g. to display
 * some parts of the slide with a delay).
 *
 * Multiple transitions MAY be added on each slide element (${link Layout.SLIDE}) in client HTML.
 * During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no transitions
 * specified receives transitions which were declared on the slider element (${link Layout.SLIDER}).
 * If there is no transition specified on the slider, ${link Transition.ZOOM_OUT_IN}
 * and ${link Transition.BG_ZOOM_IN_OUT} are used as default.
 *
 * @name Transition Class Names
 */
var Transition = {

  /**
   * Delicate content zoom out when slide appears, zoom in when it disappears.
   *
   * @fqn Transition.ZOOM_OUT_IN
   */
  ZOOM_OUT_IN: 'hermes-transition--zoom-out-in',

  /**
   * Delicate background zoom in when slide appears, zoom out when it disappears.
   *
   * @fqn Transition.BG_ZOOM_IN_OUT
   */
  BG_ZOOM_IN_OUT: 'hermes-transition--bg-zoom-in-out',
};

module.exports = Transition;

/*
  eslint-env node
*/


},{}],16:[function(require,module,exports){
/*!

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

var check = require('offensive');
var Assertion = require('offensive/lib/model/assertion');

module.exports = check;

var customAssertions = {
  'anEventTarget': new Assertion(function(context) {
    context._push();
    context.has.method('addEventListener')
      .and.method('removeEventListener')
      .and.method('dispatchEvent')
      ;
    context._pop();
  }),
};

for (var name in customAssertions) {
  check.addAssertion(name, customAssertions[name]);
}

/*
  eslint-env node
 */

/*
  eslint
    no-invalid-this: 0,
    no-underscore-dangle: 0,
 */


},{"offensive":45,"offensive/lib/model/assertion":32}],17:[function(require,module,exports){
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

var element = document.createElement('div');
//var nameFromDomProperty = featureNameFromProperty.bind(null, element);
var nameFromCssProperty = featureNameFromProperty.bind(null, element.style);

module.exports = {
  transformPropertyName: nameFromCssProperty('transform', {
    transform: 'transform',
    OTransform: '-o-transform',
    MozTransform: '-moz-transform',
    WebkitTransform: '-webkit-transform',
  }),
  transitionEventName: nameFromCssProperty('transitionend', {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  }),
  animationEventName: nameFromCssProperty('animationstart', {
    animation: 'animationstart',
    webkitAnimation: 'webkitAnimationStart',
    MSAnimation: 'MSAnimationStart',
    MozAnimation: 'MozAnimationStart',
  }),
};

/**
 * Detects browser-specific names of browser features by checking availability
 * of browser-specific properties in given object instance.
 *
 * @param {Object} instance object that will be checked for existence of properties
 * @param {String} defaultName name used if nothing else detected (standard-compliant name)
 * @param {Object} candidateMap browser-specific properties (keys) mapped to feature names (values)
 * @return {String} value from candidateMap or defaultName
 */
function featureNameFromProperty(instance, defaultName, candidateMap) {
  for (var key in candidateMap) {
    if (typeof instance[key] !== 'undefined') {
      return candidateMap[key];
    }
  }

  console.warn('no feature name detected for '+ defaultName +' using default');
  return defaultName;
}

/*
  eslint-env node, browser
*/


},{}],18:[function(require,module,exports){
/*!

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

var check = require('../utils/check');

module.exports = {
  findClassNames: findClassNames,
  removeClassNames: removeClassNames,
  extractClassNames: extractClassNames,
};

function findClassNames(elem, pattern) {
  check(elem, 'elem').is.anInstanceOf(Element);
  check(pattern, 'pattern').is.either.anInstanceOf(RegExp).or.aString();

  var matches = elem.className.match(pattern);
  if (!matches) {
    return null;
  }

  var retVal = [];
  for (var i = 0; i < matches.length; ++i) {
    retVal.push(matches[i]);
  }
  return retVal;
}

function removeClassNames(elem, pattern) {
  check(elem, 'elem').is.anInstanceOf(Element);
  check(pattern, 'pattern').is.either.anInstanceOf(RegExp).or.aString();

  elem.className = elem.className.replace(pattern, '').replace('\s+', ' ');
}

function extractClassNames(elem, pattern) {
  check(elem, 'elem').is.anInstanceOf(Element);
  check(pattern, 'pattern').is.either.anInstanceOf(RegExp).or.aString();

  var retVal = findClassNames(elem, pattern);
  removeClassNames(elem, pattern);
  return retVal;
}

/*
  eslint-env node, browser
 */


},{"../utils/check":16}],19:[function(require,module,exports){
'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../getters');

module.exports = {
  'oneOf': new ParameterizedAssertion(function(context, set, name) {
    context._newCheck(set, 'set').is.anArray();
    context._newCheck(name, 'name').is.either.aString.or.Undefined();

    this.message = [ 'one of', name? name: '['+ set.join(', ') + ']' ];
    this.condition = isContainedInSet;

    function isContainedInSet(value) {
      return set.indexOf(value) !== -1;
    }
  }),
  'elementOf': new Alias('oneOf'),
  'containedIn': new Alias('oneOf'),

  'elementThatIs': new ParameterizedAssertion(function(context, index, assertName, condition) {
    context._newCheck(assertName, 'assertName').is.aString();
    context._newCheck(condition, 'condition').is.either.aFunction.or.anObject();

    var conditionFunction = null;
    if (typeof condition === 'object') {
      context._newCheck(condition, 'condition').has.property('isSatisfiedBy');
      conditionFunction = condition.isSatisfiedBy.bind(condition);
    } else {
      conditionFunction = condition;
    }

    this.getter = Getters.element(index);
    this.message = assertName;
    this.condition = elemSatisfiesCondition;

    function elemSatisfiesCondition(value) {
      return conditionFunction(value[index]);
    }
  }),
  'elementWhichIs': new Alias('elementThatIs'),

  'eachElementIs': new ParameterizedAssertion(function(context, assertName, condition) {
    context._newCheck(assertName, 'assertName').is.aString();
    context._newCheck(condition, 'condition').is.either.aFunction.or.anObject();
    if (typeof condition === 'object') {
      context._newCheck(condition, 'condition').has.property('isSatisfiedBy');
    }

    context._push();
    if (!context.is.anArray._result || context._value.length === 0) {
      context._pop();
      return;
    }
    context._reset();
    context._push();

    context._value.map(generateIntegers(0)).forEach(function(index) {
      if (context.elementThatIs(index, assertName, condition)._result) {
        // we don't want satisfied assertions in error message
        context._reset();
        return;
      }
      context._pop();
      noop(context._operatorContext.and);
      context._push();
    });

    context._pop(true);
    context._pop(true);
  }),
  'everyElementIs': new Alias('eachElementIs'),
  'allElements': new Alias('eachElementIs'),
  'onlyElements': new Alias('eachElementIs'),

  'onlyNumbers': new Assertion(function(context) {
    context.eachElementIs('a number', partial(isOfType, 'number'));
  }),
  'onlyStrings': new Assertion(function(context) {
    context.eachElementIs('a string', partial(isOfType, 'string'));
  }),
  'onlyObjects': new Assertion(function(context) {
    context.eachElementIs('an object', partial(isOfType, 'object'));
  }),
  'onlyFunctions': new Assertion(function(context) {
    context.eachElementIs('a function', partial(isOfType, 'function'));
  }),
  'onlyInstancesOf': new ParameterizedAssertion(function(context, Class) {
    context._newCheck(Class, 'Class').is.aFunction();
    context.eachElementIs('an instance of '+ Class.name, partial(isInstanceOf, Class));
  }),
};

function generateIntegers(startingFrom) {
  var nextValue = startingFrom;
  return function() {
    return nextValue++;
  };
}

function partial(func, arg) {
  return func.bind(null, arg);
}

function isOfType(requiredType, value) {
  return typeof value === requiredType;
}
function isInstanceOf(RequiredClass, value) {
  return value instanceof RequiredClass;
}

function noop() {
  // noop
}

/*
  eslint-env node
 */


},{"../../getters":29,"../../model/alias":31,"../../model/assertion":32,"../../model/parameterized-assertion":35}],20:[function(require,module,exports){
'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'True': new Assertion(function() {
    this.message = [ 'true' ];
    this.condition = isTrue;
  }),
  'true': new Alias('True'),

  'False': new Assertion(function() {
    this.message = [ 'false' ];
    this.condition = isFalse;
  }),
  'false': new Alias('False'),

  'truthy': new Assertion(function() {
    this.message = [ 'truthy' ];
    this.condition = isTruethy;
  }),
  'Thuthy': new Alias('truthy'),
  'thuethy': new Alias('truthy'),
  'Thuethy': new Alias('truthy'),

  'falsy': new Assertion(function() {
    this.message = [ 'falsy' ];
    this.condition = isFalsy;
  }),
  'Falsy': new Alias('falsy'),
  'falsey': new Alias('falsy'),
  'Falsey': new Alias('falsy'),
};

function isTrue(value) {
  return value === true;
}
function isFalse(value) {
  return value === false;
}

function isTruethy(value) {
  return Boolean(value);
}
function isFalsy(value) {
  return !value;
}

/*
  eslint-env node
 */


},{"../../model/alias":31,"../../model/assertion":32}],21:[function(require,module,exports){
'use strict';

Object.assign = require('../../polyfill/assign');

var nullAssertions = require('./null');
var typeAssertions = require('./type');
var propertyAssertions = require('./property');
var arrayAssertions = require('./array');
var booleanAssertions = require('./boolean');
var numberAssertions = require('./number');

module.exports = Object.assign({},
    nullAssertions, typeAssertions, propertyAssertions, arrayAssertions,
    booleanAssertions, numberAssertions
    );

/*
  eslint-env node
 */


},{"../../polyfill/assign":38,"./array":19,"./boolean":20,"./null":22,"./number":23,"./property":24,"./type":25}],22:[function(require,module,exports){
'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'Null': new Assertion(function() {
    this.message = 'null';
    this.condition = isNull;
  }),
  'null': new Alias('Null'),
  'Nil': new Alias('Null'),
  'nil': new Alias('Nil'),
  'Empty': new Assertion(function(context) {
    this.message = 'empty';

    context._push();
    context.is.either.Null.or.Undefined();
    context._pop();
  }),
  'empty': new Alias('Empty'),
};

function isNull(value) {
  return value === null;
}

/*
  eslint-env node
 */


},{"../../model/alias":31,"../../model/assertion":32}],23:[function(require,module,exports){
'use strict';

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

module.exports = {
  'greaterThan': new ParameterizedAssertion(function(context, leftBounds) {
    context._newCheck(leftBounds, 'leftBounds').is.aNumber();

    context._push();
    if (!context.is.aNumber._result) {
      context._pop();
      return;
    }
    context._reset();

    this.message = [ '>', leftBounds ];
    this.condition = function(value) {
      return value > leftBounds;
    };
    context._pop();
  }),
  'greater': new Alias('greaterThan'),
  'gt': new Alias('greaterThan'),

  'lessThan': new ParameterizedAssertion(function(context, rightBounds) {
    context._newCheck(rightBounds, 'rightBounds').is.aNumber();

    context._push();
    if (!context.is.aNumber._result) {
      context._pop();
      return;
    }
    context._reset();

    this.message = [ '<', rightBounds ];
    this.condition = function(value) {
      return value < rightBounds;
    };
    context._pop();
  }),
  'less': new Alias('lessThan'),
  'lt': new Alias('lessThan'),

  'inRange': new ParameterizedAssertion(function(context, leftBounds, rightBounds) {
    context._newCheck(leftBounds, 'leftBounds').is.aNumber();
    context._newCheck(rightBounds, 'rightBounds').is.aNumber();

    this.message = 'in range <'+ leftBounds +', '+ rightBounds+ ')';
    context._push();
    context.is.greaterThan(leftBounds - 1).and.lessThan(rightBounds);
    context._pop();
  }),
  'between': new Alias('inRange'),
};

/*
  eslint-env node
 */


},{"../../model/alias":31,"../../model/parameterized-assertion":35}],24:[function(require,module,exports){
'use strict';

Object.getPrototypeOf = require('../../polyfill/get-prototype-of');

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../getters');

module.exports = {
  // property assertions
  'property': new ParameterizedAssertion(function(context, propertyName, propertyValue) {
    context._newCheck(propertyName, 'propertyName').is.aString();

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }

    context._reset();

    this.getter = Getters.property(propertyName);
    if (typeof propertyValue !== 'undefined') {
      this.message = propertyValue;
      this.condition = function PropertyHasValue(value) {
        return value[propertyName] === propertyValue;
      };
    } else {
      this.message = 'not undefined';
      this.condition = function PropertyIsDefined(value) {
        return hasProperty(value, propertyName);
      };
    }
    context._pop();
  }),
  'field': new Alias('property'),

  'method': new ParameterizedAssertion(function(context, methodName) {
    context._newCheck(methodName, 'methodName').is.aString();

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }

    context._reset();
    this.getter = Getters.property(methodName);
    this.message = 'a function';
    this.condition = hasMethod;
    context._pop();

    function hasMethod(value) {
      return typeof value[methodName] === 'function';
    }
  }),

  // length assertions
  'length': new ParameterizedAssertion(function(context, requiredLength) {
    context._newCheck(requiredLength, 'requiredLength').is.aNumber();
    context.has.property('length', requiredLength);
  }),
  'len': new Alias('length'),
  // TODO 'lengthGT': new Alias('lengthGreaterThan'),
  // TODO 'lengthLT': new Alias('lengthLessThan'),
};

function hasProperty(object, propertyName) {
  var instance = object;
  while (instance) {
    if (instance.hasOwnProperty(propertyName)) {
      return true;
    }
    instance = Object.getPrototypeOf(instance);
  }
  return false;
}

/*
  eslint-env node
 */


},{"../../getters":29,"../../model/alias":31,"../../model/parameterized-assertion":35,"../../polyfill/get-prototype-of":39}],25:[function(require,module,exports){
'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

module.exports = {
  'aString': typeofAssertion('string'),
  'String': new Alias('aString'),
  'string': new Alias('aString'),
  'aNumber': typeofAssertion('number'),
  'Number': new Alias('aNumber'),
  'number': new Alias('aNumber'),
  'aBoolean': typeofAssertion('boolean'),
  'Boolean': new Alias('aBoolean'),
  'boolean': new Alias('aBoolean'),
  'aFunction': typeofAssertion('function'),
  'Function': new Alias('aFunction'),
  'function': new Alias('aFunction'),
  'anObject': typeofAssertion('object'),
  'Object': new Alias('anObject'),
  'object': new Alias('anObject'),
  'Undefined': typeofAssertion('undefined'),
  'undefined': new Alias('Undefined'),

  'anArray': new Assertion(function(context) {
    this.message = 'an array';

    context._push();
    context.has.method('splice').and.method('forEach');
    context._pop();
  }),
  'Array': new Alias('anArray'),
  'array': new Alias('anArray'),

  'anInstanceOf': new ParameterizedAssertion(function(context, RequiredClass) {
    context._newCheck(RequiredClass, 'RequiredClass').is.aFunction();

    this.message = 'an instance of '+ RequiredClass.name;
    this.condition = isInstanceOf;

    function isInstanceOf(value) {
      return value instanceof RequiredClass;
    }
  }),
  'instanceOf': new Alias('anInstanceOf'),
};

function typeofAssertion(requiredType) {
  function hasProperType(value) {
    return typeof value === requiredType;
  }
  return new Assertion(function() {
    this.message = getTypePrefix(requiredType) + requiredType;
    this.condition = hasProperType;
  });
}

function getTypePrefix(type) {
  return type === 'object'? 'an ': type === 'undefined'? '': 'a ';
}

/*
  eslint-env node
 */


},{"../../model/alias":31,"../../model/assertion":32,"../../model/parameterized-assertion":35}],26:[function(require,module,exports){
'use strict';

// names of context methods that will do nothing and return this
module.exports = [
  'is', 'be', 'being',
  'which', 'that',
  'to', 'from', 'under', 'over',
  'has', 'have',
  'defines', 'define',
  'contains', 'contain',
  'precondition', 'postcondition', 'invariant',
];

/*
  eslint-env node
 */


},{}],27:[function(require,module,exports){
'use strict';

var UnaryOperator = require('../../model/unary-operator');
var BinaryOperator = require('../../model/binary-operator');
var Alias = require('../../model/alias');

module.exports = {
  'and': new BinaryOperator(function() {
    this.message = 'and';
    this.apply = applyAnd;
  }),
  'of': new Alias('and'),
  'with': new Alias('and'),

  'not': new UnaryOperator(function() {
    this.message = 'not';
    this.apply = applyNot;
  }),
  'no': new Alias('not'),
  'dont': new Alias('not'),
  'doesnt': new Alias('not'),

  // either and or must be used in combination
  'either': new UnaryOperator(function(context) {
    context._push('either');
  }),
  'weather': new Alias('either'),

  'or': new BinaryOperator(function(context) {
    if (context._stackName !== 'either') {
      throw new Error('.or used without .either');
    }
    this.message = 'or';
    this.apply = applyOr;
    context._pop();
  }),
};

function applyAnd(lhs, rhs) {
  return lhs() && rhs();
}

function applyOr(lhs, rhs) {
  return lhs() || rhs();
}

function applyNot(operand) {
  return !operand();
}

/*
  eslint-env node
 */


},{"../../model/alias":31,"../../model/binary-operator":33,"../../model/unary-operator":36}],28:[function(require,module,exports){
'use strict';

Object.setPrototypeOf = require('./polyfill/set-prototype-of');

var SyntaxTreeBuilder = require('./syntax-tree-builder');
var MessageBuilder = require('./message-builder');
var AssertionRegistry = require('./registry/assertion');
var OperatorRegistry = require('./registry/operator');

var nodsl = require('./nodsl');

module.exports = CheckFactory;

function CheckFactory(assertionRegistry, operatorRegistry) {
  nodsl.check(assertionRegistry instanceof AssertionRegistry,
      'assertionRegistry must be an instance of AssertionRegistry; got ', assertionRegistry);
  nodsl.check(operatorRegistry instanceof OperatorRegistry,
      'operatorRegistry must be an instance of OperatorRegistry; got ', operatorRegistry);

  this.contextProto = {
    assertion: assertionRegistry.contextProto,
    operator: operatorRegistry.contextProto,
  };
}

CheckFactory.prototype = {
  newCheck: newCheck,
  onError: null,
};

function newCheck(value, name) {
  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

  var factory = this;
  var priv = {};

  var context = Object.create(factory.contextProto.assertion);
  context._value = value;
  context._name = name;
  context._assert = _assert;
  context._operator = _operator;
  context._newCheck = newCheck.bind(factory);

  var operatorContext = function() {
    return value;
  };
  Object.keys(context).forEach(function(key) {
    operatorContext[key] = context[key];
  });
  Object.setPrototypeOf(operatorContext, factory.contextProto.operator);

  var messageBuilder = new MessageBuilder(context);

  var readOnlyGetters = {
    '_stackName': function() { return priv.state.stackName; },
    '_result': function() { return priv.state.evaluate(); },
    '_message': messageBuilder.build.bind(messageBuilder),
  };
  defineReadOnly(context, readOnlyGetters);
  defineReadOnly(operatorContext, readOnlyGetters);

  var extendedContext = extendContext(context, [ _push, _pop, _reset ]);
  extendedContext._operatorContext = operatorContext;

  priv.state = new State();
  priv.state.syntax.onEvaluateReady = flush;

  priv.stateStack = [];
  priv.running = null;

  return context;

  // called by each assert method
  function _assert(assertionName, proto, args) {
    var assertion = Object.create(proto);
    assertion.name = assertionName;
    assertion.args = args || [];
    assertion.children = [];

    defineWriteOnly(assertion, {
      'condition': function(condition) {
        nodsl.check(typeof condition === 'function',
            '.condition must be a function; got ', condition);
        var operand = condition.bind(null, context._value);
        priv.state.syntax.addOperand(operand);
      },
    });

    run(assertion, [ extendedContext ].concat(assertion.args));

    return operatorContext;
  }

  // called by each operator method
  function _operator(operatorName, proto) {
    var operator = Object.create(proto);
    operator.name = operatorName;
    operator.children = [];

    defineWriteOnly(operator, {
      'apply': function(apply) {
        nodsl.check(typeof apply === 'function',
            '.apply must be a function; got ', apply);
        operator.addToSyntax(priv.state.syntax, apply);
      },
    });

    run(operator, [ extendedContext ]);

    return context;
  }

  // to be used inside assertions

  function _push(stackName) {
    priv.stateStack.push(priv.state);
    priv.state = new State(stackName);
    priv.state.calls = priv.running.children;
    priv.state.startIndex = priv.state.calls.length;
  }
  function _pop(force) {
    if (!priv.state.syntax.isEvaluateReady()) {
      if (!force) {
        priv.state.syntax.onEvaluateReady = pop0;
        return;
      }
      priv.state.syntax.addOperand(returnTrue);
    }
    pop0(priv.state.syntax.evaluate());
  }
  function _reset() {
    priv.state.syntax.flush();
    priv.state.calls.splice(priv.state.startIndex, priv.state.calls.length - priv.state.startIndex);
  }

  // private

  function run(operation, args) {
    priv.state.calls.push(operation);

    var previous = priv.running;
    priv.running = operation;
    operation.runInContext.apply(operation, args);
    priv.running = previous;
  }

  function pop0(evaluate) {
    priv.state = priv.stateStack.pop();
    priv.state.syntax.addOperand(evaluate);
  }

  function flush(evaluate) {
    if (!evaluate()) {
      messageBuilder.addAssertions(priv.state.calls);
      if (factory.onError) {
        factory.onError(context);
      }
    }
    // everything so far satisfied, so not needed in error message
    priv.state.calls.splice(0, priv.state.calls.length);
  }
}

// this gets pushed around alot
function State(stackName) {
  this.stackName = stackName;
  this.syntax = new SyntaxTreeBuilder();
  this.calls = [];
}
State.prototype = {
  evaluate: function() {
    return this.syntax.evaluate()();
  },
  startIndex: 0,
};

function defineReadOnly(instance, propertyGetters) {
  Object.keys(propertyGetters).forEach(function(key) {
    Object.defineProperty(instance, key, {
      get: propertyGetters[key],
      set: readOnlySetter(key),
      enumerable: true,
    });
  });
}
function defineWriteOnly(instance, propertySetters) {
  Object.keys(propertySetters).forEach(function(key) {
    Object.defineProperty(instance, key, {
      get: writeOnlySetter(key),
      set: propertySetters[key],
      enumerable: true,
    });
  });
}

function readOnlySetter(key) {
  return function() { throw new Error(key +' is read only'); };
}
function writeOnlySetter(key) {
  return function() { throw new Error(key +' is write only'); };
}


function extendContext(proto, methods) {
  var extended = Object.create(proto);
  methods.forEach(function(method) { extended[method.name] = method; });
  return extended;
}

function returnTrue() {
  return true;
}

/*
  eslint-env node
 */


},{"./message-builder":30,"./nodsl":37,"./polyfill/set-prototype-of":40,"./registry/assertion":41,"./registry/operator":43,"./syntax-tree-builder":44}],29:[function(require,module,exports){
'use strict';

// built in getters
module.exports = {
  value: {
    name: function(context) { return context._name; },
    value: function(context) { return context._value; },
  },
  property: function(propertyName) {
    return {
      name: function(context) { return context._name +'.'+ propertyName; },
      value: function(context) { return context._value[propertyName]; },
    };
  },
  element: function(index) {
    return {
      name: function(context) { return context._name +'['+ index +']'; },
      value: function(context) { return context._value[index]; },
    };
  },
};

/*
  eslint-env node
 */


},{}],30:[function(require,module,exports){
'use strict';

var Assertion = require('./model/assertion');
var UnaryOperator = require('./model/unary-operator');

var nodsl = require('./nodsl');

module.exports = MessageBuilder;

// code that builds error message is invoked only when assertion fails
// performace is not a concern here
function MessageBuilder(context) {
  var that = Object.create(MessageBuilder.prototype);
  that.context = context;
  that.assertions = [];
  return that;
}

MessageBuilder.prototype = {
  addAssertions: function addAssertions(assertions) {
    this.assertions = this.assertions.concat(assertions);
    return this;
  },

  build: function build() {
    nodsl.check(this.assertions.length !== 0, 'trying to build a message without failed assertions');

    var groupByName = groupByVariableName.bind(null, this.context);
    var toString = groupToString.bind(null, this.context);

    var grouped = this.assertions
      .reduce(replaceEmptyWithChildren, [])
      .reduce(mergeWithOperators(), [])
//      .map(tee.bind(null, console.log))
      .reduce(removeDuplicates, [])
      .reduce(groupByName, []);

    function buildMessage(builder, group) {
      return builder + toString(group);
    }

    grouped[0].operators.binary = '';
    var message = grouped.reduce(buildMessage, '');
    return message;
  },
};

function removeDuplicates(retVal, assertion) {
  var previous = retVal[retVal.length - 1];
  if (retVal.length === 0 || !equal(previous, assertion)) {
    retVal.push(assertion);
  }
  return retVal;
}

function equal(previous, next) {
  return previous.message === next.message &&
    arrayEqual(previous.args, next.args) &&
    previous.operators.unary === next.operators.unary;
}

// naive implementation
function arrayEqual(lhs, rhs) {
  return JSON.stringify(lhs) === JSON.stringify(rhs);
}

function replaceEmptyWithChildren(retVal, group) {
  if (group.message.length !== 0) {
    retVal.push(group);
  } else {
    return group.children.reduce(replaceEmptyWithChildren, retVal);
  }
  return retVal;
}

function mergeWithOperators() {
  var unary = [];
  var binary = null;

  return function(retVal, assertionOrOperator) {
    if (assertionOrOperator instanceof Assertion) {
      var assertion = assertionOrOperator;
      assertion.operators = { unary: unary, binary: binary };
      unary = [];
      binary = null;
      retVal.push(assertion);
      return retVal;
    }

    var operator = assertionOrOperator;
    if (operator instanceof UnaryOperator) {
      unary.push(operator.message);
      return retVal;
    }

    if (binary) {
      throw new Error('BUG! Two binary operators before one assertion.');
    }
    binary = operator.message;
    return retVal;
  };
}

function groupByVariableName(context, retVal, assertion) {
  var name = assertion.getter.name(context);
  var current = retVal.length === 0? createGroup(assertion): retVal.pop();
  var currentName = current.getter.name(context);
  if (name !== currentName) {
    retVal.push(current);
    current = createGroup(assertion);
  }
  var operators = operatorsToString(assertion.operators).full;
  var message = ensureArray(assertion.message).join(' ');
  current.message.push(operators + message);
  current.result &= assertion.result;
  retVal.push(current);
  return retVal;
}

function createGroup(assertion) {
  // has the same properties as assertion
  var group = {
    operators: assertion.operators,
    getter: assertion.getter,
    message: [],
    result: true,
  };
  assertion.operators = { unary: [], binary: '' };
  return group;
}

function groupToString(context, group) {
  var operators = operatorsToString(group.operators);
  if (operators.binary) {
    operators.binary = ' '+ operators.binary;
  }
  var name = group.getter.name(context);
  var conditions = group.message.join(' ');
  var value = group.getter.value(context);
  var retVal = operators.binary + name +' must be '+ operators.unary + conditions +'; got '+ value;
  return retVal;
}

function operatorsToString(operators) {
  var unary = operators.unary.join(' ');
  if (unary.length) {
    unary += ' ';
  }
  var binary = operators.binary || '';
  if (binary.length) {
    binary += ' ';
  }
  return {
    binary: binary,
    unary: unary,
    full: binary + unary,
  };
}

function ensureArray(value) {
  return value instanceof Array? value: [ value ];
}

// debugging

/* eslint-disable no-unused-vars */

function tee(func, group) {
  func(group);
  return group;
}

function pipe() {
  var pipeline = [].slice.call(arguments);

  return function(initialArg) {
    return pipeline.reduce(function(arg, filter) { return filter(arg); }, initialArg);
  };
}

/*
  eslint-env node
 */


},{"./model/assertion":32,"./model/unary-operator":36,"./nodsl":37}],31:[function(require,module,exports){
'use strict';

module.exports = Alias;

function Alias(originalName) {
  var that = Object.create(Alias.prototype);
  that.aliasFor = originalName;
  return that;
}

Alias.prototype = {};

/*
  eslint-env node
 */


},{}],32:[function(require,module,exports){
'use strict';

var getters = require('../getters');

module.exports = Assertion;

function Assertion(assertFunction) {
  var that = Object.create(Assertion.prototype);
  that.runInContext = assertFunction;
  return that;
}

Assertion.prototype = {
  getter: getters.value,
  message: [],
};

/*
  eslint-env node
 */


},{"../getters":29}],33:[function(require,module,exports){
'use strict';

var Operator = require('./operator');

module.exports = BinaryOperator;

function BinaryOperator(operatorFunction) {
  var that = Object.create(BinaryOperator.prototype);
  that.runInContext = operatorFunction;
  return that;
}

BinaryOperator.prototype = new Operator();

BinaryOperator.prototype.addToSyntax = addBinaryOperator;

function addBinaryOperator(syntax, applyFunction) {
  syntax.addBinaryOperator(applyFunction);
}

/*
  eslint-env node
 */


},{"./operator":34}],34:[function(require,module,exports){
'use strict';

module.exports = Operator;

function Operator() {
}

Operator.prototype = {
  message: [],
};

/*
  eslint-env node
 */


},{}],35:[function(require,module,exports){
'use strict';

var Assertion = require('./assertion');

module.exports = ParameterizedAssertion;

function ParameterizedAssertion(assertFunction) {
  var that = Object.create(ParameterizedAssertion.prototype);
  that.runInContext = assertFunction;
  return that;
}

ParameterizedAssertion.prototype = new Assertion();

/*
  eslint-env node
 */


},{"./assertion":32}],36:[function(require,module,exports){
'use strict';

var Operator = require('./operator');

module.exports = UnaryOperator;

function UnaryOperator(operatorFunction) {
  var that = Object.create(UnaryOperator.prototype);
  that.runInContext = operatorFunction;
  return that;
}

UnaryOperator.prototype = new Operator();

UnaryOperator.prototype.addToSyntax = addUnaryOperator;

function addUnaryOperator(syntax, applyFunction) {
  syntax.addUnaryOperator(applyFunction);
}

/*
  eslint-env node
 */


},{"./operator":34}],37:[function(require,module,exports){
'use strict';

module.exports = {
  check: noDslCheck,
};

function noDslCheck(condition) {
  if (!condition) {
    throw new Error([].slice.call(arguments, 1).join(''));
  }
}

/*
  eslint-env node
 */


},{}],38:[function(require,module,exports){
'use strict';

module.exports = Object.assign || polyfill;

function polyfill(target) {
  var sources = [].slice.call(arguments, 1);
  return sources.reduce(assign0, target);
}

function assign0(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */


},{}],39:[function(require,module,exports){
'use strict';

module.exports = originalOrPolyfill();

function originalOrPolyfill() {
  try {
    Object.getPrototypeOf(0);
    // didn't throw for non-object - ES6
    return Object.getPrototypeOf;
  } catch (e) {
    // ES5
    return polyfill;
  }
}

function polyfill(instance) {
  return instance.__proto__;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */


},{}],40:[function(require,module,exports){
'use strict';

module.exports = Object.setPrototypeOf || polyfill;

function polyfill(instance, prototype) {
  instance.__proto__ = prototype;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */


},{}],41:[function(require,module,exports){
'use strict';

var Assertion = require('../model/assertion');
var ParameterizedAssertion = require('../model/parameterized-assertion');
var Alias = require('../model/alias');

var NoopRegistry = require('./noop');

var nodsl = require('../nodsl');

module.exports = AssertionRegistry;

function AssertionRegistry(noopRegistry) {
  nodsl.check(noopRegistry instanceof NoopRegistry,
      'noopRegistry must be an instance of NoopRegistry; got ', noopRegistry);

  this.contextProto = Object.create(noopRegistry.contextProto);
  this.registered = {};
}

AssertionRegistry.prototype = {
  add: function addAssertion(name, assertion) {
    if (assertion instanceof Alias) {
      var aliased = this.registered[assertion.aliasFor];
      nodsl.check(typeof aliased === 'object',
          'assertion of name ', assertion.aliasFor, ' pointed by alias ', name, ' not found');
      this.add(name, aliased);
      return;
    }

    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
    nodsl.check(!(name in this.registered), 'assertion of name ', name, ' already registered');
    nodsl.check(assertion instanceof Assertion, 'assertion must be an instance of Assertion');

    this.registered[name] = assertion;

    if (assertion instanceof ParameterizedAssertion) {
      Object.defineProperty(this.contextProto, name, {
        value: assert(name, assertion),
        enumerable: true,
      });
    } else {
      Object.defineProperty(this.contextProto, name, {
        get: assert(name, assertion),
        enumerable: true,
      });
    }
  },
};

function assert(name, assertion) {
  return function() {
    var args = [].slice.call(arguments);

    try {
      return this._assert(name, assertion, args);

    } catch (e) {
      if (e.name === 'ContractError') {
        // just to shorten the stack trace
        var error = new Error(e.message);
        error.name = 'ContractError';
        error.cause = e;
        throw error;
      }
      throw e;
    }
  };
}

/*
  eslint-env node
 */


},{"../model/alias":31,"../model/assertion":32,"../model/parameterized-assertion":35,"../nodsl":37,"./noop":42}],42:[function(require,module,exports){
'use strict';

var nodsl = require('../nodsl');

module.exports = NoopRegistry;

function NoopRegistry() {
  this.contextProto = {};
}

NoopRegistry.prototype = {
  add: function addNoop(name) {
    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

    Object.defineProperty(this.contextProto, name, {
      get: returnThis,
      enumerable: true,
    });
  },
};

function returnThis() {
  return this;
}

/*
  eslint-env node
 */


},{"../nodsl":37}],43:[function(require,module,exports){
'use strict';

var Operator = require('../model/operator');
var BinaryOperator = require('../model/binary-operator');
var Alias = require('../model/alias');

var NoopRegistry = require('./noop');
var AssertionRegistry = require('./assertion');

var nodsl = require('../nodsl');

module.exports = OperatorRegistry;

function OperatorRegistry(noopRegistry, assertionRegistry) {
  nodsl.check(noopRegistry instanceof NoopRegistry,
      'noopRegistry must be an instance of NoopRegistry; got ', noopRegistry);
  nodsl.check(assertionRegistry instanceof AssertionRegistry,
      'assertionRegistry must be an instance of AssertionRegistry; got ', assertionRegistry);

  this.contextProto = Object.create(noopRegistry.contextProto);
  this.assertionProto = assertionRegistry.contextProto;
  this.registered = {};
}

OperatorRegistry.prototype = {
  add: function addOperator(name, operator) {
    if (operator instanceof Alias) {
      var aliased = this.registered[operator.aliasFor];
      nodsl.check(typeof aliased === 'object',
          'operator of name ', operator.aliasFor, ' pointed by alias ', name, ' not found');
      this.add(name, aliased);
      return;
    }

    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
    nodsl.check(!(name in this.registered), 'operator of name ', name, ' already registered');
    nodsl.check(operator instanceof Operator, 'operator must be an instance of Operator');

    this.registered[name] = operator;

    // only binary operators in operatorProto
    var actualProto = operator instanceof BinaryOperator? this.contextProto: this.assertionProto;

    Object.defineProperty(actualProto, name, {
      get: function() { return this._operator(name, operator); },
      enumerable: true,
    });
  },
};

/*
  eslint-env node
 */


},{"../model/alias":31,"../model/binary-operator":33,"../model/operator":34,"../nodsl":37,"./assertion":41,"./noop":42}],44:[function(require,module,exports){
'use strict';

var nodsl = require('./nodsl');

module.exports = SyntaxTreeBuilder;

function SyntaxTreeBuilder() {
  this.binary = null;
  this.unary = null;
  this.operands = [];
  this.onEvaluateReady = noop;
}

SyntaxTreeBuilder.prototype = {
  addOperand: function(operand) {
    nodsl.check(typeof operand === 'function', 'operand must be a function; got ', operand);

    if (this.unary) {
      this.operands.push(this.unary.bind(null, operand));
      this.unary = null;
    } else {
      this.operands.push(operand);
    }

    if (this.binary) {
      this.operands = [ cacheResult(this.binary.bind(null, this.operands[0], this.operands[1])) ];
      this.binary = null;
    } else {
      nodsl.check(this.operands.length === 1, 'expected binary operator; got operand');
    }

    this.onEvaluateReady(this.evaluate());
  },

  addBinaryOperator: function(operator) {
    nodsl.check(typeof operator === 'function',
        'operator must be a function; got ', operator);
    nodsl.check(this.binary === null,
        'expected operand or unary operator after binary operator; got binary operator');
    nodsl.check(this.operands.length === 1,
        'expected operand or unary operator; got binary operator');

    this.binary = operator;
  },
  addUnaryOperator: function(operator) {
    nodsl.check(typeof operator === 'function',
        'operator must be a function; got ', operator);
    nodsl.check(this.unary === null, 'expected operand after unary operator; got unary operator');
    this.unary = operator;
  },

  isEvaluateReady: function() {
    return this.operands.length === 1 && this.binary === null;
  },
  evaluate: function() {
    nodsl.check(this.unary === null, 'trying to evaluate with dangling unary operator');
    nodsl.check(this.binary === null, 'trying to evaluate with dangling binary operator');
    nodsl.check(this.operands.length === 1, 'trying to evaluate an empty expression');
    return this.operands[0];
  },

  flush: function() {
    nodsl.check(this.unary === null, 'trying to flush with dangling unary operator');
    nodsl.check(this.binary === null, 'trying to flush with dangling binary operator');
    this.operands = [];
  },
};

function noop() {
  // noop
}

function cacheResult(evaluate) {
  var strategy = loader;

  function loader() {
    var result = evaluate();
    strategy = function getter() {
      return result;
    };
    return result;
  }

  return strategy;
}

/*
  eslint-env node
 */


},{"./nodsl":37}],45:[function(require,module,exports){
'use strict';

var CheckFactory = require('./lib/check-factory');

var NoopRegistry = require('./lib/registry/noop');
var AssertionRegistry = require('./lib/registry/assertion');
var OperatorRegistry = require('./lib/registry/operator');

var builtInNoops = require('./lib/built-ins/noops');
var builtInAssertions = require('./lib/built-ins/assertions');
var builtInOperators = require('./lib/built-ins/operators');

var noopRegistry = new NoopRegistry();
builtInNoops.forEach(function(name) {
  noopRegistry.add(name);
});

var assertionRegistry = new AssertionRegistry(noopRegistry);
Object.keys(builtInAssertions).forEach(function(name) {
  assertionRegistry.add(name, builtInAssertions[name]);
});

var operatorRegistry = new OperatorRegistry(noopRegistry, assertionRegistry);
Object.keys(builtInOperators).forEach(function(name) {
  operatorRegistry.add(name, builtInOperators[name]);
});

var offensive = new CheckFactory(assertionRegistry, operatorRegistry);
offensive.onError = throwContractError;

var defensive = new CheckFactory(assertionRegistry, operatorRegistry);

module.exports = offensive.newCheck.bind(offensive);
module.exports.defensive = defensive.newCheck.bind(defensive);
module.exports.addNoop = noopRegistry.add.bind(noopRegistry);
module.exports.addAssertion = assertionRegistry.add.bind(assertionRegistry);
module.exports.addOperator = operatorRegistry.add.bind(operatorRegistry);

function throwContractError(context) {
  var error = new Error(context._message);
  error.name = 'ContractError';
  throw error;
}

/*
  eslint-env node
 */


},{"./lib/built-ins/assertions":21,"./lib/built-ins/noops":26,"./lib/built-ins/operators":27,"./lib/check-factory":28,"./lib/registry/assertion":41,"./lib/registry/noop":42,"./lib/registry/operator":43}]},{},[1]);
