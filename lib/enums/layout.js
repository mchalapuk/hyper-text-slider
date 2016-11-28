/*!

   Copyright 2016 Maciej Chałapuk

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

'use strict';

/**
 * In most cases, most of layout classes **SHOULD not be used in client HTML**, as they are
 * automatially applied to apropriate elements during [slider's upgrade procedure](dom-upgrade.md)
 * (${link Common.SLIDER_SHORT} is the only layout class name that MUST be applied in client HTML).
 *
 * Layout classes play following roles in slider's inner-workings.
 *  1. **role-id** - class names are used to identify element's role during slider upgrade,
 *  2. **transition** - class names must be used in definitions of CSS transitions,
 *  3. **styling** - class names are recommended for usage in slide's styling.
 *
 * @name Layout Class Names
 * @summary-column usage Usage
 * @summary-column client-html Client HTML
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
  SLIDER: 'ht-layout--slider',

  /**
   * Identifies a slide.
   *
   * At least 2 slides must be defined in each slider.
   * It can be used in client CSS code for styling.
   *
   * @usage role-id styling
   * @client-html optional
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.SLIDE
   */
  SLIDE: 'ht-layout--slide',

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
  BACKGROUND: 'ht-layout--background',

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
  CONTENT: 'ht-layout--content',

  /**
   * Set during upgrade on all generated controls.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @usage styling
   * @client-html forbidden
   * @parent-element Layout.SLIDER
   *
   * @fqn Layout.CONTROLS
   */
  CONTROLS: 'ht-layout--controls',

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
  ARROW: 'ht-layout--arrow',

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
  ARROW_LEFT: 'ht-layout--arrow-left',

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
  ARROW_RIGHT: 'ht-layout--arrow-right',

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
  DOTS: 'ht-layout--dots',

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
  DOT: 'ht-layout--dot',
};

module.exports = Layout;

/*
  eslint-env node
*/

