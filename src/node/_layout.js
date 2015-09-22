/**
 * @name Layout Class Names
 *
 * @table name description usage client-html parent
 * @links name parent
 */
var Layout = {

  /**
   * Identifies main slider element.
   *
   * This class must be set on all slider elements in client HTML.
   * It can be used in client CSS code for styling.
   *
   * @name hermes-layout--slider
   * @usage role-id styling
   * @client-html mandatory
   */
  SLIDER: 'hermes-layout--slider',

  /**
   * Identifies a slide.
   *
   * At least 2 slides must be defined in each slider.
   * It can be used in client CSS code for styling.
   *
   * @name hermes-layout--slide
   * @usage role-id styling
   * @client-html mandatory
   * @parent hermes-layout--slider
   */
  SLIDE: 'hermes-layout--slide',

  /**
   * Identifies background of a slide.
   *
   * For slides in which this element is not present in slider declaration, empty background element
   * will be generated during slider upgrade.
   *
   * @name hermes-layout--background
   * @usage role-id styling transition
   * @client-html optional
   * @parent hermes-layout--slide
   */
  BACKGROUND: 'hermes-layout--background',

  /**
   * Identifies content of a slide.
   *
   * For slides in which this element is not present in slider declaration, it will be generated
   * during slider upgrade. Contents of a slide will be moved inside generated element.
   *
   * If element is present in slider declaration, it must contain all contents of a slide.
   *
   * @name hermes-layout--content
   * @usage role-id styling transition
   * @client-html optional
   * @parent hermes-layout--slide
   */
  CONTENT: 'hermes-layout--content',

  /**
   * May be set on selected elements of content of a slide.
   *
   * Used in some transitions.
   *
   * @name hermes-layout--inner
   * @usage transition
   * @client-html optional
   * @parent hermes-layout--content
   */
  INNER: 'hermes-layout--inner',

  /**
   * Set during upgrade on generated arrow buttons.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--arrow
   * @usage styling
   * @client-html forbidden
   * @parent hermes-layout--slider
   */
  ARROW: 'hermes-layout--arrow',

  /**
   * Set during upgrade on generated left arrow button.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--arrow-left
   * @usage styling
   * @client-html forbidden
   * @parent hermes-layout--slider
   */
  ARROW_LEFT: 'hermes-layout--arrow-left',

  /**
   * Set during upgrade on generated right arrow button.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--arrow-right
   * @usage styling
   * @client-html forbidden
   * @parent hermes-layout--slider
   */
  ARROW_RIGHT: 'hermes-layout--arrow-right',

  /**
   * Set during upgrade on container elements that contains dot buttons.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--dots
   * @usage styling
   * @client-html forbidden
   * @parent hermes-layout--slider
   */
  DOTS: 'hermes-layout--dots',

  /**
   * Set during upgrade on each dot button element.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--dot
   * @usage styling
   * @client-html forbidden
   * @parent hermes-layout--dots
   */
  DOT: 'hermes-layout--dot',
};

module.exports = Layout;

