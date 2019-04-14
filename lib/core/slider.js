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

