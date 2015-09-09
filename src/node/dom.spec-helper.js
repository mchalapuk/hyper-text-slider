'use strict';

function Element(nodeName) {
  var that = this;

  that.nodeName = nodeName;
  that.className = "";
  that.classList = new DOMTokenList(that, 'className');
  that.style = new CSS2Properties();

  var listeners = {};
  that.addEventListener = function(eventType, callback) {
    (listeners[eventType] = listeners[eventType] || []).push(callback);
  };
  that.removeEventListener = function(eventType, callback) {
    listeners[eventType].splice(listeners[eventType].indexOf(callback), 1);
  };
  that.dispatchEvent = function(event) {
    (listeners[event.type] || []).forEach(function(listener) {
      listener.apply(that, [ event ]);
    });
  };

  return that;
}

function DOMTokenList(object, key) {
  var that = this;

  that.add = function() {
    object[key] += ((object[key].length? ' ': '') + [].slice.apply(arguments).join(' '));
  };
  that.contains = function(token) {
    return (object[key].search(new RegExp('(^| )'+ token +'( |$)')) !== -1);
  };
  Object.defineProperty(that, 'length', {
    get: function() {
      return (object[key].match(/[^\s]+/g) || []).length;
    },
  });

  return that;
}

function CSS2Properties() {
}
CSS2Properties.prototype = {
  'transform': null,
};

function TransitionEndEvent(target, propertyName) {
  var that = this;

  that.type = 'transitionend';
  that.target = target;
  that.propertyName = propertyName;

  return that;
}

var document = {
  createElement: function(nodeName) {
    return new Element(nodeName);
  },
};

var window = {
  document: document,
};

global.window = window;
global.document = document;
global.Element = Element;
global.DOMTokenList = DOMTokenList;
global.CSS2Properties = CSS2Properties;
global.TransitionEndEvent = TransitionEndEvent;

