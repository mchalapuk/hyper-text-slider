'use strict';

var precond = require('precond');
var dom = require('./_dom');

function summonHermes(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.phase = null;
  priv.listeners = [];
  priv.setPhase = setPhase;

  var pub = {};
  pub.getPhase = getPhase.bind(priv);
  pub.nextPhase = nextPhase.bind(priv);
  pub.addPhaseChangeListener = addPhaseChangeListener.bind(priv);
  pub.removePhaseChangeListener = removePhaseChangeListener.bind(priv);
  pub.addPhaseChangeTrigger = addPhaseChangeTrigger;
  pub.removePhaseChangeTrigger = removePhaseChangeTrigger;
  pub.startTransition = startTransition.bind(priv);
  return pub;
}

module.exports = summonHermes;

var Phase = summonHermes.Phase = {
  BEFORE_TRANSITION: 'hermes-before-transition',
  DURING_TRANSITION: 'hermes-during-transition',
  AFTER_TRANSITION: 'hermes-after-transition',
};

return;

function getPhase() {
  var priv = this;
  return priv.phase;
}

function setPhase(phase) {
  var priv = this;

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

function addPhaseChangeListener(listener) {
  var priv = this;
  priv.listeners.push(listener);
}

function removePhaseChangeListener(listener) {
  var priv = this;
  priv.listeners.splice(priv.listeners.indexOf(listener), 1);
}

function nextPhase() {
  var priv = this;

  if (priv.phase === null) {
    priv.setPhase(Phase.BEFORE_TRANSITION);
  } else if (priv.phase === Phase.BEFORE_TRANSITION) {
    priv.setPhase(Phase.DURING_TRANSITION);
  } else if (priv.phase === Phase.DURING_TRANSITION) {
    priv.setPhase(Phase.AFTER_TRANSITION);
  } else if (priv.phase === Phase.AFTER_TRANSITION) {
    priv.setPhase(null);
  }
}

function startTransition() {
  var priv = this;

  priv.setPhase(Phase.BEFORE_TRANSITION);
}

function addPhaseChangeTrigger(elem, transitionProperty) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  transitionProperty = transitionProperty || 'transform';
  precond.checkIsString(transitionProperty, 'transitionProperty is not a String');

  if (transitionProperty === "transform") {
    transitionProperty = dom.transformPropertyName; // maybe a prefixed version
  }

  var pub = this;
  elem.hermesPhaseChangeTrigger = function(event) {
    if (event.propertyName !== transitionProperty || event.target !== this) {
      return;
    }
    pub.nextPhase();
  };
  elem.addEventListener(dom.transitionEventName, elem.hermesPhaseChangeTrigger);
}

function removePhaseChangeTrigger(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  precond.checkIsFunction(elem.hermesPhaseChangeTrigger, 'no trigger found on given element');

  elem.removeEventListener(dom.transitionEventName, elem.hermesPhaseChangeTrigger);
}

