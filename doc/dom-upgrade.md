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
 * Declarations of between-slide [CSS3 transitions][transitions] should be simple,
 * Slider declarations in HTML should be simple.

[transitions]: https://www.w3.org/TR/css3-transitions/

First require complicated DOM structure, second require simple DOM structure.
In order to satisfy both requirements, upgrade procedure transforms simple DOM structure
declared in HTML into more complicated one.

## How it works?

Calling [`Slider.prototype.start(callback)`][slider-start] method begins
DOM upgrade, which consists of following operations:
 * Expansion of [option groups][option-classes] found on slider element,
 * Application of proper [layout class names][layout-classes],
 * Generation of [background][layout-background] and [content][layout-content]
   elements for each slide,
 * Addition of default [transition class names][transition-classes] to slides without themes specified,
 * Addition of default [theme class names][theme-classes] to slides without themes specified,
 * Generation of DOM elements for slider [control buttons][layout-controls],
 * Marking slider's and slides' elements as [upgraded][flag-upgraded].

[slider-start]: javascript-api.md#sliderprototypestartcallback
[option-classes]: class-names.md#option-class-names
[layout-classes]: class-names.md#layout-class-names
[theme-classes]: class-names.md#theme-class-names
[transition-classes]: class-names.md#transition-class-names
[layout-background]: class-names.md#ht-layout--background
[layout-content]: class-names.md#ht-layout--content
[layout-controls]: class-names.md#ht-layout--controls
[flag-upgraded]: class-names.md#is-upgraded

## Example

Following slider declaration:

```html
<div class="ht-slider ht-defaults">
  <div id="hello">
    <h1>Hello, HyperText Slider!</h1>
  </div>
  <div id="transitions">
    <p>How's the weather?
  </div>
</div>
```

...is upgraded into following structure:


```html
<div class="ht-slider
            ht-defaults
            ht-autoplay
            ht-arrow-keys
            ht-show-arrows
            ht-show-dots
            ht-responsive-controls
            ht-layout--slider
            is-upgraded">

  <div id="hello" class="ht-layout--slide
                         is-upgraded
                         ht-theme--white
                         ht-transition--zoom-out-in
                         ht-transition--bg-zoom-in-out">
    <div class="ht-layout--background">
    </div>
    <div class="ht-layout--content">
      <h1>Hello, HyperText Slider!</h1>
    </div>
  </div>

  <div id="transitions" class="ht-layout--slide
                               is-upgraded
                               ht-theme--white
                               ht-transition--zoom-out-in
                               ht-transition--bg-zoom-in-out">
    <div class="ht-layout--background">
    </div>
    <div class="ht-layout--content">
      <p>How's the weather?</p>
    </div>
  </div>

  <div class="ht-layout--controls
              ht-layout--arrow
              ht-layout--arrow-left">
  </div>
  <div class="ht-layout--controls
              ht-layout--arrow
              ht-layout--arrow-right">
  </div>

  <div class="ht-layout--controls ht-layout--dots">
    <div class="ht-layout--controls ht-layout--dot">
    </div>
    <div class="ht-layout--controls ht-layout--dot">
    </div>
  </div>
</div>
```

