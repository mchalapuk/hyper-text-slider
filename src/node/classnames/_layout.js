/**
 * Their usage is limited to:
 *  1. **role-id** - class names are used to identify element's role during slider upgrade,
 *  2. **transition** - class names must be used in transition CSS,
 *  3. **styling** - class names are recommended to be used for styling slides.
 *
 * @name Layout Class Names
 */
var Layout = {

  /**
   * Identifies main slider element.
   *
   * This class must be set on all slider elements in client HTML.
   * It can be used in client CSS code for styling.
   *
   * @usage role-id styling
   * @client-html mandatory
   *
   * @fqn Layout.SLIDER
   */
  SLIDER: 'hermes-layout--slider',

  /**
   * Identifies a slide.
   *
   * At least 2 slides must be defined in each slider.
   * It can be used in client CSS code for styling.
   *
   * @usage role-id styling
   * @client-html mandatory
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.SLIDE
   */
  SLIDE: 'hermes-layout--slide',

  /**
   * Identifies background of a slide.
   *
   * For slides in which this element is not present in slider declaration, empty background
   * element will be generated during slider upgrade. This class name must be used in all
   * definitions of background transitions.
   *
   * @usage role-id styling transition
   * @client-html optional
   * @parent-element Layout.SLIDE
   *
   * @fqn Layout.BACKGROUND
   */
  BACKGROUND: 'hermes-layout--background',

  /**
   * Identifies content of a slide.
   *
   * For slides in which this element is not present in slider declaration, it will be generated
   * during slider upgrade. Contents of a slide will be moved inside generated element. If element
   * is present in slider declaration, it must contain all contents of a slide. This class name
   * must be used in all definitions of content transitions.
   *
   * @usage role-id styling transition
   * @client-html optional
   * @parent-element Layout.SLIDE
   *
   * @fqn Layout.CONTENT
   */
  CONTENT: 'hermes-layout--content',

  /**
   * May be used in definitions of content transitions.
   *
   * In cases when some parts of slide's content need another transition this class name must be
   * used in definition of the transition and in client HTML.
   *
   * @usage transition
   * @client-html optional
   * @parent-element Layout.CONTENT
   *
   * @fqn Layout.INNER
   */
  INNER: 'hermes-layout--inner',

  /**
   * Set during upgrade on generated arrow buttons.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.ARROW
   */
  ARROW: 'hermes-layout--arrow',

  /**
   * Set during upgrade on generated left arrow button.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.ARROW_LEFT
   */
  ARROW_LEFT: 'hermes-layout--arrow-left',

  /**
   * Set during upgrade on generated right arrow button.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.ARROW_RIGHT
   */
  ARROW_RIGHT: 'hermes-layout--arrow-right',

  /**
   * Set during upgrade on container elements that contains dot buttons.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.DOTS
   */
  DOTS: 'hermes-layout--dots',

  /**
   * Set during upgrade on each dot button element.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.DOTS
   *
   * @fqn Layout.DOT
   */
  DOT: 'hermes-layout--dot',
};

module.exports = Layout;

