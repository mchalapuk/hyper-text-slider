(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

var autoboot = require('./core/autoboot');

/**
 * During project build, this script is compiled to `dist/hyper-text-slider.js`,
 * which contains ES5 code that can be run in all modern browsers.
 * It is to be used only when programming in vanilla-browser style.
 * When using nodejs-based javascript preprocessor, it's better to load
 * `hyper-text-slider` module and call ${link boot} function from client code.
 */
window.addEventListener('load', function() {
  autoboot(document.body);
});


},{"./core/autoboot":2}],2:[function(require,module,exports){
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

var boot = require('./boot');
var Common = require('../enums/common');
var check = require('../utils/check');

module.exports = autoboot;

/**
 * Calls ${link boot} with passed element if it contains ${link Common.AUTOBOOT} option.
 *
 * @params {Element} containerElement element that will be passed to ${link boot}
 */
function autoboot(containerElement) {
  check(containerElement, 'containerElement').is.anInstanceOf(Element)();

  if (containerElement.classList.contains(Common.AUTOBOOT)) {
    boot(containerElement);
  }
}


},{"../enums/common":8,"../utils/check":17,"./boot":3}],3:[function(require,module,exports){
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

var Slider = require('./slider');
var Option = require('../enums/option');
var Common = require('../enums/common');
var Layout = require('../enums/layout');
var check = require('../utils/check');

module.exports = boot;

/**
 * Default HyperText Slider boot procedure.
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
 * var htSlider = require('hyper-text-slider');
 * htSlider.boot(document.body);
 * ```
 *
 * ...or even consider implementing bootup by yourself.
 *
 * @param {Element} containerElement element that contains sliders in (not necessarily immediate) children
 * @return {Array<Slider>} array containing all created ${link Slider} instances
 *
 * @see Common.AUTOBOOT
 * @fqn boot
 */
function boot(containerElement) {
  check(containerElement, 'containerElement').is.anInstanceOf(Element)();

  var containerOptions = getEnabledOptions(containerElement);
  var sliderElems = concatUnique(
      [].slice.call(containerElement.querySelectorAll('.'+ Layout.SLIDER)),
      [].slice.call(containerElement.querySelectorAll('.'+ Common.SLIDER_SHORT))
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
    if (element.classList.contains(option)) {
      retVal.push(option);
    }
  });
  return retVal;
}

function concatUnique(unique, candidate) {
  return unique.concat(candidate.filter(function(element) { return unique.indexOf(element) === -1; }));
}


},{"../enums/common":8,"../enums/layout":10,"../enums/option":12,"../utils/check":17,"./slider":6}],4:[function(require,module,exports){
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


},{"../enums/phase":14,"../utils/check":17,"../utils/detect-features":18}],5:[function(require,module,exports){
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


},{"../utils/check":17}],6:[function(require,module,exports){
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
 * > HyperText Slider JavaScript API should be used only when specific initialization or integration
 * > with other parts of the website is required. In other (simpler) cases please consider
 * > using [declarative API](class-names.md).
 *
 * ### Example
 *
 * ```javascript
 * // browserify is supported
 * var ht = require('hyper-text-slider');
 *
 * window.addEventListener('load', function() {
 *   var slider = new ht.Slider(document.getElementById('my-slider'));
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
var Phase = require('../enums/phase');

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
  check(elem, 'elem').is.anInstanceOf(Element)();

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
 * @see ${link Common.AUTOBOOT}
 *
 * @fqn Slider.prototype.start
 */
function start(priv, callback) {
  check(priv.started, 'slider.started').is.False();
  check(callback, 'callback').is.aFunction.or.Undefined();

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
  check(index, 'index').is.inRange(0, priv.slides.length)();

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
  check(eventName, 'eventName').is.aString.and.oneOf(EVENT_NAMES)();
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
  check(eventName, 'eventName').is.aString.and.oneOf(EVENT_NAMES)();
  var listeners = getListeners(priv, eventName);
  check(listener, 'listener').is.aFunction.and.is.oneOf(listeners, 'registered listeners')();

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

  priv.tempClasses = (currentSlide.id !== null? [ 'ht-slide-id-'+ currentSlide.id ]: [])
    .concat(DOM.findClassNames(currentSlide, Pattern.TRANSITION))
    .concat(DOM.findClassNames(currentSlide, Pattern.THEME))
    ;

  priv.tempClasses.forEach(function(className) {
    priv.elem.classList.add(className);
  });
}

function onPhaseChange(priv, phase) {
  if (phase === Phase.AFTER_TRANSITION && priv.elem.classList.contains(Option.AUTOPLAY)) {
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


},{"../enums/flag":9,"../enums/layout":10,"../enums/marker":11,"../enums/option":12,"../enums/pattern":13,"../enums/phase":14,"../utils/check":17,"../utils/dom":19,"./phaser":4,"./slide-change-event":5,"./upgrader":7}],7:[function(require,module,exports){
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
var Common = require('../enums/common');

var Selector = (function() {
  var selectors = {};
  for (var name in Layout) {
    selectors[name] = '.' + Layout[name];
  }
  return selectors;
}());

var themeGroups = {};
themeGroups[Theme.DEFAULTS] = [
  Theme.WHITE,
  Theme.BASIC_DOTS,
  Theme.HOVER_OPAQUE_DOTS,
  Theme.BASIC_ARROWS,
  Theme.HOVER_OPAQUE_ARROWS,
  Theme.RESPONSIVE_ARROWS,
];
themeGroups[Theme.BASIC_CONTROLS] = [
  Theme.BASIC_ARROWS,
  Theme.BASIC_DOTS,
];
themeGroups[Theme.HOVER_VISIBLE_CONTROLS] = [
  Theme.HOVER_VISIBLE_ARROWS,
  Theme.HOVER_VISIBLE_DOTS,
];
themeGroups[Theme.HOVER_OPAQUE_CONTROLS] = [
  Theme.HOVER_OPAQUE_ARROWS,
  Theme.HOVER_OPAQUE_DOTS,
];

var DEFAULT_TRANSITIONS = [
  Transition.ZOOM_OUT_IN,
  Transition.BG_ZOOM_IN_OUT,
];

function Upgrader(elem) {
  check(elem, 'elem').is.anInstanceOf(Element)();

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

  expandOptionGroups(priv);

  priv.defaultThemes = DOM.extractClassNames(priv.elem, Pattern.THEME) || [ Theme.DEFAULTS ];
  priv.defaultTransitions = DOM.extractClassNames(priv.elem, Pattern.TRANSITION) || DEFAULT_TRANSITIONS;

  createArrowButtons(priv);
  createDotButtons(priv);
  upgradeSlides(priv);

  var list = priv.elem.classList;
  if (!list.contains(Layout.SLIDER)) {
    list.add(Layout.SLIDER);
  }
  list.add(Flag.UPGRADED);
}

function expandOptionGroups(priv) {
  var list = priv.elem.classList;

  if (list.contains(Common.DEFAULTS)) {
    list.add(Option.DEFAULTS);
    list.add(Theme.DEFAULTS);
  }
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
    if (evt.animationName === 'htSlideInserted' &&
        evt.target.parentNode === priv.elem &&
        !evt.target.classList.contains(Layout.CONTROLS)) {
      upgradeSlide(priv, evt.target);
    }
  }
}

function upgradeSlide(priv, slideElement) {
  supplementClassNames(priv, slideElement);
  Object.keys(themeGroups).forEach(expandThemeGroup.bind(null, priv, slideElement));

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

function expandThemeGroup(priv, slideElement, groupName) {
  if (slideElement.classList.contains(groupName)) {
    themeGroups[groupName].forEach(function(theme) { slideElement.classList.add(theme); });
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


},{"../enums/common":8,"../enums/flag":9,"../enums/layout":10,"../enums/option":12,"../enums/pattern":13,"../enums/theme":15,"../enums/transition":16,"../utils/check":17,"../utils/detect-features":18,"../utils/dom":19}],8:[function(require,module,exports){
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
 * Most commonly used class names.
 *
 * Each class is checked by the slider in one of two ways:
 *  1. <a href='#once' id='once'>**checked once**</a> - class name should be set
 *    in client HTML, slider will check for it only once during upgrade, adding/removing class
 *    after upgrade make no effect,
 *  2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
 *    class name may be added/removed at any time, slider will check if it is set every time
 *    a decission connected with this class is made.
 *
 * There are two categories of class names:
 *  1. **functional classes** - each of which enables one feature,
 *  2. **class groups** - that adds many class names to the slider during its
 *    [upgrade](dom-upgrade.md).
 *
 * @name Common Class Names
 * @summary-column checked Checked
 * @summary-column target Target Element
 * @summary-column client-html Client HTML
 */
var Common = {

  /**
   * Automatically creates ${link Slider} objects for all sliders declared on the page
   * and invokes their ${link Slider.prototype.start} methods.
   *
   * This options can be set only on `<body>` element.
   * It enabled using HyperText Slider without any JavaScript programming.
   *
   * > ***WARNING***
   * >
   * > When using HyperText Slider via node and broserify, this option is ignored.
   *
   * @target document's `<body>`
   * @checked once
   * @client-html mandatory
   * @see boot
   * @see Slider.prototype.start
   *
   * @fqn Common.AUTOBOOT
   */
  AUTOBOOT: 'ht-autoboot',

  /**
   * Alias for ${link Layout.SLIDER}.
   *
   * @target ${link Layout.SLIDER}
   * @checked once
   * @client-html mandatory
   *
   * @fqn Common.SLIDER_SHORT
   */
  SLIDER_SHORT: 'ht-slider',

  /**
   * Adds ${link Option.DEFAULTS} and ${link Theme.DEFAULTS} classes to the slider.
   *
   * @target ${link Layout.SLIDER}
   * @checked once
   * @client-html optional
   *
   * @fqn Common.DEFAULTS
   */
  DEFAULTS: 'ht-defaults',
};

module.exports = Common;


},{}],9:[function(require,module,exports){
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


},{}],10:[function(require,module,exports){
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
 * In most cases, most of layout classes **SHOULD not be used in client HTML**, as they are
 * automatially applied to apropriate elements during [slider's upgrade procedure](dom-upgrade.md)
 * (${link Common.SLIDER_SHORT} is the only layout class name that MUST be applied in client HTML).
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
  SLIDER: 'ht-layout--slider',

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
  SLIDE: 'ht-layout--slide',

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
  BACKGROUND: 'ht-layout--background',

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
  CONTENT: 'ht-layout--content',

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
  CONTROLS: 'ht-layout--controls',

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
  ARROW: 'ht-layout--arrow',

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
  ARROW_LEFT: 'ht-layout--arrow-left',

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
  ARROW_RIGHT: 'ht-layout--arrow-right',

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
  DOTS: 'ht-layout--dots',

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
  DOT: 'ht-layout--dot',
};

module.exports = Layout;


},{}],11:[function(require,module,exports){
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
  SLIDE_FROM: 'ht-slide-from',

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
  SLIDE_TO: 'ht-slide-to',
};

module.exports = Marker;


},{}],12:[function(require,module,exports){
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
 * Option classes enable features of the slider.
 *
 * Most options are intended to be set on ${link Layout.SLIDER} element, but they can also be
 * set on document's `<body>`. Options set on `<body>` are treated as defaults for each ${link
 * Layout.SLIDER} declared on the page.
 *
 * @name Option Class Names
 * @summary-column checked Checked
 * @summary-column target Target Element
 */
var Option = {

  /**
   * Adds
   * ${link Option.AUTOPLAY},
   * ${link Option.ARROW_KEYS}
   * classes to the slider.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   *
   * @fqn Option.DEFAULTS
   */
  DEFAULTS: 'ht-option--defaults',

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
  AUTOPLAY: 'ht-option--autoplay',

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
  ARROW_KEYS: 'ht-option--arrow-keys',
};

module.exports = Option;


},{}],13:[function(require,module,exports){
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
  TRANSITION: /ht-transition--([^\s]+)/g,

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
   * HyperText Slider provides very basic ${link Theme built-in themes}
   * (see [Adding Custom Themes](custom-themes.md)).
   *
   * @invariant Theme class name's of currently active slide is added to slider element.
   *
   * @fqn Pattern.THEME
   */
  THEME: /ht-theme--([^\s]+)/g,

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
  SLIDE_ID: /ht-slide-id-([^\s]+)/,
};

module.exports = Pattern;


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
  BEFORE_TRANSITION: 'ht-before-transition',

  /**
   * Set on slider element while transition of ${link Layout.CONTENT} element is run.
   *
   * @fqn Phase.DURING_TRANSITION
   */
  DURING_TRANSITION: 'ht-during-transition',

  /**
   * Set on slider element after transition of ${link Layout.CONTENT} element ends.
   *
   * @fqn Phase.AFTER_TRANSITION
   */
  AFTER_TRANSITION: 'ht-after-transition',
};

module.exports = Phase;


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
   * @default true
   * @fqn Theme.WHITE
   */
  WHITE: 'ht-theme--white',

  /**
   * Black background, white foreground elements (texts, dots, arrows).
   *
   * @default false
   * @fqn Theme.BLACK
   */
  BLACK: 'ht-theme--black',

  /**
   * Shows dot button for each slide.
   *
   * This theme provides basic dot visuals. In case different styling of dots is needed, either
   * extend this theme class or create your own from scratch. Extending this class may be
   * prefereable as other themes (${link Theme.BLACK}, ${link Theme.WHITE}) are compatible
   * with this one.
   *
   * @default true
   * @fqn Theme.BASIC_DOTS
   */
  BASIC_DOTS: 'ht-theme--basic-dots',

  /**
   * Adds hover-dependent visibility change to dots.
   *
   * Dots become visible when mouse is hovering above the slider.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.BASIC_DOTS} or custom theme that defines dot visuals.
   *
   * @default false
   * @fqn Theme.HOVER_VISIBLE_DOTS
   */
  HOVER_VISIBLE_DOTS: 'ht-theme--hover-visible-dots',

  /**
   * Adds hover-dependent opacity change to dots.
   *
   * Dots become more opaque twhen mouseis hovering above the slider.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for dots. It must be used in combination
   * > with ${link Theme.BASIC_DOTS} or custom theme that defines dot visuals.
   *
   * @default true
   * @fqn Theme.HOVER_OPAQUE_DOTS
   */
  HOVER_OPAQUE_DOTS: 'ht-theme--hover-opaque-dots',

  /**
   * Shows basic side arrow buttons.
   *
   * This theme provides basic arrow visuals. In case different styling of arrows is needed, either
   * extend this theme class or create your own from scratch. Extending this class may be
   * prefereable if you also want to use ${link Theme.RESPONSIVE_ARROWS}.
   *
   * @default true
   * @fqn Theme.BASIC_ARROWS
   */
  BASIC_ARROWS: 'ht-theme--basic-arrows',

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
   * > with ${link Theme.BASIC_ARROWS}.
   *
   * @see [Screen Responsiveness](responsiveness.md)
   * @see Slider.breakpointNarrowToNormal
   * @see Slider.breakpointNormalToWide
   *
   * @default true
   * @fqn Theme.RESPONSIVE_ARROWS
   */
  RESPONSIVE_ARROWS: 'ht-theme--responsive-arrows',

  /**
   * Adds hover-dependent visibility change to arrows.
   *
   * Arrows become visible when mouse is hovering above the slider.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.BASIC_ARROWS} or custom theme that defines arrow visuals.
   *
   * @default false
   * @fqn Theme.HOVER_VISIBLE_ARROWS
   */
  HOVER_VISIBLE_ARROWS: 'ht-theme--hover-visible-arrows',

  /**
   * Adds hover-dependent opacity change to arrows.
   *
   * Arrows become more opaque twhen mouseis hovering above the slider.
   *
   * > **NOTE**
   * >
   * > This class does not provide visual styles for arrows. It must be used in combination
   * > with ${link Theme.BASIC_ARROWS} or custom theme that defines arrow visuals.
   *
   * @default true
   * @fqn Theme.HOVER_OPAQUE_ARROWS
   */
  HOVER_OPAQUE_ARROWS: 'ht-theme--hover-opaque-arrows',

  /**
   * Adds
   * ${link Theme.BASIC_ARROWS},
   * ${link Theme.BASIC_DOTS}
   * classes to the slide.
   *
   * @default false
   * @fqn Theme.BASIC_CONTROLS
   */
  BASIC_CONTROLS: 'ht-theme--basic-controls',

  /**
   * Adds
   * ${link Theme.HOVER_VISIBLE_ARROWS},
   * ${link Theme.HOVER_VISIBLE_DOTS}
   * classes to the slide.
   *
   * @default false
   * @fqn Theme.HOVER_VISIBLE_CONTROLS
   */
  HOVER_VISIBLE_CONTROLS: 'ht-theme--hover-visible-controls',

  /**
   * Adds
   * ${link Theme.HOVER_OPAQUE_ARROWS},
   * ${link Theme.HOVER_OPAQUE_DOTS}
   * classes to the slide.
   *
   * @default false
   * @fqn Theme.HOVER_OPAQUE_CONTROLS
   */
  HOVER_OPAQUE_CONTROLS: 'ht-theme--hover-opaque-controls',

  /**
   * Adds
   * ${link Theme.BASIC_ARROWS},
   * ${link Theme.BASIC_DOTS}.
   * ${link Theme.HOVER_OPAQUE_ARROWS},
   * ${link Theme.HOVER_OPAQUE_DOTS}
   * ${link Theme.RESPONSIVE_ARROWS},
   * ${link Theme.WHITE}
   * classes to the slide.
   *
   * @default false
   * @fqn Theme.DEFAULTS
   */
  DEFAULTS: 'ht-theme--defaults',
};

module.exports = Theme;


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
  ZOOM_OUT_IN: 'ht-transition--zoom-out-in',

  /**
   * Delicate background zoom in when slide appears, zoom out when it disappears.
   *
   * @fqn Transition.BG_ZOOM_IN_OUT
   */
  BG_ZOOM_IN_OUT: 'ht-transition--bg-zoom-in-out',
};

module.exports = Transition;


},{}],17:[function(require,module,exports){
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

var check = require('offensive').default;
var Registry = require('offensive/Registry').default;

require('offensive/assertions/method/register');
require('offensive/assertions/anInstanceOf/register');
require('offensive/assertions/aString/register');
require('offensive/assertions/aNumber/register');
require('offensive/assertions/inRange/register');
require('offensive/assertions/Undefined/register');
require('offensive/assertions/oneOf/register');
require('offensive/assertions/True/register');
require('offensive/assertions/False/register');

module.exports = check;

Registry.instance.addAssertion({
  'anEventTarget': {
    assert: function(value, name, check) {
      return check(value, name)
        .has.method('addEventListener')
        .and.method('removeEventListener')
        .and.method('dispatchEvent')
      ;
    },
  },
});


},{"offensive":63,"offensive/Registry":24,"offensive/assertions/False/register":28,"offensive/assertions/True/register":31,"offensive/assertions/Undefined/register":33,"offensive/assertions/aNumber/register":36,"offensive/assertions/aString/register":38,"offensive/assertions/anInstanceOf/register":41,"offensive/assertions/inRange/register":50,"offensive/assertions/method/register":55,"offensive/assertions/oneOf/register":60}],18:[function(require,module,exports){
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


},{}],19:[function(require,module,exports){
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
  check(elem, 'elem').is.anInstanceOf(Element)();
  check(pattern, 'pattern').is.anInstanceOf(RegExp).or.aString();

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
  check(elem, 'elem').is.anInstanceOf(Element)();
  check(pattern, 'pattern').is.anInstanceOf(RegExp).or.aString();

  elem.className = elem.className.replace(pattern, '').replace('\s+', ' ');
}

function extractClassNames(elem, pattern) {
  check(elem, 'elem').is.anInstanceOf(Element)();
  check(pattern, 'pattern').is.anInstanceOf(RegExp).or.aString();

  var retVal = findClassNames(elem, pattern);
  removeClassNames(elem, pattern);
  return retVal;
}


},{"../utils/check":17}],20:[function(require,module,exports){
(function (process){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var BuilderImpl_1 = require("./BuilderImpl");
var ObjectSerializer_1 = require("./ObjectSerializer");
var serializer = new ObjectSerializer_1.default();
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var BuilderFactory = /** @class */ (function () {
    function BuilderFactory(assertions, operators) {
        this.assertions = assertions;
        this.operators = operators;
        this.currentBuilder = null;
        this.currentStack = '';
        var innerCheck = this.createInner.bind(this);
        var factory = this;
        // Copy the BuilderImpl class in order to be able to set its prototype
        // to different object in each instance of the factory.
        this.Constructor = function BuilderConstructor(testedValue, varName) {
            var self = this;
            // In order to have a call operator (() : T) on the `OperatorBuilder`,
            // we need to create a function and set its prototype to `OperatorBuilder.prototype`.
            function operatorBuilder() {
                factory.currentBuilder = null;
                var result = self.__evaluate();
                if (!result.success) {
                    var error = new Error(result.message.toString());
                    error.name = 'ContractError';
                    throw error;
                }
                return testedValue;
            }
            Object.setPrototypeOf(operatorBuilder, operators);
            BuilderImpl_1.default.call(self, testedValue, varName, operatorBuilder, innerCheck);
        };
        this.Constructor.prototype = __assign({}, BuilderImpl_1.default.prototype);
        Object.setPrototypeOf(this.Constructor.prototype, assertions);
        // Different constructor for inner checks in order to forbid invoking call operator.
        this.InnerConstructor = function InnerBuilderConstructor(testedValue, varName) {
            function innerOperatorBuilder() {
                throw new Error("invoking call operator inside inner check is forbidden (" + varName + ")");
            }
            Object.setPrototypeOf(innerOperatorBuilder, operators);
            BuilderImpl_1.default.call(this, testedValue, varName, innerOperatorBuilder, innerCheck);
        };
        this.InnerConstructor.prototype = this.Constructor.prototype;
    }
    BuilderFactory.prototype.create = function (testedValue, varName) {
        if (this.currentBuilder !== null) {
            throw new Error("Previous top-level assertion builder not finished (varName='" + this.currentBuilder._varName + "'). Did you forget to invoke call operator?" + this.currentStack);
        }
        this.currentBuilder = new this.Constructor(testedValue, varName);
        if (process.env.NODE_ENV !== 'production') {
            this.currentStack = extractStackTrace(new Error());
        }
        return this.currentBuilder;
    };
    BuilderFactory.prototype.createInner = function (testedValue, varName) {
        var context = new this.InnerConstructor(testedValue, varName);
        return context;
    };
    return BuilderFactory;
}());
exports.BuilderFactory = BuilderFactory;
exports.default = BuilderFactory;
function extractStackTrace(error) {
    var stack = error.stack;
    return '\n  TRACE OF PREVIOUS CALL:\n' + stack.split('\n')
        .slice(3, 8)
        .concat(['  ...'])
        .map(function (row) { return "  " + row; })
        .join('\n');
}

}).call(this,require('_process'))
},{"./BuilderImpl":21,"./ObjectSerializer":23,"_process":76}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoDsl_1 = require("./NoDsl");
var nodsl = new NoDsl_1.NoDsl('DslError');
/**
 * All implemnentation details are prefixed with double underscore (__)
 * in order to leave non-underscored names for registered assertions and operators.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var BuilderImpl = /** @class */ (function () {
    function BuilderImpl(_testedValue, _varName, _operatorBuilder, _check) {
        var _this = this;
        this._testedValue = _testedValue;
        this._varName = _varName;
        this._operatorBuilder = _operatorBuilder;
        this._check = _check;
        // NOTE:
        // Prototype of this class is being copied in `BuilderFactory`.
        // It's important that it doesn't have any property getters.
        this.__result = null;
        this.__unary = null;
        this.__operands = [];
        this.__binary = null;
        var pushBinaryOperator = this.__pushBinaryOperator.bind(this);
        // Object literal created for the purpose of proper minification of methods and properties.
        var props = {
            success: function () { return _this.__evaluate().success; },
            message: function () { return _this.__evaluate().message; },
            __pushBinaryOperator: function () { return pushBinaryOperator; },
        };
        var keys = Object.keys(props);
        keys.forEach(function (key) {
            Object.defineProperty(_operatorBuilder, key, { get: props[key], enumerable: false });
        });
    }
    BuilderImpl.prototype.__pushAssertionFactory = function (factory, args) {
        return this.__pushAssertion(factory(args));
    };
    BuilderImpl.prototype.__pushAssertion = function (assertion) {
        this.__setResult(assertion.assert(this._testedValue, this._varName, this._check));
        return this._operatorBuilder;
    };
    BuilderImpl.prototype.__pushBinaryOperator = function (operator) {
        nodsl.check(this.__unary === null, 'Calling binary operator after unary operator is forbidden.');
        nodsl.check(this.__result !== null || this.__operands.length !== 0, 'Calling binary operator without preceeding assertion is forbidden.');
        switch (this.__binary) {
            case operator:
                // already doing the same operator
                return this;
            default:
                // operator changed, we need to evaluate previous one
                this.__applyBinary();
                break;
            case null:
                // noop
                break;
        }
        this.__binary = operator;
        this.__operands.push(this.__result);
        this.__result = null;
        return this;
    };
    BuilderImpl.prototype.__pushUnaryOperator = function (operator) {
        nodsl.check(this.__unary === null, 'Calling unary operator after unary operator is forbidden.');
        nodsl.check(this.__result === null, 'Calling unary operator after assertion is forbidden.');
        this.__unary = operator;
        return this;
    };
    BuilderImpl.prototype.__evaluate = function () {
        if (this.__binary !== null) {
            this.__applyBinary();
        }
        nodsl.check(this.__result !== null, 'No result found.');
        return this.__result;
    };
    BuilderImpl.prototype.__applyBinary = function () {
        nodsl.check(this.__operands.length >= 2, 'Trying to apply binary operator with less than two operands.');
        nodsl.check(this.__unary === null, 'Trying to apply binary operator with dangling unary operator.');
        this.__result = this.__binary.apply(this.__operands);
        this.__binary = null;
        this.__operands = [];
    };
    BuilderImpl.prototype.__setResult = function (result) {
        if (this.__unary !== null) {
            var nextResult = this.__unary.apply(result);
            this.__unary = null;
            this.__setResult(nextResult);
            return;
        }
        if (this.__binary !== null) {
            this.__operands.push(result);
            return;
        }
        this.__result = result;
    };
    return BuilderImpl;
}());
exports.BuilderImpl = BuilderImpl;
exports.default = BuilderImpl;

},{"./NoDsl":22}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectSerializer_1 = require("./ObjectSerializer");
var serializer = new ObjectSerializer_1.default();
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var NoDsl = /** @class */ (function () {
    function NoDsl(errorName) {
        if (errorName === void 0) { errorName = 'Error'; }
        this.errorName = errorName;
    }
    NoDsl.prototype.check = function (condition) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (condition) {
            return;
        }
        var message = args
            .map(function (arg) { return typeof arg === 'string' ? arg : serializer.serializeAny(arg); })
            .join('');
        var error = new Error(message);
        error.name = this.errorName;
        throw error;
    };
    return NoDsl;
}());
exports.NoDsl = NoDsl;
exports.nodsl = new NoDsl();
exports.default = exports.nodsl;
exports.nodslArguments = new NoDsl('ArgumentError');

},{"./ObjectSerializer":23}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var ObjectSerializer = /** @class */ (function () {
    function ObjectSerializer() {
    }
    ObjectSerializer.prototype.serializeAny = function (arg) {
        switch (typeof arg) {
            default:
                return String(arg);
            case 'string':
                return '\'' + arg + '\'';
            case 'function':
                return this.serializeFunction(arg);
            case 'object':
                return this.serializeObject(arg);
        }
    };
    ObjectSerializer.prototype.serializeFunction = function (func) {
        return func.name ? "function " + func.name : 'unnamed function';
    };
    ObjectSerializer.prototype.serializeObject = function (arg) {
        var _this = this;
        if (arg instanceof NoObject) {
            return "no object (" + this.serializeAny(arg.value) + ")";
        }
        if (arg instanceof NoArrayOperator) {
            return "no array operator (" + this.serializeAny(arg.value) + ")";
        }
        if (arg === null) {
            return 'null';
        }
        if (Array.isArray(arg)) {
            return "[" + arg.map(this.serializeField.bind(this)).join(', ') + "]";
        }
        var keys = Object.keys(arg);
        if (keys.length === 0) {
            return '{}';
        }
        var keyToString = function (key) { return key + ": " + _this.serializeField(arg[key]); };
        return "{ " + keys.map(keyToString).join(', ') + " }";
    };
    ObjectSerializer.prototype.serializeField = function (arg) {
        switch (typeof arg) {
            default:
                return String(arg);
            case 'string':
                return "'" + arg + "'";
            case 'function':
                return this.serializeFunction(arg);
            case 'object':
                return this.serializeObjectField(arg);
        }
    };
    ObjectSerializer.prototype.serializeObjectField = function (arg) {
        if (arg === null) {
            return 'null';
        }
        if (arg instanceof Array) {
            return '[ ... ]';
        }
        return '{ ... }';
    };
    return ObjectSerializer;
}());
exports.ObjectSerializer = ObjectSerializer;
exports.default = ObjectSerializer;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var NoArrayOperator = /** @class */ (function () {
    function NoArrayOperator(value) {
        this.value = value;
    }
    NoArrayOperator.prototype.cast = function () {
        return this;
    };
    return NoArrayOperator;
}());
exports.NoArrayOperator = NoArrayOperator;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var NoObject = /** @class */ (function () {
    function NoObject(value) {
        this.value = value;
    }
    NoObject.prototype.cast = function () {
        return this;
    };
    return NoObject;
}());
exports.NoObject = NoObject;

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoDsl_1 = require("./NoDsl");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var Registry = /** @class */ (function () {
    function Registry() {
        this.contextProto = {
            assertions: {},
            operators: {},
            connectors: {},
        };
        this.traces = {};
        this.entities = {};
        var _a = this.contextProto, assertions = _a.assertions, operators = _a.operators, connectors = _a.connectors;
        Object.setPrototypeOf(assertions, connectors);
        Object.setPrototypeOf(operators, connectors);
        // Fields names of `Result` interface are reserved
        // as `OperatorBuilder` implements `Result`.
        var trace = prepareTrace();
        this.traces['success'] = this.traces['message'] = trace;
        this.entities['success'] = this.entities['message'] = {};
    }
    Registry.prototype.addAssertion = function (assertions) {
        var newAssertions = this.filterAlreadyRegistered(assertions);
        this.extendPrototype(this.contextProto.assertions, newAssertions, function getAssertion(assertion) {
            return this.__pushAssertion(assertion);
        });
        return this;
    };
    Registry.prototype.addAssertionFactory = function (factories) {
        var newFactories = this.filterAlreadyRegistered(factories);
        this.extendPrototype(this.contextProto.assertions, newFactories, function getAssertionFactory(factory) {
            var _this = this;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _this.__pushAssertionFactory(factory, args);
            };
        });
        return this;
    };
    Registry.prototype.addUnaryOperator = function (operators) {
        var newOperators = this.filterAlreadyRegistered(operators);
        // Unary operators must be added on prototype of `AssertionBuilder`.
        this.extendPrototype(this.contextProto.assertions, newOperators, function getUnaryOperator(operator) {
            return this.__pushUnaryOperator(operator);
        });
        return this;
    };
    Registry.prototype.addBinaryOperator = function (operators) {
        var newOperators = this.filterAlreadyRegistered(operators);
        this.extendPrototype(this.contextProto.operators, newOperators, function getBinaryOperator(operator) {
            return this.__pushBinaryOperator(operator);
        });
        return this;
    };
    Registry.prototype.addConnectors = function (connectors) {
        var newConnectors = this.filterAlreadyRegistered(connectors);
        this.extendPrototype(this.contextProto.connectors, newConnectors, function getConnector() {
            // noop
            return this;
        });
        return this;
    };
    Registry.prototype.filterAlreadyRegistered = function (entities) {
        var _this = this;
        var trace = prepareTrace();
        return Object.keys(entities)
            .filter(function (name) {
            NoDsl_1.default.check(name.length !== 0, 'name.length must be > 0 (got \'', name, '\')');
            NoDsl_1.default.check(name[0] !== '_', 'name must not start with underscore (got \'', name, '\')');
            var alreadyRegistered = _this.entities[name];
            if (alreadyRegistered === undefined) {
                return true;
            }
            NoDsl_1.default.check(alreadyRegistered === entities[name], 'Entity of name ', name, ' already registered.\n', 'PREVIOUS REGISTRATION STACK TRACE:\n', _this.traces[name], 'CURRENT REGISTRATION STACK TRACE:\n');
            return false;
        })
            .reduce(function (result, name) {
            _this.traces[name] = trace;
            _this.entities[name] = entities[name];
            result[name] = entities[name];
            return result;
        }, {});
    };
    Registry.prototype.extendPrototype = function (proto, newElements, getter) {
        var enumerable = true;
        var names = Object.keys(newElements);
        names.forEach(function (name) {
            function get() {
                return getter.call(this, newElements[name]);
            }
            Object.defineProperty(proto, name, { get: get, enumerable: enumerable });
        });
    };
    Registry.instance = new Registry();
    return Registry;
}());
exports.Registry = Registry;
exports.default = Registry;
function prepareTrace() {
    var stack = new Error().stack;
    var firstNewlineIndex = stack.indexOf('\n');
    var secondNewlineIndex = stack.indexOf('\n', firstNewlineIndex + 1);
    var trace = stack.substring(secondNewlineIndex + 1)
        .split('\n')
        .map(function (line) { return "  " + line; })
        .join('\n');
}

},{"./NoDsl":22}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../Null");
require("../Undefined");
require("../../connectors");
require("../../operators/or");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var EmptyAssertion = /** @class */ (function () {
    function EmptyAssertion() {
    }
    EmptyAssertion.prototype.assert = function (testedValue, varName, check) {
        return check(testedValue, varName).is.Null.or.Undefined;
    };
    return EmptyAssertion;
}());
exports.EmptyAssertion = EmptyAssertion;
exports.default = EmptyAssertion;

},{"../../connectors":61,"../../operators/or":74,"../Null":29,"../Undefined":32}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EmptyAssertion_1 = require("./EmptyAssertion");
exports.EmptyAssertion = EmptyAssertion_1.default;
var Null = require("../Null");
var Undefined = require("../Undefined");
var or = require("../../operators/or");
var connectors = require("../../connectors");
exports.default = EmptyAssertion_1.default;
exports.instance = new EmptyAssertion_1.default();
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    Null.registerIn(registry);
    Undefined.registerIn(registry);
    or.registerIn(registry);
    connectors.registerIn(registry);
    registry.addAssertion({
        Empty: exports.instance,
        empty: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"../../connectors":61,"../../operators/or":74,"../Null":29,"../Undefined":32,"./EmptyAssertion":25}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exactly_1 = require("../exactly");
exports.instance = new exactly_1.default(false);
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertion({
        False: exports.instance,
        false: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"../exactly":43}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var False = require(".");
/**
 * Register `.False` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
False.registerIn(Registry_1.default.instance);

},{".":27,"../../Registry":24}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exactly_1 = require("../exactly");
exports.instance = new exactly_1.default(null);
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertion({
        Null: exports.instance,
        null: exports.instance,
        Nil: exports.instance,
        nil: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"../exactly":43}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exactly_1 = require("../exactly");
exports.instance = new exactly_1.default(true);
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertion({
        True: exports.instance,
        true: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"../exactly":43}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var True = require(".");
/**
 * Register `.True` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
True.registerIn(Registry_1.default.instance);

},{".":30,"../../Registry":24}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ofType_1 = require("../ofType");
exports.instance = new ofType_1.default('undefined');
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertion({
        Undefined: exports.instance,
        undefined: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"../ofType":57}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var Undefined = require(".");
/**
 * Register `.Undefined` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
Undefined.registerIn(Registry_1.default.instance);

},{".":32,"../../Registry":24}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ofType_1 = require("../ofType");
exports.instance = new ofType_1.default('function');
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertion({
        aFunction: exports.instance,
        Function: exports.instance,
        function: exports.instance,
        aFunc: exports.instance,
        Func: exports.instance,
        func: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"../ofType":57}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ofType_1 = require("../ofType");
exports.instance = new ofType_1.default('number');
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertion({
        aNumber: exports.instance,
        Number: exports.instance,
        number: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"../ofType":57}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var aNumber = require(".");
/**
 * Register `.aNumber` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aNumber.registerIn(Registry_1.default.instance);

},{".":35,"../../Registry":24}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ofType_1 = require("../ofType");
exports.instance = new ofType_1.default('string');
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertion({
        aString: exports.instance,
        String: exports.instance,
        string: exports.instance,
        str: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"../ofType":57}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var aString = require(".");
/**
 * Register `.aString` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aString.registerIn(Registry_1.default.instance);

},{".":37,"../../Registry":24}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
var NoDsl_1 = require("../../NoDsl");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var InstanceOfAssertion = /** @class */ (function () {
    function InstanceOfAssertion(requiredType) {
        this.requiredType = requiredType;
    }
    InstanceOfAssertion.prototype.assert = function (testedValue, varName) {
        var requiredType = this.requiredType;
        return {
            get success() {
                return testedValue instanceof requiredType;
            },
            get message() {
                return new model_1.StandardMessage(varName, "be an instance of " + serializeType(requiredType), testedValue);
            },
        };
    };
    return InstanceOfAssertion;
}());
exports.InstanceOfAssertion = InstanceOfAssertion;
(function (InstanceOfAssertion) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        NoDsl_1.nodslArguments.check(args.length === 1, '.instanceOf requires 1 argument (got ', args.length, ')');
        NoDsl_1.nodslArguments.check(typeof args[0] === 'function', 'requiredType must be a function (got ', (typeof args[0]), ')');
        return new InstanceOfAssertion(args[0]);
    }
    InstanceOfAssertion.factory = factory;
})(InstanceOfAssertion = exports.InstanceOfAssertion || (exports.InstanceOfAssertion = {}));
exports.InstanceOfAssertion = InstanceOfAssertion;
exports.default = InstanceOfAssertion;
function serializeType(type) {
    return type.name || 'unknown type';
}

},{"../../NoDsl":22,"../../model":67}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstanceOfAssertion_1 = require("./InstanceOfAssertion");
exports.InstanceOfAssertion = InstanceOfAssertion_1.default;
exports.default = InstanceOfAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertionFactory({
        anInstanceOf: InstanceOfAssertion_1.default.factory,
        instanceOf: InstanceOfAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"./InstanceOfAssertion":39}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var anInstanceOf = require(".");
/**
 * Register `.anInstanceOf` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
anInstanceOf.registerIn(Registry_1.default.instance);

},{".":40,"../../Registry":24}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
var ObjectSerializer_1 = require("../../ObjectSerializer");
var NoDsl_1 = require("../../NoDsl");
var serializer = new ObjectSerializer_1.ObjectSerializer();
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var ExactlyAssertion = /** @class */ (function () {
    function ExactlyAssertion(comparedValue) {
        this.comparedValue = comparedValue;
    }
    ExactlyAssertion.prototype.assert = function (testedValue, varName) {
        var comparedValue = this.comparedValue;
        return {
            get success() {
                return testedValue === comparedValue;
            },
            get message() {
                return new model_1.StandardMessage(varName, "be " + serializer.serializeAny(comparedValue), testedValue);
            },
        };
    };
    return ExactlyAssertion;
}());
exports.ExactlyAssertion = ExactlyAssertion;
(function (ExactlyAssertion) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        NoDsl_1.nodslArguments.check(args.length === 1, '.exactly requires 1 argument (got ', args.length, ')');
        return new ExactlyAssertion(args[0]);
    }
    ExactlyAssertion.factory = factory;
})(ExactlyAssertion = exports.ExactlyAssertion || (exports.ExactlyAssertion = {}));
exports.ExactlyAssertion = ExactlyAssertion;
exports.default = ExactlyAssertion;

},{"../../NoDsl":22,"../../ObjectSerializer":23,"../../model":67}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExactlyAssertion_1 = require("./ExactlyAssertion");
exports.ExactlyAssertion = ExactlyAssertion_1.default;
exports.default = ExactlyAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertionFactory({
        exactly: ExactlyAssertion_1.default.factory,
        Exactly: ExactlyAssertion_1.default.factory,
        exactlyEqualTo: ExactlyAssertion_1.default.factory,
        ExactlyEqualTo: ExactlyAssertion_1.default.factory,
        exactlyEquals: ExactlyAssertion_1.default.factory,
        ExactlyEquals: ExactlyAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"./ExactlyAssertion":42}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoDsl_1 = require("../../NoDsl");
var ObjectSerializer_1 = require("../../ObjectSerializer");
require("../Empty");
require("../../operators/not");
require("../../connectors");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var FieldThatAssertion = /** @class */ (function () {
    function FieldThatAssertion(fieldName, innerAssert) {
        this.fieldName = fieldName;
        this.innerAssert = innerAssert;
    }
    FieldThatAssertion.prototype.assert = function (testedValue, varName, check) {
        var _a = this, fieldName = _a.fieldName, innerAssert = _a.innerAssert;
        if (!check(testedValue, varName).is.not.Empty.success) {
            return {
                get success() {
                    return false;
                },
                get message() {
                    var wrapper = new ObjectSerializer_1.NoObject(testedValue);
                    var newBuilder = check(wrapper.cast(), varName + "." + fieldName);
                    return innerAssert(newBuilder).message;
                },
            };
        }
        var newBuilder = check(testedValue[fieldName], varName + "." + fieldName);
        return innerAssert(newBuilder);
    };
    return FieldThatAssertion;
}());
exports.FieldThatAssertion = FieldThatAssertion;
(function (FieldThatAssertion) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        NoDsl_1.nodslArguments.check(args.length === 2, '.fieldThat requires 2 arguments (got ', args.length, ')');
        NoDsl_1.nodslArguments.check(typeof args[0] === 'string', 'fieldName must be a string (got ', (typeof args[0]), ')');
        NoDsl_1.nodslArguments.check(typeof args[1] === 'function', 'assert must be a function (got ', (typeof args[1]), ')');
        return new FieldThatAssertion(args[0], args[1]);
    }
    FieldThatAssertion.factory = factory;
})(FieldThatAssertion = exports.FieldThatAssertion || (exports.FieldThatAssertion = {}));
exports.FieldThatAssertion = FieldThatAssertion;
exports.default = FieldThatAssertion;

},{"../../NoDsl":22,"../../ObjectSerializer":23,"../../connectors":61,"../../operators/not":72,"../Empty":26}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FieldThatAssertion_1 = require("./FieldThatAssertion");
exports.FieldThatAssertion = FieldThatAssertion_1.default;
var Empty = require("../Empty");
var not = require("../../operators/not");
var connectors = require("../../connectors");
exports.default = FieldThatAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    Empty.registerIn(registry);
    not.registerIn(registry);
    connectors.registerIn(registry);
    registry.addAssertionFactory({
        fieldThat: FieldThatAssertion_1.default.factory,
        fieldWhich: FieldThatAssertion_1.default.factory,
        propertyThat: FieldThatAssertion_1.default.factory,
        propertyWhich: FieldThatAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"../../connectors":61,"../../operators/not":72,"../Empty":26,"./FieldThatAssertion":44}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
var NoDsl_1 = require("../../NoDsl");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var GreaterThanOrEqualToAssertion = /** @class */ (function () {
    function GreaterThanOrEqualToAssertion(comparedNumber) {
        this.comparedNumber = comparedNumber;
    }
    GreaterThanOrEqualToAssertion.prototype.assert = function (testedValue, varName) {
        var comparedNumber = this.comparedNumber;
        return {
            get success() {
                return testedValue >= comparedNumber;
            },
            get message() {
                return new model_1.StandardMessage(varName, "be \u2265 " + comparedNumber, testedValue);
            },
        };
    };
    return GreaterThanOrEqualToAssertion;
}());
exports.GreaterThanOrEqualToAssertion = GreaterThanOrEqualToAssertion;
(function (GreaterThanOrEqualToAssertion) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        NoDsl_1.nodslArguments.check(args.length === 1, '.greaterThanEqual requires 1 argument (got ', args.length, ')');
        NoDsl_1.nodslArguments.check(typeof args[0] === 'number', 'comparedNumber must be a number (got ', (typeof args[0]), ')');
        return new GreaterThanOrEqualToAssertion(args[0]);
    }
    GreaterThanOrEqualToAssertion.factory = factory;
})(GreaterThanOrEqualToAssertion = exports.GreaterThanOrEqualToAssertion || (exports.GreaterThanOrEqualToAssertion = {}));
exports.GreaterThanOrEqualToAssertion = GreaterThanOrEqualToAssertion;
exports.default = GreaterThanOrEqualToAssertion;

},{"../../NoDsl":22,"../../model":67}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GreaterThanOrEqualToAssertion_1 = require("./GreaterThanOrEqualToAssertion");
exports.GreaterThanOrEqualToAssertion = GreaterThanOrEqualToAssertion_1.default;
exports.default = GreaterThanOrEqualToAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertionFactory({
        greaterThanOrEqualTo: GreaterThanOrEqualToAssertion_1.default.factory,
        greaterThanOrEqual: GreaterThanOrEqualToAssertion_1.default.factory,
        greaterThanEqualTo: GreaterThanOrEqualToAssertion_1.default.factory,
        greaterThanEqual: GreaterThanOrEqualToAssertion_1.default.factory,
        greaterOrEqualTo: GreaterThanOrEqualToAssertion_1.default.factory,
        greaterOrEqual: GreaterThanOrEqualToAssertion_1.default.factory,
        gte: GreaterThanOrEqualToAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"./GreaterThanOrEqualToAssertion":46}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoDsl_1 = require("../../NoDsl");
require("../greaterThanOrEqualTo");
require("../lessThan");
require("../../operators/and");
require("../../connectors");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var InRangeAssertion = /** @class */ (function () {
    function InRangeAssertion(lowerBounds, upperBounds) {
        this.lowerBounds = lowerBounds;
        this.upperBounds = upperBounds;
    }
    InRangeAssertion.prototype.assert = function (testedValue, varName, check) {
        return check(testedValue, varName)
            .is.greaterThanOrEqualTo(this.lowerBounds)
            .and.lessThan(this.upperBounds);
    };
    return InRangeAssertion;
}());
exports.InRangeAssertion = InRangeAssertion;
(function (InRangeAssertion) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        NoDsl_1.nodslArguments.check(args.length === 2, '.inRange requires 2 arguments (got ', args.length, ')');
        NoDsl_1.nodslArguments.check(typeof args[0] === 'number', 'lowerBounds must be a number (got ', (typeof args[0]), ')');
        NoDsl_1.nodslArguments.check(typeof args[1] === 'number', 'upperBounds must be a number (got ', (typeof args[1]), ')');
        return new InRangeAssertion(args[0], args[1]);
    }
    InRangeAssertion.factory = factory;
})(InRangeAssertion = exports.InRangeAssertion || (exports.InRangeAssertion = {}));
exports.InRangeAssertion = InRangeAssertion;
exports.default = InRangeAssertion;

},{"../../NoDsl":22,"../../connectors":61,"../../operators/and":69,"../greaterThanOrEqualTo":47,"../lessThan":52}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InRangeAssertion_1 = require("./InRangeAssertion");
exports.InRangeAssertion = InRangeAssertion_1.default;
var greaterThanOrEqualTo = require("../greaterThanOrEqualTo");
var lessThan = require("../lessThan");
var and = require("../../operators/and");
var connectors = require("../../connectors");
exports.default = InRangeAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    greaterThanOrEqualTo.registerIn(registry);
    lessThan.registerIn(registry);
    and.registerIn(registry);
    connectors.registerIn(registry);
    registry.addAssertionFactory({
        inRange: InRangeAssertion_1.default.factory,
        between: InRangeAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"../../connectors":61,"../../operators/and":69,"../greaterThanOrEqualTo":47,"../lessThan":52,"./InRangeAssertion":48}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var inRange = require(".");
/**
 * Register `.inRange` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
inRange.registerIn(Registry_1.default.instance);

},{".":49,"../../Registry":24}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
var NoDsl_1 = require("../../NoDsl");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var LessThanAssertion = /** @class */ (function () {
    function LessThanAssertion(comparedNumber) {
        this.comparedNumber = comparedNumber;
    }
    LessThanAssertion.prototype.assert = function (testedValue, varName) {
        var comparedNumber = this.comparedNumber;
        return {
            get success() {
                return testedValue < comparedNumber;
            },
            get message() {
                return new model_1.StandardMessage(varName, "be < " + comparedNumber, testedValue);
            },
        };
    };
    return LessThanAssertion;
}());
exports.LessThanAssertion = LessThanAssertion;
(function (LessThanAssertion) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        NoDsl_1.nodslArguments.check(args.length === 1, '.lessThan requires 1 argument (got ', args.length, ')');
        NoDsl_1.nodslArguments.check(typeof args[0] === 'number', 'comparedNumber must be a number (got ', (typeof args[0]), ')');
        return new LessThanAssertion(args[0]);
    }
    LessThanAssertion.factory = factory;
})(LessThanAssertion = exports.LessThanAssertion || (exports.LessThanAssertion = {}));
exports.LessThanAssertion = LessThanAssertion;
exports.default = LessThanAssertion;

},{"../../NoDsl":22,"../../model":67}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LessThanAssertion_1 = require("./LessThanAssertion");
exports.LessThanAssertion = LessThanAssertion_1.default;
exports.default = LessThanAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertionFactory({
        lessThan: LessThanAssertion_1.default.factory,
        less: LessThanAssertion_1.default.factory,
        lt: LessThanAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"./LessThanAssertion":51}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoDsl_1 = require("../../NoDsl");
require("../fieldThat");
require("../aFunction");
require("../../connectors");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var MethodAssertion = /** @class */ (function () {
    function MethodAssertion(methodName) {
        this.methodName = methodName;
    }
    MethodAssertion.prototype.assert = function (testedValue, varName, check) {
        return check(testedValue, varName)
            .has.fieldThat(this.methodName, function (field) { return field.is.aFunction; });
    };
    return MethodAssertion;
}());
exports.MethodAssertion = MethodAssertion;
(function (MethodAssertion) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        NoDsl_1.nodslArguments.check(args.length === 1, '.method assertion requires 1 argument got (', args.length, ')');
        NoDsl_1.nodslArguments.check(typeof args[0] === 'string', 'methodName must be a string (got ', (typeof args[0]), ')');
        return new MethodAssertion(args[0]);
    }
    MethodAssertion.factory = factory;
})(MethodAssertion = exports.MethodAssertion || (exports.MethodAssertion = {}));
exports.MethodAssertion = MethodAssertion;
exports.default = MethodAssertion;

},{"../../NoDsl":22,"../../connectors":61,"../aFunction":34,"../fieldThat":45}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MethodAssertion_1 = require("./MethodAssertion");
exports.MethodAssertion = MethodAssertion_1.default;
var fieldThat = require("../fieldThat");
var aFunction = require("../aFunction");
var connectors = require("../../connectors");
exports.default = MethodAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    fieldThat.registerIn(registry);
    aFunction.registerIn(registry);
    connectors.registerIn(registry);
    registry.addAssertionFactory({
        aMethod: MethodAssertion_1.default.factory,
        method: MethodAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"../../connectors":61,"../aFunction":34,"../fieldThat":45,"./MethodAssertion":53}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var method = require(".");
/**
 * Register `.method` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
method.registerIn(Registry_1.default.instance);

},{".":54,"../../Registry":24}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
var ObjectSerializer_1 = require("../../ObjectSerializer");
var NoDsl_1 = require("../../NoDsl");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var OfTypeAssertion = /** @class */ (function () {
    function OfTypeAssertion(requiredType) {
        this.requiredType = requiredType;
    }
    OfTypeAssertion.prototype.assert = function (testedValue, varName) {
        var requiredType = this.requiredType;
        return {
            get success() {
                return typeof testedValue === requiredType;
            },
            get message() {
                switch (requiredType) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                    case 'function':
                        return new model_1.StandardMessage(varName, "be a " + requiredType, testedValue);
                    case 'object':
                        return new model_1.StandardMessage(varName, "be an " + requiredType, testedValue);
                    case 'undefined':
                        return new model_1.StandardMessage(varName, "be " + requiredType, testedValue);
                }
            },
        };
    };
    return OfTypeAssertion;
}());
exports.OfTypeAssertion = OfTypeAssertion;
(function (OfTypeAssertion) {
    var VALID_TYPES = /function|object|string|number|boolean|undefined/;
    var serializer = new ObjectSerializer_1.ObjectSerializer();
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        NoDsl_1.nodslArguments.check(args.length === 1, '.ofType requires 1 argument (got ', args.length, ')');
        NoDsl_1.nodslArguments.check(args[0].match(VALID_TYPES), 'requiredType must match /', VALID_TYPES.source, '/', ' (got ', serializer.serializeAny(args[0]), ')');
        return new OfTypeAssertion(args[0]);
    }
    OfTypeAssertion.factory = factory;
})(OfTypeAssertion = exports.OfTypeAssertion || (exports.OfTypeAssertion = {}));
exports.OfTypeAssertion = OfTypeAssertion;
exports.default = OfTypeAssertion;

},{"../../NoDsl":22,"../../ObjectSerializer":23,"../../model":67}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OfTypeAssertion_1 = require("./OfTypeAssertion");
exports.OfTypeAssertion = OfTypeAssertion_1.default;
exports.default = OfTypeAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertionFactory({
        ofType: OfTypeAssertion_1.default.factory,
        type: OfTypeAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"./OfTypeAssertion":56}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
var ObjectSerializer_1 = require("../../ObjectSerializer");
var NoDsl_1 = require("../../NoDsl");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var OneOfAssertion = /** @class */ (function () {
    function OneOfAssertion(serializer, searchedSet, requirement) {
        this.serializer = serializer;
        this.searchedSet = searchedSet;
        this.requirement = requirement;
    }
    OneOfAssertion.prototype.assert = function (testedValue, varName) {
        var _a = this, searchedSet = _a.searchedSet, requirement = _a.requirement, serializer = _a.serializer;
        return {
            get success() {
                return searchedSet.indexOf(testedValue) !== -1;
            },
            get message() {
                if (requirement !== undefined) {
                    return new model_1.StandardMessage(varName, requirement, testedValue);
                }
                return new model_1.StandardMessage(varName, "be one of " + serializer.serializeObject(searchedSet), testedValue);
            },
        };
    };
    return OneOfAssertion;
}());
exports.OneOfAssertion = OneOfAssertion;
(function (OneOfAssertion) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function factory(args) {
        var serializer = new ObjectSerializer_1.ObjectSerializer();
        NoDsl_1.nodslArguments.check(args.length === 1 || args.length === 2, '.oneOf requires 1 or 2 arguments (got ', args.length, ')');
        NoDsl_1.nodslArguments.check(Array.isArray(args[0]), 'searchedSet must be an array (got ', serializer.serializeAny(args[0]), ')');
        if (args.length === 2) {
            NoDsl_1.nodslArguments.check(typeof args[1] === 'string', 'requirement must be a string (got ', (typeof args[1]), ')');
        }
        return new OneOfAssertion(serializer, args[0], args[1]);
    }
    OneOfAssertion.factory = factory;
})(OneOfAssertion = exports.OneOfAssertion || (exports.OneOfAssertion = {}));
exports.OneOfAssertion = OneOfAssertion;
exports.default = OneOfAssertion;

},{"../../NoDsl":22,"../../ObjectSerializer":23,"../../model":67}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OneOfAssertion_1 = require("./OneOfAssertion");
exports.OneOfAssertion = OneOfAssertion_1.default;
exports.default = OneOfAssertion_1.default;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addAssertionFactory({
        oneOf: OneOfAssertion_1.default.factory,
        elementOf: OneOfAssertion_1.default.factory,
        containedIn: OneOfAssertion_1.default.factory,
        inSet: OneOfAssertion_1.default.factory,
    });
}
exports.registerIn = registerIn;

},{"./OneOfAssertion":58}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../../Registry");
var oneOf = require(".");
/**
 * Register `.oneOf` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
oneOf.registerIn(Registry_1.default.instance);

},{".":59,"../../Registry":24}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noop = {};
exports.connectors = {
    is: noop,
    be: noop,
    being: noop,
    to: noop,
    from: noop,
    under: noop,
    over: noop,
    has: noop,
    have: noop,
    defines: noop,
    define: noop,
    contains: noop,
    contain: noop,
    precondition: noop,
    postcondition: noop,
    invariant: noop,
};
exports.default = exports.connectors;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addConnectors(exports.connectors);
}
exports.registerIn = registerIn;

},{}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../Registry");
var connectors = require(".");
/**
 * Register all connectors in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
connectors.registerIn(Registry_1.default.instance);

},{".":61,"../Registry":24}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BuilderFactory_1 = require("./BuilderFactory");
var Registry_1 = require("./Registry");
require("./operators/register");
require("./connectors/register");
var _a = Registry_1.Registry.instance.contextProto, assertions = _a.assertions, operators = _a.operators;
var factory = new BuilderFactory_1.BuilderFactory(assertions, operators);
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function check(testedValue, varName) {
    return factory.create(testedValue, varName);
}
exports.check = check;
exports.default = check;

},{"./BuilderFactory":20,"./Registry":24,"./connectors/register":62,"./operators/register":75}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectSerializer_1 = require("../ObjectSerializer");
var serializer = new ObjectSerializer_1.ObjectSerializer();
var BinaryOperator;
(function (BinaryOperator) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function message(separator, operands) {
        var grouped = operands.reduce(groupByVarName(), [])
            .map(function (messages) { return joinRequirements(separator, messages); });
        if (grouped.length === 1) {
            return grouped[0];
        }
        return joinMessages(separator, grouped);
    }
    BinaryOperator.message = message;
})(BinaryOperator = exports.BinaryOperator || (exports.BinaryOperator = {}));
exports.default = BinaryOperator;
var objectNumber = 0;
function groupByVarName() {
    var previousName = {};
    function newGroup(result) {
        var group = [];
        result.push(group);
        return group;
    }
    return function (result, message) {
        var group = previousName === message.varName
            ? result[result.length - 1]
            : newGroup(result);
        group.push(message);
        previousName = message.varName;
        return result;
    };
}
function joinRequirements(separator, messages) {
    var head = messages[0];
    var tail = messages.slice(1);
    if (tail.length === 0) {
        return head;
    }
    return {
        get varName() {
            return head.varName;
        },
        get requirement() {
            var sharedRequirement = sharedStart.apply(null, messages.map(function (msg) { return msg.requirement; }));
            var article = / an? ?$/.exec(sharedRequirement);
            var cut = sharedRequirement.length - (article ? article[0].length - 1 : 0);
            var tailRequitements = tail.map(function (msg) { return msg.requirement.substring(cut); });
            return head.requirement + " " + separator + " " + tailRequitements.join(" " + separator + " ");
        },
        get actualValue() {
            return head.actualValue;
        },
        toString: function () {
            var actual = serializer.serializeAny(this.actualValue);
            return this.varName + " must " + this.requirement + " (got " + actual + ")";
        },
    };
}
function joinMessages(separator, messages) {
    return {
        get varName() {
            // just a unique name
            return "\u00BBBinaryOperator-[" + messages.map(function (msg) { return msg.varName; }).join(', ') + "]";
        },
        get requirement() {
            var head = messages[0];
            // simple 'must' for a message is enough
            var tail = messages.slice(1)
                .map(function (msg) { return ("" + msg).replace(/ must/, ''); });
            return head + " " + separator + " " + tail.join(" " + separator + " ");
        },
        get actualValue() {
            // value doesn't make sence any more (there are multiple)
            return undefined;
        },
        toString: function () {
            return this.requirement;
        },
    };
}
function sharedStart() {
    var strings = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        strings[_i] = arguments[_i];
    }
    var sorted = strings.concat().sort();
    var first = sorted[0], last = sorted[sorted.length - 1];
    var i = 0;
    while (i < first.length && first.charAt(i) === last.charAt(i))
        i++;
    return first.substring(0, i);
}

},{"../ObjectSerializer":23}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectSerializer_1 = require("../ObjectSerializer");
var serializer = new ObjectSerializer_1.ObjectSerializer();
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var StandardMessage = /** @class */ (function () {
    function StandardMessage(varName, requirement, actualValue) {
        this.varName = varName;
        this.requirement = requirement;
        this.actualValue = actualValue;
    }
    StandardMessage.prototype.toString = function () {
        var actual = serializer.serializeAny(this.actualValue);
        return this.varName + " must " + this.requirement + " (got " + actual + ")";
    };
    return StandardMessage;
}());
exports.StandardMessage = StandardMessage;

},{"../ObjectSerializer":23}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = require("./Result");
var ObjectSerializer_1 = require("../ObjectSerializer");
var serializer = new ObjectSerializer_1.ObjectSerializer();
var UnaryOperator;
(function (UnaryOperator) {
    /**
     * @author Maciej Chałapuk (maciej@chalapuk.pl)
     */
    function message(prefix, message) {
        return new Result_1.StandardMessage(message.varName, prefix + " " + message.requirement, message.actualValue);
    }
    UnaryOperator.message = message;
})(UnaryOperator = exports.UnaryOperator || (exports.UnaryOperator = {}));
exports.default = UnaryOperator;

},{"../ObjectSerializer":23,"./Result":65}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = require("./Result");
exports.StandardMessage = Result_1.StandardMessage;
var UnaryOperator_1 = require("./UnaryOperator");
exports.UnaryOperator = UnaryOperator_1.UnaryOperator;
var BinaryOperator_1 = require("./BinaryOperator");
exports.BinaryOperator = BinaryOperator_1.BinaryOperator;

},{"./BinaryOperator":64,"./Result":65,"./UnaryOperator":66}],68:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var AndOperator = /** @class */ (function () {
    function AndOperator() {
    }
    AndOperator.prototype.apply = function (operands) {
        return {
            get success() {
                var e_1, _a;
                try {
                    for (var operands_1 = __values(operands), operands_1_1 = operands_1.next(); !operands_1_1.done; operands_1_1 = operands_1.next()) {
                        var operand = operands_1_1.value;
                        if (!operand.success) {
                            // First failure means that whole expression is false.
                            return false;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (operands_1_1 && !operands_1_1.done && (_a = operands_1.return)) _a.call(operands_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return true;
            },
            get message() {
                // We want to report only on failures.
                var failures = operands.filter(function (result) { return !result.success; });
                return model_1.BinaryOperator.message('and', failures.map(function (o) { return o.message; }));
            },
        };
    };
    return AndOperator;
}());
exports.AndOperator = AndOperator;
exports.default = AndOperator;

},{"../../model":67}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AndOperator_1 = require("./AndOperator");
exports.AndOperator = AndOperator_1.default;
exports.default = AndOperator_1.default;
exports.instance = new AndOperator_1.default();
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addBinaryOperator({
        and: exports.instance,
        with: exports.instance,
        of: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"./AndOperator":68}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var and = require("./and");
var or = require("./or");
var not = require("./not");
var AndOperator = and.AndOperator;
exports.AndOperator = AndOperator;
var OrOperator = or.OrOperator;
exports.OrOperator = OrOperator;
var NotOperator = not.NotOperator;
exports.NotOperator = NotOperator;
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    and.registerIn(registry);
    or.registerIn(registry);
    not.registerIn(registry);
}
exports.registerIn = registerIn;

},{"./and":69,"./not":72,"./or":74}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var NotOperator = /** @class */ (function () {
    function NotOperator() {
    }
    NotOperator.prototype.apply = function (operand) {
        return {
            get success() {
                return !operand.success;
            },
            get message() {
                return model_1.UnaryOperator.message('not', operand.message);
            },
        };
    };
    return NotOperator;
}());
exports.NotOperator = NotOperator;
exports.default = NotOperator;

},{"../../model":67}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NotOperator_1 = require("./NotOperator");
exports.NotOperator = NotOperator_1.default;
exports.default = NotOperator_1.default;
exports.instance = new NotOperator_1.default();
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addUnaryOperator({
        not: exports.instance,
        no: exports.instance,
        doesnt: exports.instance,
        dont: exports.instance,
        isnt: exports.instance,
        arent: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"./NotOperator":71}],73:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../../model");
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var OrOperator = /** @class */ (function () {
    function OrOperator() {
    }
    OrOperator.prototype.apply = function (operands) {
        return {
            get success() {
                var e_1, _a;
                try {
                    for (var operands_1 = __values(operands), operands_1_1 = operands_1.next(); !operands_1_1.done; operands_1_1 = operands_1.next()) {
                        var operand = operands_1_1.value;
                        if (operand.success) {
                            // first success means that whole expression is true
                            return true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (operands_1_1 && !operands_1_1.done && (_a = operands_1.return)) _a.call(operands_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return false;
            },
            get message() {
                return model_1.BinaryOperator.message('or', operands.map(function (o) { return o.message; }));
            },
        };
    };
    return OrOperator;
}());
exports.OrOperator = OrOperator;
exports.default = OrOperator;

},{"../../model":67}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrOperator_1 = require("./OrOperator");
exports.OrOperator = OrOperator_1.default;
exports.default = OrOperator_1.default;
exports.instance = new OrOperator_1.default();
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
function registerIn(registry) {
    registry.addBinaryOperator({
        or: exports.instance,
    });
}
exports.registerIn = registerIn;

},{"./OrOperator":73}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = require("../Registry");
var operators = require(".");
/**
 * Register all operators in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
operators.registerIn(Registry_1.default.instance);

},{".":70,"../Registry":24}],76:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
