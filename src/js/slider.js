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
 * > [Declarative API](class-names.md) is stable (future versions will be backward-compatibile).
 *
 * ### Example
 *
 * ```javascript
 * // browserify is supported
 * var hermes = require('hermes');
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

var Layout = require('./classnames/_layout');
var Option = require('./classnames/_options');
var Marker = require('./classnames/_markers');
var Flag = require('./classnames/_flags');
var Regexp = require('./classnames/_regexps');

var Selector = (function() {
  var selectors = {};
  for (var name in Layout) {
    selectors[name] = '.' + Layout[name];
  }
  return selectors;
}());


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
  priv.transitions = searchForTransitions(elem);
  priv.elem.className = priv.elem.className.replace(Regexp.TRANSITION, '');
  priv.phaser = phaser(elem);
  priv.phaser.addPhaseListener(onPhaseChange.bind(null, priv));
  priv.slides = searchForSlides(elem);
  precond.checkState(priv.slides.length >= 2, 'at least 2 slides needed');
  priv.tempClasses = [];
  priv.fromIndex = 1;
  priv.toIndex = 0;
  priv.started = false;

  expandOptionGroups(priv);
  enableControls(priv);
  enableStartupFeatures(priv);
  upgradeSlides(priv);

  var pub = {};
  bindMethods(pub, [
    start,
    moveTo,
    moveToNext,
    moveToPrevious,
  ], priv);

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
    get: function() { return priv.started? priv.toIndex: null; },
    set: pub.moveTo,
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
    get: function() { return priv.started? priv.slides[priv.toIndex]: null; },
    set: function() { throw new Error('read only property! please use currentIndex instead'); },
  });

  return pub;
}

/**
 * Shows first slide.
 *
 * Starts the slider mechanism.
 *
 * @precondition ${link Slider.prototype.start} was not called on this slider
 * @postcondition calling ${link Slider.prototype.start} again will throw exception
 * @see ${link Option.AUTOSTART}
 *
 * @fqn Slider.prototype.start
 */
function start(priv) {
  // separate start procedure is needed because
  // only one slide is seen in the first transition
  precond.checkState(!priv.started, 'slider is already started');
  priv.started = true;

  var firstSlide = priv.slides[priv.toIndex];
  firstSlide.classList.add(Marker.SLIDE_TO);
  if (firstSlide.id !== null) {
    addTempClass(priv, 'hermes-slide-id-'+ firstSlide.id);
  }
  if (typeof firstSlide.dot !== 'undefined') {
    firstSlide.dot.classList.add(Flag.ACTIVE);
  }

  addTempClass(priv, chooseTransition(priv));
  priv.phaser.startTransition();
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

function searchForSlides(elem) {
  return [].slice.call(elem.querySelectorAll(Selector.SLIDE));
}

function searchForTransitions(elem) {
  var transitions = [];
  var matches = elem.className.match(Regexp.TRANSITION);
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

function upgradeSlides(priv) {
  priv.slides.forEach(function(slide) {
    var content = slide.querySelector(Selector.CONTENT);
    if (content === null) {
      content = create(Layout.CONTENT);
      while (slide.childNodes.length) {
        content.appendChild(slide.childNodes[0]);
      }
      slide.appendChild(content);
    }
    priv.phaser.addPhaseTrigger(content);

    var background = slide.querySelector(Selector.BACKGROUND);
    if (background === null) {
      slide.insertBefore(create(Layout.BACKGROUND), content);
    }
  });
}

function expandOptionGroups(priv) {
  var list = priv.elem.classList;

  if (list.contains(Option.DEFAULTS)) {
    list.add(Option.AUTOSTART);
    list.add(Option.AUTOPLAY);
    list.add(Option.ARROW_KEYS);
    list.add(Option.CREATE_ARROWS);
    list.add(Option.CREATE_DOTS);
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
    window.addEventListener('keydown', keyBasedMove.bind(null, priv));
  }
}

function enableStartupFeatures(priv) {
  var list = priv.elem.classList;

  if (list.contains(Option.AUTOSTART)) {
    window.setTimeout(start.bind(null, priv), 100);
  }
}

function createArrowButtons(priv) {
  var previousButton = create(Layout.ARROW, Layout.ARROW_LEFT);
  previousButton.addEventListener('click', moveToPrevious.bind(null, priv));
  priv.elem.appendChild(previousButton);

  var nextButton = create(Layout.ARROW, Layout.ARROW_RIGHT);
  nextButton.addEventListener('click', moveToNext.bind(null, priv));
  priv.elem.appendChild(nextButton);
}

function createDotButtons(priv) {
  var dots = create(Layout.DOTS);
  priv.elem.appendChild(dots);

  for (var i = 0; i < priv.slides.length; ++i) {
    var dot = create(Layout.DOT);
    dot.addEventListener('click', moveTo.bind(null, priv, i));
    dots.appendChild(dot);
    priv.slides[i].dot = dot;
  }
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
  var match = priv.slides[priv.toIndex].className.match(Regexp.TRANSITION);
  return (match? match[0]: false) || random(priv.transitions);
}

function random(array) {
  if (array.length === 0) {
    return 'hermes-no-transition';
  }
  return array[parseInt(Math.random() * array.length, 10)];
}

// utilities

function bindMethods(wrapper, methods, arg) {
  methods.forEach(function(method) {
    wrapper[method.name] = method.bind(wrapper, arg);
  });
}

/*
  eslint-env node, browser
*/

