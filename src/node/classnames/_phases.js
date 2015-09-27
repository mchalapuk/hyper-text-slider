/**
 * All phase classes are automatically set on slider element (${link ${value Layout.SLIDER}}).
 * They MUST NOT be manipulated from client HTML or JavaScript. They **should be used only
 * in definitions of CSS transitions**.
 *
 * @name Transition Phase Class Names
 */
var Phase = {

  /**
   * Set on slider element just before transition starts.
   *
   * This phase lasts for 1 millisecond. It exists just for the purpose of setting CSS properties
   * to initial values before transition.
   *
   * @fqn Phase.BEFORE_TRANSITION
   */
  BEFORE_TRANSITION: 'hermes-before-transition',

  /**
   * Set on slider element while transition of ${link ${value Layout.CONTENT}} element is run.
   *
   * @fqn Phase.DURING_TRANSITION
   */
  DURING_TRANSITION: 'hermes-during-transition',

  /**
   * Set on slider element after transition of ${link ${value Layout.CONTENT}} element ends.
   *
   * If ${link ${value Option.AUTOPLAY}} option is on, next transition
   * will be started just after hitting this phase, which will move slider
   * back to phase ${link ${value Phase.BEFORE_TRANSITION}}.
   *
   * @fqn Phase.AFTER_TRANSITION
   */
  AFTER_TRANSITION: 'hermes-after-transition',
};

module.exports = Phase;

