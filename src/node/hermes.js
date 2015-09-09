'use strict';

var precond = require('precond');
var dom = require('./_dom');

function summonHermes(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.phase = null;
  priv.setPhase = setPhase;

  var pub = {};
  pub.getPhase = getPhase.bind(priv);
  pub.nextPhase = nextPhase.bind(priv);
  pub.addPhaseChangeTrigger = addPhaseChangeTrigger;
  pub.removePhaseChangeTrigger = removePhaseChangeTrigger;
  pub.startTransition = startTransition.bind(priv);
  return pub;
}

module.exports = summonHermes;

var Phase = {
  BEFORE_TRANSITION: 'hermes-before-transition',
  DURING_TRANSITION: 'hermes-during-transition',
  AFTER_TRANSITION: 'hermes-after-transition',
};

var Regexp = {
  PHASE: /hermes-(before|during|after)-transition/g,
};

function getPhase() {
  return this.phase;
}

function setPhase(phase) {
  dom.removeClass(this.elem, Regexp.PHASE);
  this.phase = phase;
  if (phase !== null) {
    this.elem.classList.add(phase);
  }
}

function nextPhase() {
  if (this.phase === null) {
    this.setPhase(Phase.BEFORE_TRANSITION);
  } else if (this.phase === Phase.BEFORE_TRANSITION) {
    this.setPhase(Phase.DURING_TRANSITION);
  } else if(this.phase === Phase.DURING_TRANSITION) {
    this.setPhase(Phase.AFTER_TRANSITION);
  } else if(this.phase === Phase.AFTER_TRANSITION) {
    this.setPhase(null);
  }
}

function startTransition() {
  this.setPhase(null);
  nextPhase.apply(this);
}

function addPhaseChangeTrigger(elem, transitionProperty) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  transitionProperty = transitionProperty || 'transform';
  precond.checkIsString(transitionProperty, 'transitionProperty is not a String');

  if (transitionProperty === "transform") {
    transitionProperty = dom.transformPropertyName; // maybe a prefixed version
  }

  var hermes = this;
  elem.hermesPhaseChangeTrigger = function(event) {
    if (event.propertyName !== transitionProperty || event.target !== this) {
      return;
    }
    hermes.nextPhase();
  };
  elem.addEventListener(dom.transitionEventName, elem.hermesPhaseChangeTrigger);
}

function removePhaseChangeTrigger(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  precond.checkIsFunction(elem.hermesPhaseChangeTrigger, 'no trigger found on given element');

  elem.removeEventListener(dom.transitionEventName, elem.hermesPhaseChangeTrigger);
}

