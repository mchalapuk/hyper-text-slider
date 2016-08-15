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

var precond = require('precond');

/**
 * > **DISCLAIMER**
 * >
 * > Hermes JavaScript API should be used only when specific initialization or integration
 * > with other parts of the website is required. In other (simpler) cases please consider
 * > using [declarative API](class-names.md).
 *
 * > **DISCLAIMER**
 * >
 * > JavaScript API is in early **alpha stage** and may change in the future.
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

var DEFAULT_TRANSITION = 'hermes-transition--zoom-in-out';

// public

/**
 * Constructs the slider.
 *
 * @param {Element} elem DOM element for the slider
 *
 * @fqn Slider.prototype.constructor
 */
function Slider(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.dotsElement = null;
  priv.transitions = [];
  priv.phaser = phaser(elem);
  priv.slides = [];
  priv.upgrader = upgrader(elem);
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
  precond.checkState(!priv.started, 'slider is already started');

  priv.startCallback = callback || noop;
  priv.transitions = searchForTransitions(priv.elem);
  // For transition to work, it is required that a single transition class will be present
  // on the slider element. Since there may be many transitions declared on the slider and
  // since transitions can be configured also per slide, all transition class names are removed
  // from the slider. Single transition class name will be added just before before-transition
  // phase and removed right after hitting after-transition.
  // TODO transitions are to be independent from slide time, this needs to change
  // TODO is there a way to test removing transition class names during start?
  priv.elem.className = priv.elem.className.replace(Pattern.TRANSITION, '').replace('\s+', ' ');

  expandOptionGroups(priv);
  enableControls(priv);

  priv.upgrader.onSlideUpgraded = acceptSlide.bind(null, priv);
  priv.upgrader.start();

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
  precond.checkState(priv.started, 'slider not started');
  precond.checkIsNumber(index, 'given index is not a number');
  precond.checkArgument(priv.slides.length > index, 'given index is out of bounds');

  var toIndex = index <= priv.slides.length? index % priv.slides.length: index;
  if (priv.toIndex === toIndex) {
    return;
  }

  removeMarkersAndFlags(priv);
  removeTempClasses(priv);

  priv.fromIndex = priv.toIndex;
  priv.toIndex = toIndex;

  addMarkersAndFlags(priv);
  var toSlide = priv.slides[priv.toIndex];
  if (toSlide.id !== null) {
    addTempClass(priv, 'hermes-slide-id-'+ toSlide.id);
  }
  addTempClass(priv, chooseTransition(priv));

  priv.phaser.startTransition();
}

// private

// initialization functions

function searchForTransitions(elem) {
  var transitions = [];
  var matches = elem.className.match(Pattern.TRANSITION);
  if (matches) {
    for (var i = 0; i < matches.length; ++i) {
      transitions.push(matches[i]);
    }
  }
  return transitions;
}

function create() {
  var elem = document.createElement('div');
  elem.className = [].join.call(arguments, ' ');
  return elem;
}

function acceptSlide(priv, slideElement) {
  if (priv.dotsElement) {
    createDot(priv, slideElement);
  }
  slideElement.classList.add(Flag.UPGRADED);

  priv.slides.push(slideElement);
  priv.phaser.addPhaseTrigger(slideElement.querySelector('.'+ Layout.CONTENT));

  if (priv.slides.length === 1) {
    moveToFirstSlide(priv);
    priv.startCallback.call(null, priv.pub);
  }
}

function moveToFirstSlide(priv) {
  var firstSlide = priv.slides[priv.toIndex];
  firstSlide.classList.add(Marker.SLIDE_TO);
  if (firstSlide.id !== null) {
    addTempClass(priv, 'hermes-slide-id-'+ firstSlide.id);
  }
  if (typeof firstSlide.dot !== 'undefined') {
    firstSlide.dot.classList.add(Flag.ACTIVE);
  }

  addTempClass(priv, chooseTransition(priv));
  priv.phaser.addPhaseListener(partial(onPhaseChange, priv));
  priv.phaser.startTransition();
}

