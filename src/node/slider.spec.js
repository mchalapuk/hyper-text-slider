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

      it('then contains null slides.currentIndex', function() {
        expect(testedSlider.slides.currentIndex).toBe(null);
      });
      it('then contains null slides.current', function() {
        expect(testedSlider.slides.current).toBe(null);
      });

      it('then contains no slide with "hermes-slide-from" or "hermes-slide-to" flags', function() {
        testedSlider.slides.forEach(function(slide) {
          expect(slide.classList.contains('hermes-slide-from')).toBe(false);
          expect(slide.classList.contains('hermes-slide-to')).toBe(false);
        });
      });

      it('slides contains "hermes-layout--background" element as first child', function() {
        testedSlider.slides.forEach(function(slide) {
          expect(slide.childNodes[0].classList.contains('hermes-layout--background')).toBe(true);
        });
      });
      it('slides contains "hermes-layout--content" element as second child', function() {
        testedSlider.slides.forEach(function(slide) {
          expect(slide.childNodes[1].classList.contains('hermes-layout--content')).toBe(true);
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

      it('then contains slides.currentIndex of value 0', function() {
        expect(testedSlider.slides.currentIndex).toBe(0);
      });
      it('then contains slides.current pointing to slides[0]', function() {
        expect(testedSlider.slides.current).toBe(testedSlider.slides[0]);
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

      it('then contains "hermes-before-transition" class', function() {
        expect(sliderElement.classList.contains('hermes-before-transition')).toBe(true);
      });
    });

    describe('when after setting current slide to 1', function() {
      beforeEach(function() {
        testedSlider.start();
        testedSlider.slides.currentIndex = 1;
      });

      it('then contains "hermes-before-transition" class', function() {
        expect(sliderElement.classList.contains('hermes-before-transition')).toBe(true);
      });

      describe('after firing transitionend event on current slide element', function() {
        beforeEach(function() {
          var target = testedSlider.slides.current.querySelector('.hermes-layout--content');
          var event = new TransitionEndEvent(target, 'transform');
          target.dispatchEvent(event);
        });

        it('then slider moves to "hermes-during-transition" phase', function() {
          expect(sliderElement.classList.contains('hermes-during-transition')).toBe(true);
        });

        describe('and after firing transitionend event second time', function() {
          beforeEach(function() {
            var target = testedSlider.slides.current.querySelector('.hermes-layout--content');
            var event = new TransitionEndEvent(target, 'transform');
            target.dispatchEvent(event);
          });

          it('then slider moves to "hermes-after-transition" phase', function() {
            expect(sliderElement.classList.contains('hermes-after-transition')).toBe(true);
          });
        });
      });
    });
  });

  describe('slider with "hermes-defaults" flag', function() {
    var sliderElement;
    var testedSlider;
    beforeEach(function() {
      sliderElement = createSliderElement(2);
      sliderElement.classList.add('hermes-defaults');
      testedSlider = slider(sliderElement);
    });

    describe('when just after creation', function() {
      var defaultOptions = [
        'hermes-autostart',
        'hermes-autoplay',
        'hermes-create-arrows',
        'hermes-create-dots',
        'hermes-arrow-keys',
      ];

      defaultOptions.forEach(function(option) {
        it('then it has "'+ option +'" flag', function() {
          expect(sliderElement.classList.contains(option)).toBe(true);
        });
      });
    });
  });

  describe('slider with "hermes-autostart" flag', function() {
    var sliderElement;
    var testedSlider;
    beforeEach(function() {
      sliderElement = createSliderElement(2);
      sliderElement.classList.add('hermes-autostart');
      testedSlider = slider(sliderElement);
    });

    describe('when after creation and timeout function applied', function() {
      beforeEach(function() {
        window.$applyTimeouts();
      });

      it('is started', function() {
        expect(testedSlider.slides.current).not.toBe(null);
      });
    });
  });

  describe('slider with "hermes-autoplay" flag', function() {
    var sliderElement;
    var testedSlider;
    beforeEach(function() {
      sliderElement = createSliderElement(2);
      sliderElement.classList.add('hermes-autoplay');
      testedSlider = slider(sliderElement);
    });

    describe('when after starting and firing transitionend event twice', function() {
      beforeEach(function() {
        testedSlider.start();

        var target = testedSlider.slides.current.querySelector('.hermes-layout--content');
        var event = new TransitionEndEvent(target, 'transform');
        target.dispatchEvent(event);
        target.dispatchEvent(event);
      });

      it('then current index is 1', function() {
        expect(testedSlider.slides.currentIndex).toEqual(1);
      });
      it('then current slide is the second slide', function() {
        expect(testedSlider.slides.current).toBe(testedSlider.slides[1]);
      });
      it('then slider is in "hermes-before-transition" phase', function() {
        expect(sliderElement.classList.contains('hermes-before-transition')).toBe(true);
      });
    });
  });
});

