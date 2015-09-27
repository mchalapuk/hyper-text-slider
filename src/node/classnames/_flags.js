
/**
 * They are automatically set by the slider. Flag class names MUST NOT be manipulated from
 * client HTML or JavaScript* and **SHOULD be used only in client CSS**.
 *
 * @name Flag Class Names
 */
var Flag = {

  /**
   * Automatically set on slider after its upgrade.
   *
   * @fqn Flag.UPGRADED
   */
  UPGRADED: 'is-upgraded',

  /**
   * Automatically set on ${link ${value Layout.DOT}} button connected with currently active slide.
   *
   * @invariant This class is set on only one dot button.
   *
   * @fqn Flag.ACTIVE
   */
  ACTIVE: 'is-active',
};

module.exports = Flag;

