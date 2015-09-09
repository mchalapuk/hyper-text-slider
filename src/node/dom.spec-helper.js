'use strict';

global.Element = function (nodeName) {
  var that = this;

  that.nodeName = nodeName;
  that.className = "";

  that.classList = {
    add: function(className) {
      that.className += className;
    },
    contains: function(className) {
      return (that.className.search(new RegExp('[^| ]'+ className +'[ |$]')) !== -1);
    },
  };

  that.style = {
    'transform': '',
  };

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
};

global.TransitionEndEvent = function(target, propertyName) {
  var that = this;

  that.type = 'transitionend';
  that.target = target;
  that.propertyName = propertyName;

  return that;
};

global.document = {
  createElement: function(nodeName) {
    return new global.Element(nodeName);
  }
};
global.window = {};

