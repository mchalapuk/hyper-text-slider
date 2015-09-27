/**
 * @name Other Class Names
 */
var Regexp = {

  /**
   * All transitions used by the slider must match this regular expression.
   *
   * During slider upgrade ${link ${value Layout.SLIDER}} element is checked for presence of
   * transition class names. Transitions declared this way will be randomly used by the slider.
   * After upgrade all declared transitions are removed from slider element.
   *
   * Transitions may also be declared on ${link ${value Layout.SLIDE}} elements. Slider will always
   * use transition declared on slide element when moving to this slide. Transition declarations of
   * this type are not removed from slide elements, because slider checks for transition class names
   * on slides ${link checked-continuously continuously}.
   *
   * @invariant Class name of currently running transition is set on slider element.
   *
   * @fqn Regexps.TRANSITION
   */
  TRANSITION: /hermes-transition--([^ ]+)/g,
};

module.exports = Regexp;

