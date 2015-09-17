'use strict';

var hermes = require('./hermes');
var precond = require('precond');

function initializeSlider(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.hermes = hermes(elem);
  priv.hermes.addPhaseChangeListener(onPhaseChange.bind(priv));
  priv.slides = searchForSlides(elem);
  precond.checkState(priv.slides.length >= 2, 'at least 2 slides needed');
  priv.transitions = searchForTransitions(elem);
  priv.tempClasses = [];
  priv.fromIndex = 1;
  priv.toIndex = 0;
  priv.chooseTransition = chooseTransition;
  priv.started = false;

  priv.elem.className = priv.elem.className.replace(Regexp.TRANSITION, '');
  upgradeSlides(priv);
  setOptions(priv);

  var pub = {};
  pub.start = start.bind(priv);
  pub.slides = priv.slides;
  Object.defineProperty(pub.slides, 'currentIndex', {
    get: function() { return priv.started? priv.toIndex: null; },
    set: moveTo.bind(priv),
  });
  Object.defineProperty(pub.slides, 'current', {
    get: function() { return priv.started? priv.slides[priv.toIndex]: null; },
    set: function() { throw "read only property! please use currentIndex instead"; },
  });
  pub.moveToNext = moveToNext.bind(priv);
  pub.moveToPrevious = moveToPrevious.bind(priv);
  return pub;
}

module.exports = initializeSlider;

// constants

var Layout = {
  SLIDER: 'hermes-layout--slider',
  SLIDE: 'hermes-layout--slide',
  BACKGROUND: 'hermes-layout--background',
  CONTENT: 'hermes-layout--content',
  INNER: 'hermes-layout--inner',
  ARROW: 'hermes-layout--arrow',
  ARROW_LEFT: 'hermes-layout--arrow-left',
  ARROW_RIGHT: 'hermes-layout--arrow-right',
  DOTS: 'hermes-layout--dots',
  DOT: 'hermes-layout--dot',
};

var Selector = (function () {
  var selectors = {};
  for (var name in Layout) {
    selectors[name] = '.' + Layout[name];
  }
  return selectors;
}());

var Option = {
  DEFAULTS: 'hermes-defaults',
  AUTOSTART: 'hermes-autostart',
  AUTOPLAY: 'hermes-autoplay',
  CREATE_ARROWS: 'hermes-create-arrows',
  CREATE_DOTS: 'hermes-create-dots',
  ARROW_KEYS: 'hermes-arrow-keys',
};

var Flag = {
  SLIDE_FROM: 'hermes-slide-from',
  SLIDE_TO: 'hermes-slide-to',
  UPGRADED: 'is-upgraded',
  ACTIVE: 'is-active',
};

var Regexp = {
  TRANSITION: new RegExp('hermes-transition--([^ ]+)', 'g'),
};

return;

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
  var elem = document.createElement("div");
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
    priv.hermes.addPhaseChangeTrigger(content);

    var background = slide.querySelector(Selector.BACKGROUND);
    if (background === null) {
      slide.insertBefore(create(Layout.BACKGROUND), content);
    }
  });
}

function setOptions(priv) {
  var cl = priv.elem.classList;

  if (cl.contains(Option.DEFAULTS)) {
    cl.add(Option.AUTOSTART);
    cl.add(Option.AUTOPLAY);
    cl.add(Option.ARROW_KEYS);
    cl.add(Option.CREATE_ARROWS);
    cl.add(Option.CREATE_DOTS);
  }

  if (cl.contains(Option.CREATE_ARROWS)) {
    createArrowButtons(priv);
  }
  if (cl.contains(Option.CREATE_DOTS)) {
    createDotButtons(priv);
  }
  if (cl.contains(Option.ARROW_KEYS)) {
    window.addEventListener('keydown', keyBasedMove.bind(priv));
  }
  if (cl.contains(Option.AUTOSTART)) {
    window.setTimeout(start.bind(priv), 100);
  }
}

