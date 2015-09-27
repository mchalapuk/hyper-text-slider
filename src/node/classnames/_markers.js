/**
 * They are automatically set on slide elements (${link ${value Layout.SLIDE}}).
 * Marker class names MUST NOT be manipulated from client HTML or JavaScript
 * and **SHOULD be used only in definitions of CSS transitions**.
 *
 * @name Transition Marker Class Names
 */
var Marker = {

  /**
   * Automatically set on previously active ${link ${value Layout.SLIDE}}.
   *
   * @invariant After starting first transition this class name is set on only one slide.
   *
   * @fqn Marker.SLIDE_FROM
   */
  SLIDE_FROM: 'hermes-slide-from',

  /**
   * Automatically set on currently active ${link ${value Layout.SLIDE}}.
   *
   * This class name is set on first slide after starting a slider
   * and then set on currently active slide each time it changes.
   *
   * @invariant After starting slider this class name is set on only one slide.
   *
   * @fqn Marker.SLIDE_TO
   */
  SLIDE_TO: 'hermes-slide-to',
};

module.exports = Marker;

