(function () {
  'use strict';

  var transitionRegexp = new RegExp("hermes-transition-([^ ]+)", "g");
  var phaseRegexp = new RegExp("hermes-(before|during|after)-transition", "g");

  var Phase = {
    BEFORE_TRANSITION: "hermes-before-transition",
    DURING_TRANSITION: "hermes-during-transition",
    AFTER_TRANSITION: "hermes-after-transition"
  };

  // turn off vanilla behavior (vertical scroll bar)
  var sliders = document.querySelectorAll(".hermes-layout__slider");
  for (var i = 0; i < sliders.length; ++i) {
    addClass(sliders[i], "is-upgraded");
  }

  // defer slider initialization
  window.addEventListener('load', function() {
    for (var i = 0; i < sliders.length; ++i) {
      initializeSlider(sliders[i]);
    }
  });

  // from Modernizr
  var transitionEventName = (function () {
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (var t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }());

  var transformPropertyName = (function () {
    var el = document.createElement('fakeelement');
    var transforms = {
      'transform': 'transform',
      'OTransform': '-o-transform',
      'MozTransform': '-moz-transform',
      'WebkitTransform': '-webkit-transform'
    };

    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        return transforms[t];
      }
    }
  }());

  return; //

  function create(className) {
    var elem = document.createElement("div");
    elem.className = className;
    return elem;
  }

  function hasClass(elem, className) {
    return elem.className.search(className) !== -1;
  }
  function addClass(elem, className) {
    if (hasClass(elem, className)) {
      throw "element already has specified class: "+ className;
    }
    elem.className += (" "+ className);
  }
  function removeClass(elem, classRegexp) {
    elem.className = elem.className.replace(classRegexp, "");
  }

  function initializeSlider(slider) {
    var transitions = scanForTransitions(slider);
    removeClass(slider, transitionRegexp);

    var slides = slider.querySelectorAll('.hermes-layout__slide');
    var fromIndex = 1;
    var toIndex = 0;
    var transitionPhase = null;

    var dots = create("hermes-layout__slider-dots");
    slider.appendChild(dots);

    for (var i = 0; i < slides.length; ++i) {
      var dot = create("hermes-layout-dot");
      dot.addEventListener('click', createSliderMoveCallback(i));
      dots.appendChild(dot);

      var slide = slides[i];
      slide.querySelector(".hermes-layout-content").
        addEventListener(transitionEventName, onContentTransitionEnd);
      slide.dot = dot;
    }

    var previousButton = create("hermes-arrow-left");
    previousButton.addEventListener('click', moveToPrevious);
    slider.appendChild(previousButton);

    var nextButton = create("hermes-arrow-right");
    nextButton.addEventListener('click', moveToNext);
    slider.appendChild(nextButton);

    if (hasClass(slider, "hermes-arrow-keys")) {
      window.addEventListener('keydown', keyBasedMove);
    }

    setTimeout(start, 100);

    return;

    // function declarations

    function chooseTransition(from, to) {
      var fromToRegexp = new RegExp("hermes-transition-from-"+ from +"-to-"+ to +"-([^ ]+)", "g");
      var fromToMatch = slider.className.match(fromToRegexp);
      if (fromToMatch) {
        return fromToMatch[0].replace("hermes-transition-from-"+ from +"-to-"+ to +"-", "");
      }
      var toMatch = slides[toIndex].className.match(transitionRegexp);
      if (toMatch) {
        return toMatch[0].replace("hermes-transition-");
      }
      return randomTransition();
    }

    function randomTransition() {
      if (transitions.length === 0) {
        throw "no transitions declared on slider";
      }
      return transitions[parseInt(Math.random() * transitions.length)];
    }

    function keyBasedMove(event) {
      switch (event.key) {
        case "ArrowLeft": moveToPrevious(); break;
        case "ArrowRight": moveToNext(); break;
      }
    }

    function moveToNext() {
      moveTo((toIndex + 1) % slides.length);
    }
    function moveToPrevious() {
      moveTo((toIndex - 1 + slides.length) % slides.length);
    }

    function moveTo(i) {
      if (i === toIndex) {
        return;
      }

      var from = slides[fromIndex];
      var to = slides[toIndex];
      removeClass(from, "hermes-slide-from");
      removeClass(to, "hermes-slide-to");
      removeClass(to.dot, "is-active");
      removeClass(slider, transitionRegexp);

      fromIndex = toIndex;
      toIndex = i;
      from = slides[fromIndex];
      to = slides[toIndex];
      addClass(from, "hermes-slide-from");
      addClass(to, "hermes-slide-to");
      addClass(to.dot, "is-active");

      addClass(slider, "hermes-transition-"+ chooseTransition(fromIndex, toIndex));
      setTransitionPhase(Phase.BEFORE_TRANSITION);
    }

    // separate start procedure is needed because
    // only one slide is seen in the first transition
    function start() {
      var to = slides[toIndex];
      addClass(to, "hermes-slide-to");
      addClass(to.dot, "is-active");

      transitionPhase = Phase.BEFORE_TRANSITION;
      addClass(slider, "hermes-transition-"+ chooseTransition(fromIndex, toIndex));
      addClass(slider, Phase.BEFORE_TRANSITION);
      addClass(slides[toIndex], Phase.BEFORE_TRANSITION);
    }

    function createSliderMoveCallback(i) {
      return function() { moveTo(i); };
    }

    function onContentTransitionEnd(event) {
      if (event.propertyName !== transformPropertyName) {
        return;
      }
      if (event.target !== slides[toIndex].querySelector(".hermes-layout-content")) {
        return;
      }

      if (transitionPhase === Phase.BEFORE_TRANSITION) {
        setTransitionPhase(Phase.DURING_TRANSITION);

      } else if(transitionPhase === Phase.DURING_TRANSITION) {
        setTransitionPhase(Phase.AFTER_TRANSITION);
        if (hasClass(slider, "hermes-autoplay")) {
          moveToNext();
        }
      }
    }

    function setTransitionPhase(phaseClass) {
      removeClass(slider, phaseRegexp);
      removeClass(slides[fromIndex], phaseRegexp);
      removeClass(slides[toIndex], phaseRegexp);
      addClass(slider, phaseClass);
      addClass(slides[fromIndex], phaseClass);
      addClass(slides[toIndex], phaseClass);

      transitionPhase = phaseClass;
    }
  }

  function scanForTransitions(slider) {
    var transitions = [];
    var matches = slider.className.match(transitionRegexp);
    if (matches) {
      for (var i = 0; i < matches.length; ++i) {
        transitions.push(matches[i].replace("hermes-transition-", ""));
      }
    }
    return transitions;
  }

}());

