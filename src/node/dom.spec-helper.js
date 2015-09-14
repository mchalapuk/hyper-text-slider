'use strict';

function EventSource() {
  var that = this;

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

function Node(nodeName) {
  var that = EventSource.call(this);

  that.nodeName = nodeName;
  that.childNodes = [];
  that.appendChild = function (node) {
    that.childNodes.push(node);
  };

  return that;
}

function Element(nodeName) {
  var that = Node.call(this, nodeName);

  that.className = "";
  that.classList = new DOMTokenList(that, 'className');
  that.style = new CSS2Properties();

  that.querySelectorAll = function (selector) {
    var match = selector.match(/^\.([^\s]+)$/);
    if (!match) {
      throw "only simple class selectors are supported";
    }

    var className = match[1];
    var results = [];
    that.childNodes.forEach(function(node) {
      if (node.classList.contains(className)) {
        results.push(node);
      }
    });

    return results;
  };

  that.querySelector = function (selector) {
    var nodes = that.querySelectorAll(selector);
    return nodes[0] || null;
  };

  return that;
}

function DOMTokenList(object, key) {
  var that = this;

  that.add = function() {
    object[key] += ((object[key].length? ' ': '') + [].slice.apply(arguments).join(' '));
  };
  that.remove = function(token) {
    object[key] = object[key].replace(new RegExp('\\b'+ token +'\\b\\s*'), '').replace(/^\\s*/, '');
  };
  that.contains = function(token) {
    return (object[key].search(new RegExp('\\b'+ token +'\\b')) !== -1);
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


function Document() {
  var that = this;

  that.createElement = function(nodeName) {
    return new Element(nodeName);
  };

  return that;
}

function Window(document) {
  var that = this;

  that.document = document;

  var later = [];
  that.setTimeout = function(f, t) {
    var i;
    for (i = 0; i < later.length; ++i) {
      if (later[i].timeout > t) {
        break;
      }
    }
    later.splice(i, 0, { func: f, timeout: t, });
  };
  that.$applyTimeouts = function() {
    var work = that.later;
    that.later = [];

    while (work.length) {
      work.shift()();
    }
  };

  return that;
}

var document = new Document();
var window = new Window(document);

global.Node = Node;
global.Element = Element;
global.DOMTokenList = DOMTokenList;
global.CSS2Properties = CSS2Properties;
global.TransitionEndEvent = TransitionEndEvent;
global.Document = Document;
global.Window = Window;

global.window = window;
global.document = document;