function createArrowButtons(priv) {
  var previousButton = create(Layout.ARROW, Layout.ARROW_LEFT);
  previousButton.addEventListener('click', moveToPrevious.bind(priv));
  priv.elem.appendChild(previousButton);

  var nextButton = create(Layout.ARROW, Layout.ARROW_RIGHT);
  nextButton.addEventListener('click', moveToNext.bind(priv));
  priv.elem.appendChild(nextButton);
}

function createDotButtons(priv) {
  var dots = create(Layout.DOTS);
  priv.elem.appendChild(dots);

  for (var i = 0; i < priv.slides.length; ++i) {
    var dot = create(Layout.DOT);
    dot.addEventListener('click', moveTo.bind(priv, i));
    dots.appendChild(dot);
    priv.slides[i].dot = dot;
  }
}

function keyBasedMove(event) {
  var priv = this;

  switch (event.key) {
    case 'ArrowLeft': moveToPrevious.call(priv); break;
    case 'ArrowRight': moveToNext.call(priv); break;
  }
}

function start() {
  // separate start procedure is needed because
  // only one slide is seen in the first transition
  var priv = this;
  precond.checkState(!priv.started, 'slider is already started');
  priv.started = true;

  var to = priv.slides[priv.toIndex];
  to.classList.add(Flag.SLIDE_TO);
  if (to.id !== null) {
    addTempClass.call(priv, 'hermes-slide-id-'+ to.id);
  }
  if (to.dot !== undefined) {
    to.dot.classList.add(Flag.ACTIVE);
  }

  addTempClass.call(priv, priv.chooseTransition());
  priv.hermes.startTransition();
}

// slide change functions

function moveToNext() {
  var priv = this;
  moveTo.call(priv, (priv.toIndex + 1) % priv.slides.length);
}

function moveToPrevious() {
  var priv = this;
  moveTo.call(priv, (priv.toIndex - 1 + priv.slides.length) % priv.slides.length);
}

function moveTo(i) {
  var priv = this;
  precond.checkState(priv.started, 'slider not started');
  precond.checkIsNumber(i, 'given index is not a number');

  if (i <= priv.slides.length) {
    i %= priv.slides.length;
  }
  if (i === priv.toIndex) {
    return;
  }


  var from = priv.slides[priv.fromIndex];
  var to = priv.slides[priv.toIndex];
  from.classList.remove(Flag.SLIDE_FROM);
  to.classList.remove(Flag.SLIDE_TO);
  if (to.dot !== undefined) {
    to.dot.classList.remove(Flag.ACTIVE);
  }
  removeTempClasses.call(priv);

  priv.fromIndex = priv.toIndex;
  priv.toIndex = i;
  from = priv.slides[priv.fromIndex];
  to = priv.slides[priv.toIndex];
  from.classList.add(Flag.SLIDE_FROM);
  to.classList.add(Flag.SLIDE_TO);
  if (to.id !== null) {
    addTempClass.call(priv, 'hermes-slide-id-'+ to.id);
  }
  if (to.dot !== undefined) {
    to.dot.classList.add(Flag.ACTIVE);
  }

  addTempClass.call(priv, priv.chooseTransition());
  priv.hermes.startTransition();
}

function addTempClass(className) {
  var priv = this;
  priv.tempClasses.push(className);
  priv.elem.classList.add(className);
}

function removeTempClasses() {
  var priv = this;
  priv.tempClasses.forEach(function(className) {
    priv.elem.classList.remove(className);
  });
  priv.tempClasses = [];
}

function onPhaseChange(phase) {
  var priv = this;
  if (phase === 'hermes-after-transition' && priv.elem.classList.contains(Option.AUTOPLAY)) {
    moveToNext.call(priv);
  }
}

// transition change functions

function chooseTransition() {
  var priv = this;
  var match = priv.slides[priv.toIndex].className.match(Regexp.TRANSITION);
  return (match? match[0]: false) || random(priv.transitions);
}

function random(array) {
  if (array.length === 0) {
    return "hermes-no-transition";
  }
  return array[parseInt(Math.random() * array.length)];
}

