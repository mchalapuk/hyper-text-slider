/*!

   Copyright 2016 Maciej Chałapuk

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

module.exports = Upgrader;

var feature = require('../utils/detect-features');
var DOM = require('../utils/dom');
var check = require('../utils/check');

var Layout = require('../enums/layout');
var Flag = require('../enums/flag');
var Theme = require('../enums/theme');
var Transition = require('../enums/transition');
var Pattern = require('../enums/pattern');
var Option = require('../enums/option');
var Common = require('../enums/common');

var Selector = (function() {
  var selectors = {};
  for (var name in Layout) {
    selectors[name] = '.' + Layout[name];
  }
  return selectors;
}());

var themeGroups = {};
themeGroups[Theme.DEFAULTS] = [
  Theme.WHITE,
  Theme.DEFAULT_DOTS,
  Theme.HOVER_OPAQUE_DOTS,
  Theme.DEFAULT_ARROWS,
  Theme.HOVER_OPAQUE_ARROWS,
  Theme.RESPONSIVE_ARROWS,
];
themeGroups[Theme.DEFAULT_CONTROLS] = [
  Theme.DEFAULT_ARROWS,
  Theme.DEFAULT_DOTS,
];
themeGroups[Theme.HOVER_VISIBLE_CONTROLS] = [
  Theme.HOVER_VISIBLE_ARROWS,
  Theme.HOVER_VISIBLE_DOTS,
];
themeGroups[Theme.HOVER_OPAQUE_CONTROLS] = [
  Theme.HOVER_OPAQUE_ARROWS,
  Theme.HOVER_OPAQUE_DOTS,
];

var DEFAULT_TRANSITIONS = [
  Transition.ZOOM_OUT_IN,
  Transition.BG_ZOOM_IN_OUT,
];

function Upgrader(elem) {
  check(elem, 'elem').is.anInstanceOf(Element);

  var priv = {};
  priv.onSlideUpgraded = noop;
  priv.elem = elem;
  priv.dotsElement = null;
  priv.defaultThemes = null;
  priv.started = false;

  var pub = {};
  pub.start = start.bind(pub, priv);

  Object.defineProperty(pub, 'onSlideUpgraded', {
    set: function(callback) { priv.onSlideUpgraded = callback; },
    get: function() { return priv.onSlideUpgraded; },
    enumerable: true,
  });
  return pub;
}

function start(priv) {
  check(priv.started, 'upgrader.started').is.False();
  priv.started = true;

  expandOptionGroups(priv);

  priv.defaultThemes = DOM.extractClassNames(priv.elem, Pattern.THEME) || [ Theme.DEFAULTS ];
  priv.defaultTransitions = DOM.extractClassNames(priv.elem, Pattern.TRANSITION) || DEFAULT_TRANSITIONS;

  createArrowButtons(priv);
  createDotButtons(priv);
  upgradeSlides(priv);

  var list = priv.elem.classList;
  if (!list.contains(Layout.SLIDER)) {
    list.add(Layout.SLIDER);
  }
  list.add(Flag.UPGRADED);
}

function expandOptionGroups(priv) {
  var list = priv.elem.classList;

  if (list.contains(Common.DEFAULTS)) {
    list.add(Option.DEFAULTS);
    list.add(Theme.DEFAULTS);
  }
  if (list.contains(Option.DEFAULTS)) {
    list.add(Option.AUTOPLAY);
    list.add(Option.ARROW_KEYS);
  }
}

function createArrowButtons(priv) {
  var previousButton = create(Layout.ARROW, Layout.CONTROLS, Layout.ARROW_LEFT);
  priv.elem.appendChild(previousButton);

  var nextButton = create(Layout.ARROW, Layout.CONTROLS, Layout.ARROW_RIGHT);
  priv.elem.appendChild(nextButton);
}

function createDotButtons(priv) {
  priv.dotsElement = create(Layout.CONTROLS, Layout.DOTS);
  priv.elem.appendChild(priv.dotsElement);
}

function upgradeSlides(priv) {
  priv.elem.addEventListener(feature.animationEventName, maybeUpgradeSlide, false);

  function maybeUpgradeSlide(evt) {
    if (evt.animationName === 'hermesSlideInserted' &&
        evt.target.parentNode === priv.elem &&
        !evt.target.classList.contains(Layout.CONTROLS)) {
      upgradeSlide(priv, evt.target);
    }
  }
}

function upgradeSlide(priv, slideElement) {
  supplementClassNames(priv, slideElement);
  Object.keys(themeGroups).forEach(expandThemeGroup.bind(null, priv, slideElement));

  var contentElement = slideElement.querySelector(Selector.CONTENT);
  var backgroundElement = slideElement.querySelector(Selector.BACKGROUND);

  if (contentElement !== null && backgroundElement !== null) {
    createDot(priv, slideElement);
    priv.onSlideUpgraded.call(null, slideElement);
    return;
  }

  if (contentElement === null) {
    contentElement = createContentElement(slideElement);
    slideElement.appendChild(contentElement);
  }

  if (backgroundElement === null) {
    backgroundElement = createBackgroundElement(slideElement);
    slideElement.insertBefore(backgroundElement, contentElement);
  }

  reinsertNode(slideElement);
}

function supplementClassNames(priv, slideElement) {
  if (!slideElement.classList.contains(Layout.SLIDE)) {
    slideElement.classList.add(Layout.SLIDE);
  }
  if (!DOM.findClassNames(slideElement, Pattern.THEME)) {
    priv.defaultThemes.forEach(function(className) {
      slideElement.classList.add(className);
    });
  }
  if (!DOM.findClassNames(slideElement, Pattern.TRANSITION)) {
    priv.defaultTransitions.forEach(function(className) {
      slideElement.classList.add(className);
    });
  }
}

function expandThemeGroup(priv, slideElement, groupName) {
  if (slideElement.classList.contains(groupName)) {
    themeGroups[groupName].forEach(function(theme) { slideElement.classList.add(theme); });
  }
}

function createDot(priv, slideElement) {
  var dot = create(Layout.CONTROLS, Layout.DOT);
  var index = [].indexOf.call(slideElement.parentNode.childNodes, slideElement);

  var parent = priv.dotsElement;
  if (index === parent.length) {
    parent.appendChild(dot);
  } else {
    parent.insertBefore(dot, parent.childNodes[index]);
  }
}

function createContentElement(slideElement) {
  var contentElement = create(Layout.CONTENT);
  while (slideElement.childNodes.length) {
    contentElement.appendChild(slideElement.childNodes[0]);
  }
  return contentElement;
}

function createBackgroundElement() {
  return create(Layout.BACKGROUND);
}

function reinsertNode(node) {
  var parent = node.parentNode;
  var next = node.nextSibling;
  parent.removeChild(node);
  if (next) {
    parent.insertBefore(node, next);
  } else {
    parent.appendChild(node);
  }
}

function create() {
  var elem = document.createElement('div');
  elem.className = [].join.call(arguments, ' ');
  return elem;
}

function noop() {
  // noop
}

/*
  eslint-env node, browser
 */

/*
  eslint
    complexity: [2, 6],
 */

