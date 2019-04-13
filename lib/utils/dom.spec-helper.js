/*

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

var DOMTokenList = require('../polyfills/dom-token-list');

/**
 * Why would I use a browser for unit testing when I have node? ;)
 */

var nextId = 0;

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/EventTarget
 */
function EventTarget() {
  var that = this;
  that._instanceId = nextId++;

  var listeners = {};
  that.addEventListener = function(eventType, callback) {
    (listeners[eventType] = listeners[eventType] || []).push(callback);
  };
  that.removeEventListener = function(eventType, callback) {
    listeners[eventType].splice(listeners[eventType].indexOf(callback), 1);
  };
  that.dispatchEvent = function(event) {
    if (!event.target) {
      event.target = that;
    }
    (listeners[event.type] || []).forEach(function(listener) {
      listener.apply(that, [ event ]);
    });
  };

  // just for testing purposes
  that.$clearEventListeners = function() {
    listeners = {};
  };
  that.toString = function() {
    return '['+ that.__proto__.constructor.name +' #'+ that._instanceId +']';
  };

  return that;
}

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/Node
 */
function Node(nodeName) {
  var that = this;
  EventTarget.call(that);

  that.nodeName = nodeName;
  that.parentNode = null;
  that.childNodes = [];

  that.appendChild = function(node) {
    if (node.parentNode !== null) {
      node.parentNode.removeChild(node);
    }
    that.childNodes.push(node);
    node.parentNode = that;
  };
  that.removeChild = function(node) {
    that.childNodes.splice(that.childNodes.indexOf(node), 1);
    node.parentNode = null;
  };
  that.insertBefore = function(node, before) {
    if (node.parentNode !== null) {
      node.parentNode.removeChild(node);
    }
    that.childNodes.splice(that.childNodes.indexOf(before), 0, node);
    node.parentNode = that;
  };

  var superDispatchEvent = that.dispatchEvent;
  that.dispatchEvent = function(event) {
    superDispatchEvent.call(that, event);

    if (event.bubbles && that.parentNode) {
      that.parentNode.dispatchEvent(event);
    }
  };

  return that;
}

Node.prototype = new EventTarget();
Object.defineProperty(Node.prototype, 'nextSibling', {
  get: function() { return getSibling(this, +1); },
  enumerable: true,
});
Object.defineProperty(Node.prototype, 'previousSibling', {
  get: function() { return getSibling(this, -1); },
  enumerable: true,
});

// returns a sibling of given node
function getSibling(node, relativeIndex) {
  var parent = node.parentNode;
  if (parent === null) {
    return null;
  }
  var currentIndex = parent.childNodes.indexOf(node);
  var siblingIndex = currentIndex + relativeIndex;
  if (siblingIndex < 0 || siblingIndex > parent.childNodes.length - 1) {
    return null;
  }
  return parent.childNodes[siblingIndex];
}

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/Element
 */
function Element(nodeName) {
  var that = this;
  Node.call(that, nodeName);

  that.id = null;
  that.className = '';
  that.classList = new DOMTokenList(that, 'className');
  that.style = new CSSStyleDeclaration();

  that.querySelectorAll = function(selector) {
    var match = selector.match(/^\.([^\s]+)$/);
    if (!match) {
      throw new Error('only simple class selectors are supported');
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

  that.querySelector = function(selector) {
    var nodes = that.querySelectorAll(selector);
    return nodes[0] || null;
  };

  return that;
}

Element.prototype = new Node();

/**
 * @see https://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
 */
function CSSStyleDeclaration() {
}
CSSStyleDeclaration.prototype = {
  transform: null,
  transition: null,
};

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/Event
 */
function Event(type, target) {
  var that = this;

  that.type = type;
  that.target = target;
  that.bubbles = true;

  return that;
}

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/TransitionEvent
 */
function TransitionEvent(type, target, propertyName) {
  var that = this;
  Event.call(that, type, target);

  that.propertyName = propertyName;

  return that;
}

TransitionEvent.prototype = new Event();

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/KeyboardEvent
 */
function KeyboardEvent(type, key) {
  var that = this;
  Event.call(that, type);

  that.key = key;

  return that;
}

KeyboardEvent.prototype = new Event();

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/MouseEvent
 */
function MouseEvent(type, target) {
  var that = this;
  Event.call(that, type, target);

  return that;
}

MouseEvent.prototype = new Event();

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/AnimationEvent
 */
function AnimationEvent(type, animationName) {
  var that = this;
  Event.call(that, type);
  that.animationName = animationName;

  return that;
}

AnimationEvent.prototype = new Event();

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/Document
 */
function Document() {
  var that = this;
  EventTarget.call(that);

  that.createElement = function(nodeName) {
    return new Element(nodeName);
  };

  return that;
}

Document.prototype = new EventTarget();

/**
 * @see https://developer.mozilla.org/pl/docs/Web/API/Window
 */
function Window(document) {
  var that = this;
  EventTarget.call(that);

  that.document = document;

  var idOffset = 0;
  var later = [];
  that.setTimeout = function(func, timeout) {
    var i = 0;
    for (; i < later.length; ++i) {
      if (later[i].timeout > timeout) {
        break;
      }
    }
    var id = idOffset + later.length;
    later.splice(i, 0, { id: id, func: func, timeout: timeout, args: [].slice.call(arguments, 2) });
    return id;
  };
  this.clearTimeout = function(id) {
    for (var i = 0; i < later.length; ++i) {
      if (later[i].id === id) {
        later[i].func = function() {};
        break;
      }
    }
  };
  that.$applyTimeouts = function() {
    var work = later;
    later = [];

    idOffset += work.length;

    while (work.length) {
      var w = work.shift();
      w.func.apply(that, w.args);
    }
  };

  return that;
}

Window.prototype = new EventTarget();

var document = new Document();
var window = new Window(document);

global.EventTarget = EventTarget;
global.Node = Node;
global.Element = Element;
global.DOMTokenList = DOMTokenList;
global.CSSStyleDeclaration = CSSStyleDeclaration;
global.TransitionEvent = TransitionEvent;
global.KeyboardEvent = KeyboardEvent;
global.MouseEvent = MouseEvent;
global.AnimationEvent = AnimationEvent;
global.Document = Document;
global.Window = Window;

global.window = window;
global.document = document;

