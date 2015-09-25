/**
 * All option classes are intended to be set on slider element
 * ([hermes-layout--slider](#hermes-layout--slider));
 *
 * They may be divided into two categories:
 *  1. **single options** - each of which enables one feature,
 *  2. **option groups** - that adds many option classes to the slider during upgrade.
 *
 * Each option is read in one of slider's life-cycle phases:
 *  1. **upgrade** - class name should be set in client HTML,
 *    slider will check for it only once during upgrade,
 *  2. **runtime** - class name may be added/removed at any time,
 *    slider will check for it every time a decission connected with this class is made.
 *
 * @name Option Class Names
 * @summary-column checked-in-phase Checked During Phase
 */
var Option = {

  /**
   * Adds ${Option.AUTOSTART}, ${Option.AUTOPLAY}, ${Option.CREATE_ARROWS},
   * ${Option.CREATE_DOTS}, ${Option.ARROW_KEYS} to the slider.
   *
   * @checked-in-phase upgrade
   *
   * @fqn Option.DEFAULTS
   */
  DEFAULTS: 'hermes-defaults',

  /**
   * Shows first slide automatically.
   *
   * @checked-in-phase upgrade
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
   * @checked-in-phase runtime
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
   * @checked-in-phase upgrade
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
   * @checked-in-phase upgrade
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
   * @checked-in-phase upgrade
   * @see Slider.slides.currentIndex
   *
   * @fqn Option.CREATE_KEYS
   */
  ARROW_KEYS: 'hermes-arrow-keys',
};

module.exports = Option;

