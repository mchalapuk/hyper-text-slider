'use strict';

// from Modernizr
function getTransitionEventName() {
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
  return 'transitionend';
}

function getTransformPropertyName() {
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
}

var transitionEventName = getTransitionEventName();
var transformPropertyName = getTransformPropertyName();

module.exports = {
  transitionEventName: transitionEventName,
  transformPropertyName: transformPropertyName,
};

