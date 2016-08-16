<!--

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

-->

# Slider's DOM Upgrade Procedure

There are two opposing non-functional requirements for a slider component:
 * Simple declarations of CSS Transitions require complicated DOM structure,
 * Simple HTML-only usage requires simple DOM structure.

Upgrade procedure transforms simple DOM structure declared in HTML
into complicated DOM structure required for transitions to work.

## How it works?

Calling [`Slider.prototype.start(callback)`][slider-start] method begins
DOM upgrade, which consists of following operations:
 * Expansion of [option groups][optiona-classes],
 * Applying proper [layout class names][layout-classes],
 * Generating [background][layout-background] and [content][layout-content]
   elements for each slide,
 * Generating DOM elements for slider [control buttons][layout-controls].

[slider-start]: javascript-api.md#sliderprototypestartcallback
[option-classes]: class-names.md#option-class-names
[layout-classes]: class-names.md#layout-class-names
[layout-background]: class-names.md#hermes-layout--background
[layout-content]: class-names.md#hermes-layout--content
[layout-controls]: class-names.md#hermes-layout--controls

## Example

Following slider declaration:

```html
<div class="hermes-slider hermes-defaults">
  <div id="hello">
    <h1>Hello, Hermes!</h1>
  </div>
  <div id="transitions">
    <p>How's the weather?
  </div>
</div>
```

...is upgraded into following structure:


```html
<div class="hermes-slider
            hermes-defaults
            hermes-autoplay
            hermes-arrow-keys
            hermes-show-arrows
            hermes-show-dots
            hermes-responsive-controls
            hermes-layout--slider
            is-upgraded">

  <div class="hermes-layout--slide is-upgraded" id="hello">
    <div class="hermes-layout--background">
    </div>
    <div class="hermes-layout--content">
      <h1>Hello, Hermes!</h1>
    </div>
  </div>

  <div class="hermes-layout--slide is-upgraded" id="transitions">
    <div class="hermes-layout--background">
    </div>
    <div class="hermes-layout--content">
      <p>God of Transitions.</p>
    </div>
  </div>

  <div class="hermes-layout--controls
              hermes-layout--arrow
              hermes-layout--arrow-left">
  </div>
  <div class="hermes-layout--controls
              hermes-layout--arrow
              hermes-layout--arrow-right">
  </div>

  <div class="hermes-layout--controls hermes-layout--dots">
    <div class="hermes-layout--controls hermes-layout--dot">
    </div>
    <div class="hermes-layout--controls hermes-layout--dot">
    </div>
  </div>
</div>
```

