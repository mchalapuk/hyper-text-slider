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

/*
  eslint-env node, browser
*/
var precond = require('precond');
var dom = require('./_dom');
var Phase = require('./classnames/_phases');

function summonHermes(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.phase = null;
  priv.listeners = [];

  var pub = {};
  bindMethods(pub, [
    getPhase,
    nextPhase,
    addPhaseListener,
    removePhaseListener,
    addPhaseTrigger,
    removePhaseTrigger,
    startTransition,
  ], priv);
  return pub;
}

module.exports = summonHermes;
module.exports.Phase = Phase;

function getPhase(priv) {
  return priv.phase;
}

function setPhase(priv, phase) {
  if (priv.phase !== null) {
    priv.elem.classList.remove(priv.phase);
  }
  priv.phase = phase;

  if (phase !== null) {
    priv.elem.classList.add(phase);
  }
  priv.listeners.forEach(function(listener) {
    listener(phase);
  });
}

function addPhaseListener(priv, listener) {
  priv.listeners.push(listener);
}

function removePhaseListener(priv, listener) {
  priv.listeners.splice(priv.listeners.indexOf(listener), 1);
}

function nextPhase(priv) {
  var phases = [ null, Phase.BEFORE_TRANSITION, Phase.DURING_TRANSITION, Phase.AFTER_TRANSITION ];
  setPhase(priv, phases[(phases.indexOf(priv.phase) + 1) % phases.length]);
}

function startTransition(priv) {
  setPhase(priv, Phase.BEFORE_TRANSITION);
}

function addPhaseTrigger(priv, elem, transitionProperty) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  var property = transitionProperty || 'transform';
  precond.checkIsString(property, 'transitionProperty is not a String');

  if (property === 'transform') {
    // maybe a prefixed version
    property = dom.transformPropertyName;
  }

  elem.hermesPhaseTrigger = function(event) {
    if (event.propertyName !== property || event.target !== this) {
      return;
    }
    nextPhase(priv);
  };
  elem.addEventListener(dom.transitionEventName, elem.hermesPhaseTrigger);
}

function removePhaseTrigger(priv, elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  precond.checkIsFunction(elem.hermesPhaseTrigger, 'no trigger found on given element');

  elem.removeEventListener(dom.transitionEventName, elem.hermesPhaseTrigger);
}

function bindMethods(wrapper, methods, arg) {
  methods.forEach(function(method) {
    wrapper[method.name] = method.bind(wrapper, arg);
  });
}

