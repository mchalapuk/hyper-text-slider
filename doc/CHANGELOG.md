[gulp-eslint]: https://github.com/adametry/gulp-eslint
[gulp-sass]: https://github.com/dlmanning/gulp-sass
[gulp-uglify]: https://github.com/terinjokes/gulp-uglify
[stylelint]: https://github.com/stylelint/stylelint

[hermes-autoboot]: class-names.md#hermes-autoboot
[hermes-defaults]: class-names.md#hermes-defaults
[responsive-controls]: class-names.md#hermes-responsive-controls
[layout-controls]: class-names.md#hermes-layout--controls
[show-arrows]: class-names.md#hermes-show-arrows
[show-dots]: class-names.md#hermes-show-dots
[hermes-slider]: class-names.md#hermes-slider
[layout-slider]: class-names.md#hermes-layout--slider
[slide-from]: class-names.md#hermes-slide-from
[slide-to]: class-names.md#hermes-slide-to

[hermes-boot]: javascript-api.md#bootcontainerelement
[slider-start]: javascript-api.md#sliderstartcallback
[slider-on]: javascript-api.md#sliderprototypeoneventname-listener
[slider-remove-listener]: javascript-api.md#sliderprototyperemovelistenereventname-listener
[slide-change-event]: javascript-api.md#slidechangeevent

[time-class-names]: class-names.md#time-class-names
[option-class-names]: class-names.md#option-class-names
[theme-white]: class-names.md#hermes-theme--white
[theme-black]: class-names.md#hermes-theme--black
[theme-regex]: class-names.md#hermes-theme--sg
[zoom-out-in]: class-names.md#hermes-transition--zoom-out-in
[bg-zoom-in-out]: class-names.md#hermes-transition--bg-zoom-in-out
[slide-id]: class-names.md#hermes-slide-id-s

# v0.6.2

 * Removed flash of not upgraded content.

# v0.6.1

 * Fixed DOM upgrade in Opera 12.

# v0.6.0

 * Renamed `hermes-transition--zoom-in-out` to [`hermes-transition--zoom-out-in`][zoom-out-in],
 * Added [`hermes-transition--bg-zoom-in-out`][bg-zoom-in-out],
 * Added data URI pattern and darkening overlay out background in [`hermes-theme--black`][theme-black],
 * Added anchor color definitions in [`hermes-theme--white`][theme-white] and [`hermes-theme--black`][theme-black],
 * Added z-indices to [`hermes-slide-from`][slide-from], [`hermes-slide-to`][slide-to]
   and [`hermes-layout--contols`][layout-controls].

# v0.5.0

 * Added extendible [theme mechanism][theme-regex],
 * Added [`hermes-theme--white`][theme-white] and [`hermes-theme--black`][theme-black],
 * Documented [adding custom themes](custom-themes.md),
 * Multiple transitions can be used on one slide,
 * Each slide receives transition class name during [slider's DOM upgrade](dom-upgrade.md),
 * Added [`hermes-transition--zoom-in-out`][zoom-out-in].

# v0.4.1

 * Removed flash of all slides at startup.

# v0.4.0

 * Added slide contents block centering to default styles,
 * Added [`Slider.prototype.on(eventName, listener)`][slider-on] method,
 * Added [`Slider.prototype.removeListener(eventName, listener)`][slider-remove-listener] method,
 * Added [`SlideChangeEvent`][slide-change-event] class,
 * Slides are inserted into slides array in proper order in Chromium,
 * Fixed starting first transition in Chromium,
 * Renamed `src` folder to `lib`,
 * Default transition is compiled into hermes.css.

# v0.3.2

 * Fixed an import in [`src/_hermes.scss`](../src/_hermes.scss).

# v0.3.1

 * Documented [slider's DOM upgrade procedure](dom-upgrade.md).
 * Added [`hermes-slider`][hermes-slider] as an alias for [`hermes-layout--slider`][layout-slider].
 * Replaced `hermes-create-arrows` with [`hermes-show-arrows`][show-arrows].
 * Replaced `hermes-create-dots` with [`hermes-show-dots`][show-dots].
 * Made specifying transition class optional (`hermes-transition--zoom-in-out` is default).
 * All direct children of slider are treated as slides.
 * Fixed click event listener of dot buttons.

# v0.3.0

 * Fixed DOM upgrade procedure.
 * Removed `hermes-layout--inner` CSS class.
 * Added [`boot(containerElement)`][hermes-boot] procedure.
 * Replaced `hermes-autostart` option with [`hermes-autoboot`][hermes-autoboot].
 * Made [`Slider.start(callback)` ][slider-start] method asynchronouse
 * Added [`hermes-responsive-controls`][responsive-controls] option to
  [`hermes-defaults`][hermes-defaults].
 * Added [`hermes-layout--controls`][layout-controls] class name.
 * Added default slide time of 5 sec.
 * Documented [Time Class Names][time-class-names].
 * Added possibility of setting all [options][option-class-names]
  on document's `<body>`.
 * Documented [Slide ID Class Name][slide-id].
 * [gulpfile.js][v0.2.5_1] and [build.config.js][v0.2.5_2] are now linted.
 * Sass sources are now linted with [stylelint][stylelint].
 * Added missing unit tests.

[v0.2.5_1]: gulpfile.js
[v0.2.5_2]: build.config.js

# v0.2.4

 * Added [`hermes-responsive-controls`][responsive-controls] class.
 * Documented [Screen Responsiveness][v0.2.4_2].
 * Created [CHANGELOG][v0.2.4_3].

[v0.2.4_2]: doc/responsiveness.md
[v0.2.4_3]: CHANGELOG.md

# v0.2.3

 * Fixed arrow callback bindings.
 * Fixed IllegalCharacterError at slider startup.

# v0.2.2

 * Moved [TODO][v0.2.2_1] to separate file.
 * Added npm and browserify info to [README][v0.2.2_2].

[v0.2.2_1]: TODO.md
[v0.2.2_2]: README.md

# v0.2.1

 * Added keywords to [package.json][v0.2.1_1].
 * Published in [NPM][v0.2.1_2].

[v0.2.1_1]: package.json
[v0.2.1_2]: https://www.npmjs.com/package/hermes-slider

# v0.2.0

 * Set up [Travis CI][v0.2.0_1] for the project.
 * Written documentation for [Declarative API][v0.2.0_2].
 * Written documentation for [JavaScript API][v0.2.0_3].

[v0.2.0_1]: https://travis-ci.org/webfront-toolkit/hermes
[v0.2.0_2]: doc/class-names.md
[v0.2.0_3]: doc/javascript-api.md

# v0.1.0

 * Implementation of slider mechanism.

