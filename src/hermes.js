(function () {
  'use strict';

  // turn off vanilla behavior (vertical scroll bar)
  var sliderElems = document.querySelectorAll(Selector.SLIDER);
  for (var i = 0; i < sliderElems.length; ++i) {
    sliderElems[i].classList.add(Class.UPGRADED);
  }

  // defer slider initialization
  window.addEventListener('load', function() {
    var slider = require('./node/slider');

    for (var i = 0; i < sliderElems.length; ++i) {
      slider(sliderElems[i]);
    }
  });
}());

