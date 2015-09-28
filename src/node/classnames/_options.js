'use strict';

/**
 * All option classes are intended to be set on slider element (${link ${value Layout.SLIDER}}).
 *
 * They may be divided into two categories:
 *  1. **single options** - each of which enables one feature,
 *  2. **option groups** - that adds many option classes to the slider during upgrade.
 *
 * Presence of each option class is checked by the slider in one of two ways:
 *  1. <a href='#once' id='once'>**checked once**</a> - class name should be set
 *    in client HTML, slider will check for it only once during upgrade, adding/removing class
 *    after upgrade make no effect,
 *  2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
 *    class name may be added/removed at any time, slider will check if it is set every time
 *    a decission connected with this class is made.
 *
 * @name Option Class Names
 * @summary-column checked Checked
 */
var Option = {

  /**
   * Adds ${link ${value Option.AUTOSTART}}, ${link ${value Option.AUTOPLAY}},
   *  ${link ${value Option.CREATE_ARROWS}}, ${link ${value Option.CREATE_DOTS}},
   *  ${link ${value Option.ARROW_KEYS}} classes to the slider.
   *
   * @checked once
   *
   * @fqn Option.DEFAULTS
   */
  DEFAULTS: 'hermes-defaults',

  /**
   * Shows first slide automatically.
   *
   * @checked once
   * @see Slider.start
   *
   * @fqn Option.AUTOSTART
   */
  AUTOSTART: 'hermes-autostart',

  /**
   * Automatically moves slider to next slide.
   *
   * Slider is moved after content transition of current slide ends.
   *
   * @checked continuously
   * @see Slider.moveToNext
   *
   * @fqn Option.AUTOPLAY
   */
  AUTOPLAY: 'hermes-autoplay',

  /**
   * Creates side arrow buttons.
   *
   * `click` event on dispatched on left arrow moves slider to previous slide.
   * `click` event on dispatched on right arrow moves slider to next slide.
   *
   * @checked once
   * @see Slider.moveToPrevious
   * @see Slider.moveToNext
   *
   * @fqn Option.CREATE_ARROWS
   */
  CREATE_ARROWS: 'hermes-create-arrows',

  /**
   * Creates dot button for each slide.
   *
   * `click` event displatched on dot button moves slider to slide asociated with this dot button.
   *
   * @checked once
   * @see Slider.slides.currentIndex
   *
   * @fqn Option.CREATE_DOTS
   */
  CREATE_DOTS: 'hermes-create-dots',

  /**
   * Adds keyboard control to slider.
   *
   * `keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
   * slide, with `RightArrow` key moves slider to next slide.
   *
   * @checked once
   * @see Slider.slides.currentIndex
   *
   * @fqn Option.ARROW_KEYS
   */
  ARROW_KEYS: 'hermes-arrow-keys',
};

module.exports = Option;

