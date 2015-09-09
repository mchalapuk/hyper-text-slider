
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

function create(className) {
  var elem = document.createElement("div");
  elem.className = className;
  return elem;
}

function removeClass(elem, classRegexp) {
  elem.className = elem.className.replace(classRegexp, "");
}

var transitionEventName = getTransitionEventName();
var transformPropertyName = getTransformPropertyName();

module.exports = {
  create: create,
  removeClass: removeClass,
  transitionEventName: transitionEventName,
  transformPropertyName: transformPropertyName,
};

