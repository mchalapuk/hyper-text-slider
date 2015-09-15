'use strict';

var slider = require('./slider');

describe('slider', function() {

  function create(className) {
    var elem = document.createElement('div');
    elem.className = className;
    return elem;
  }
  function createSliderElement(slidesCount) {
    var slider = create('hermes-layout--slider');
    while (slidesCount--) {
      slider.appendChild(create('hermes-layout--slide'));
    }
    return slider;
  }

  var illegalArgs = [
    { name: 'undefined', value: undefined, },
    { name: 'null', value: null, },
    { name: 'not element', value: [], },
    { name: 'empty element', value: document.createElement('div'), },
    { name: 'slider element containing one slide', value: createSliderElement(1), },
  ];
  illegalArgs.forEach(function(arg) {
    describe('given '+ arg.name +' argument,', function() {
      describe('when created', function() {
        it('throws exception', function() {
          expect(function() { slider(arg.value); }).toThrow();
        });
      });
    });
  });

  var legalArgs = [
    { name: 'slider element containing 2 slides', value: createSliderElement(2), },
    { name: 'slider element containing 3 slides', value: createSliderElement(3), },
    { name: 'slider element containing 10 slides', value: createSliderElement(10), },
  ];
  legalArgs.forEach(function(arg) {
    describe('given '+ arg.name +' argument,', function() {
      describe('when created', function() {
        it('returns object instance', function() {
          var testedInstance = slider(arg.value);
          expect(testedInstance).toBeDefined();
        });
      });
    });
  });

  describe('slider with 3 slides and "hermes-transition--test" class', function() {
    var sliderElement;
    var testedSlider;
    beforeEach(function() {
      sliderElement = createSliderElement(3);
      sliderElement.classList.add('hermes-transition--test');
      testedSlider = slider(sliderElement);
    });

    describe('when just after creation', function() {
      it('then does not contain "hermes-transition--test" class', function() {
        expect(sliderElement.classList.contains('hermes-transition--test')).toBe(false);
      });

      it('then contains 3 slides', function() {
        expect(testedSlider.slides.length).toEqual(3);
      });

      it('then contains null slides.current', function() {
        expect(testedSlider.slides.current).toBe(null);
      });

      it('then contains no slide with "hermes-slide-from" ot "hermes-slide-to" flags', function() {
        testedSlider.slides.forEach(function(slide) {
          expect(slide.classList.contains('hermes-slide-from')).toBe(false);
          expect(slide.classList.contains('hermes-slide-to')).toBe(false);
        });
      });
    });

    describe('when after calling #start', function() {
      beforeEach(function() {
        testedSlider.start();
      });

      it('then contains "hermes-transition--test" class', function() {
        expect(sliderElement.classList.contains('hermes-transition--test')).toBe(true);
      });

      it('then contains slides.current of value 0', function() {
        expect(testedSlider.slides.current).toBe(0);
      });

      it('then contains first slide with "hermes-slide-to" flag', function() {
        expect(testedSlider.slides[0].classList.contains('hermes-slide-to')).toBe(true);
      });
      it('then contains first slide without "hermes-slide-from" flag', function() {
        expect(testedSlider.slides[0].classList.contains('hermes-slide-from')).toBe(false);
      });
      it('then contains second slide without "hermes-slide-from" or "hermes-slide-to" flag', function() {
        expect(testedSlider.slides[1].classList.contains('hermes-slide-from')).toBe(false);
        expect(testedSlider.slides[1].classList.contains('hermes-slide-to')).toBe(false);
      });
      it('then contains third slide without "hermes-slide-from" or "hermes-slide-to" flag', function() {
        expect(testedSlider.slides[2].classList.contains('hermes-slide-from')).toBe(false);
        expect(testedSlider.slides[2].classList.contains('hermes-slide-to')).toBe(false);
      });

      it('then throws exception when calling #start again', function() {
        expect(function() { testedSlider.start(); }).toThrow();
      });
    });
  });
});

