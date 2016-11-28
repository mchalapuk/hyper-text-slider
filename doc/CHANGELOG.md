[gulp-eslint]: https://github.com/adametry/gulp-eslint
[gulp-sass]: https://github.com/dlmanning/gulp-sass
[gulp-uglify]: https://github.com/terinjokes/gulp-uglify
[stylelint]: https://github.com/stylelint/stylelint

[ht-boot]: javascript-api.md#bootcontainerelement
[slider-start]: javascript-api.md#sliderstartcallback
[slider-on]: javascript-api.md#sliderprototypeoneventname-listener
[slider-remove-listener]: javascript-api.md#sliderprototyperemovelistenereventname-listener
[slide-change-event]: javascript-api.md#slidechangeevent

[time-class-names]: class-names.md#time-class-names
[option-class-names]: class-names.md#option-class-names
[common-class-names]: class-names.md#common-class-names
[ht-autoboot]: class-names.md#ht-autoboot
[ht-slider]: class-names.md#ht-slider
[ht-defaults]: class-names.md#ht-defaults
[theme-white]: class-names.md#ht-theme--white
[theme-black]: class-names.md#ht-theme--black
[theme-arrows]: class-names.md#ht-theme--basic-arrows
[theme-dots]: class-names.md#ht-theme--basic-dots
[theme-hv-arrows]: class-names.md#ht-theme--hover-visible-arrows
[theme-hv-dots]: class-names.md#ht-theme--hover-visible-dots
[theme-ho-arrows]: class-names.md#ht-theme--hover-opaque-arrows
[theme-ho-dots]: class-names.md#ht-theme--hover-opaque-dots
[theme-responsive-arrows]: class-names.md#ht-theme--responsive-arrows
[theme-controls]: class-names.md#ht-theme--basic-controls
[theme-ho-controls]: class-names.md#ht-theme--hover-opaque-controls
[theme-hv-controls]: class-names.md#ht-theme--hover-visible-controls
[theme-defaults]: class-names.md#ht-theme--defaults
[theme-regex]: class-names.md#ht-theme--sg
[option-defaults]: class-names.md#ht-option--defaults
[zoom-out-in]: class-names.md#ht-transition--zoom-out-in
[bg-zoom-in-out]: class-names.md#ht-transition--bg-zoom-in-out
[layout-controls]: class-names.md#ht-layout--controls
[layout-slider]: class-names.md#ht-layout--slider
[layout-content]: class-names.md#ht-layout--content
[slide-from]: class-names.md#ht-slide-from
[slide-to]: class-names.md#ht-slide-to
[slide-id]: class-names.md#ht-slide-id-s

# v0.7.0

 * Removed `ht-show-arrows`, `ht-show-dots`, and
  `ht-responsive-controls` option classes,
 * Added [`ht-theme--basic-arrows`][theme-arrows],
   [`ht-theme--basic-dots`][theme-dots],
 * Added [`ht-theme--responsive-arrows`][theme-responsive-arrows],
 * Added [`ht-theme--hover-visible-arrows`][theme-hv-arrows],
   [`ht-theme--hover-visible-dots`][theme-hv-dots],
 * Added [`ht-theme--hover-opaque-arrows`][theme-ho-arrows],
   [`ht-theme--hover-opaque-dots`][theme-ho-dots],
 * Added [`ht-theme--basic-controls`][theme-controls] theme group,
 * Added [`ht-theme--hover-visible-controls`][theme-hv-controls] theme group,
 * Added [`ht-theme--hover-opaque-controls`][theme-ho-controls] theme group,
 * Changed selectors of [`ht-theme--white`][theme-white] and
   [`ht-theme-black`][theme-black] to stronger ones, so they override
   colors of&nbsp;control elements (arrows and dots) defined in other themes,
 * Added [`ht-theme--defaults`][theme-defaults],
 * If no themes declared, themes from [`ht-theme--defaults`][theme-defaults] are used,
 * Extracted [`ht-autoboot`][ht-autoboot], [`ht-slider`][ht-slider] and [`ht-defaults`][ht-defaults]
   to [Common Class Names][common-class-names],
 * Added [`ht-option--defaults`][option-defaults],
 * [`ht-defaults`][ht-defaults] now adds
   [`ht-option--defaults`][option-defaults] and [`ht-theme--defaults`][theme-defaults] classes,
 * As of now, all option classes have `ht-option--` prefix.

# v0.6.4

 * Fixed `white-space` (`normal` instead of `nowrap`) for [`ht-layout--content`][layout-content],
 * Added default side padding (`80px`) for [`ht-layout--content`][layout-content].

# v0.6.2

 * Removed flash of not upgraded content.

# v0.6.1

 * Fixed DOM upgrade in Opera 12.

# v0.6.0

 * Renamed `ht-transition--zoom-in-out` to [`ht-transition--zoom-out-in`][zoom-out-in],
 * Added [`ht-transition--bg-zoom-in-out`][bg-zoom-in-out],
 * Added data URI pattern and darkening overlay out background in [`ht-theme--black`][theme-black],
 * Added anchor color definitions in [`ht-theme--white`][theme-white] and [`ht-theme--black`][theme-black],
 * Added z-indices to [`ht-slide-from`][slide-from], [`ht-slide-to`][slide-to]
   and [`ht-layout--contols`][layout-controls].

# v0.5.0

 * Added extendible [theme mechanism][theme-regex],
 * Added [`ht-theme--white`][theme-white] and [`ht-theme--black`][theme-black],
 * Documented [adding custom themes](custom-themes.md),
 * Multiple transitions can be used on one slide,
 * Each slide receives transition class name during [slider's DOM upgrade](dom-upgrade.md),
 * Added [`ht-transition--zoom-in-out`][zoom-out-in].

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
 * Default transition is compiled into slider.css.

# v0.3.2

 * Fixed an import in [`src/_slider.scss`](../src/_slider.scss).

# v0.3.1

 * Documented [slider's DOM upgrade procedure](dom-upgrade.md).
 * Added [`ht-slider`][ht-slider] as an alias for [`ht-layout--slider`][layout-slider].
 * Replaced `ht-create-arrows` with `ht-show-arrows`.
 * Replaced `ht-create-dots` with `ht-show-dots`.
 * Made specifying transition class optional (`ht-transition--zoom-in-out` is default).
 * All direct children of slider are treated as slides.
 * Fixed click event listener of dot buttons.

# v0.3.0

 * Fixed DOM upgrade procedure.
 * Removed `ht-layout--inner` CSS class.
 * Added [`boot(containerElement)`][ht-boot] procedure.
 * Replaced `ht-autostart` option with [`ht-autoboot`][ht-autoboot].
 * Made [`Slider.start(callback)` ][slider-start] method asynchronouse
 * Added `ht-responsive-controls` option to [`ht-defaults`][ht-defaults].
 * Added [`ht-layout--controls`][layout-controls] class name.
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

 * Added `ht-responsive-controls` option class.
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
[v0.2.1_2]: https://www.npmjs.com/package/hyper-text-slider

# v0.2.0

 * Set up [Travis CI][v0.2.0_1] for the project.
 * Written documentation for [Declarative API][v0.2.0_2].
 * Written documentation for [JavaScript API][v0.2.0_3].

[v0.2.0_1]: https://travis-ci.org/webfront-toolkit/hyper-text-slider
[v0.2.0_2]: doc/class-names.md
[v0.2.0_3]: doc/javascript-api.md

# v0.1.0

 * Implementation of slider mechanism.