function expandOptionGroups(priv) {
  var list = priv.elem.classList;

  if (list.contains(Option.DEFAULTS)) {
    list.add(Option.AUTOPLAY);
    list.add(Option.ARROW_KEYS);
    list.add(Option.CREATE_ARROWS);
    list.add(Option.CREATE_DOTS);
    list.add(Option.RESPONSIVE_CONTROLS);
  }
}

function enableControls(priv) {
  var list = priv.elem.classList;

  if (list.contains(Option.CREATE_ARROWS)) {
    createArrowButtons(priv);
  }
  if (list.contains(Option.CREATE_DOTS)) {
    createDotButtons(priv);
  }
  if (list.contains(Option.ARROW_KEYS)) {
    window.addEventListener('keydown', partial(keyBasedMove, priv));
  }
}

function createArrowButtons(priv) {
  var previousButton = create(Layout.ARROW, Layout.CONTROLS, Layout.ARROW_LEFT);
  previousButton.addEventListener('click', partial(moveToPrevious, priv));
  priv.elem.appendChild(previousButton);

  var nextButton = create(Layout.ARROW, Layout.CONTROLS, Layout.ARROW_RIGHT);
  nextButton.addEventListener('click', partial(moveToNext, priv));
  priv.elem.appendChild(nextButton);
}

function createDotButtons(priv) {
  priv.dotsElement = create(Layout.CONTROLS, Layout.DOTS);
  priv.elem.appendChild(priv.dotsElement);
  priv.dotsElement.addEventListener('click', function(evt) {
    var index = [].indexOf.call(priv.dotsElement.childNodes, evt.target);
    if (index === -1) {
      return;
    }
    moveTo(priv, index);
  });
}

function createDot(priv, slideElement) {
  var dot = create(Layout.DOT);
  priv.dotsElement.appendChild(dot);
  slideElement.dot = dot;
}

function keyBasedMove(priv, event) {
  switch (event.key) {
    case 'ArrowLeft': moveToPrevious(priv); break;
    case 'ArrowRight': moveToNext(priv); break;
    default: break;
  }
}

function removeMarkersAndFlags(priv) {
  var fromSlide = priv.slides[priv.fromIndex];
  var toSlide = priv.slides[priv.toIndex];
  fromSlide.classList.remove(Marker.SLIDE_FROM);
  toSlide.classList.remove(Marker.SLIDE_TO);
  if (typeof toSlide.dot !== 'undefined') {
    toSlide.dot.classList.remove(Flag.ACTIVE);
  }
}

function addMarkersAndFlags(priv) {
  var fromSlide = priv.slides[priv.fromIndex];
  var toSlide = priv.slides[priv.toIndex];
  fromSlide.classList.add(Marker.SLIDE_FROM);
  toSlide.classList.add(Marker.SLIDE_TO);
  if (typeof toSlide.dot !== 'undefined') {
    toSlide.dot.classList.add(Flag.ACTIVE);
  }
}

function addTempClass(priv, className) {
  priv.tempClasses.push(className);
  priv.elem.classList.add(className);
}

function removeTempClasses(priv) {
  priv.tempClasses.forEach(function(className) {
    priv.elem.classList.remove(className);
  });
  priv.tempClasses = [];
}

function onPhaseChange(priv, phase) {
  if (phase === 'hermes-after-transition' && priv.elem.classList.contains(Option.AUTOPLAY)) {
    moveToNext(priv);
  }
}

// transition change functions

function chooseTransition(priv) {
  var match = priv.slides[priv.toIndex].className.match(Pattern.TRANSITION);
  return match && match[0] ||
      (priv.transitions.length && random(priv.transitions) ||
      DEFAULT_TRANSITION);
}

function random(array) {
  return array[parseInt(Math.random() * array.length, 10)];
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

