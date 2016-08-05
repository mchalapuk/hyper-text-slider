(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

module.exports = require('./lib/checks');
},{"./lib/checks":3}],3:[function(require,module,exports){
/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var util = require('util');

var errors = module.exports = require('./errors');

function failCheck(ExceptionConstructor, callee, messageFormat, formatArgs) {
    messageFormat = messageFormat || '';
    var message = util.format.apply(this, [messageFormat].concat(formatArgs));
    var error = new ExceptionConstructor(message);
    Error.captureStackTrace(error, callee);
    throw error;
}

function failArgumentCheck(callee, message, formatArgs) {
    failCheck(errors.IllegalArgumentError, callee, message, formatArgs);
}

function failStateCheck(callee, message, formatArgs) {
    failCheck(errors.IllegalStateError, callee, message, formatArgs);
}

module.exports.checkArgument = function(value, message) {
    if (!value) {
        failArgumentCheck(arguments.callee, message,
            Array.prototype.slice.call(arguments, 2));
    }
};

module.exports.checkState = function(value, message) {
    if (!value) {
        failStateCheck(arguments.callee, message,
            Array.prototype.slice.call(arguments, 2));
    }
};

module.exports.checkIsDef = function(value, message) {
    if (value !== undefined) {
        return value;
    }

    failArgumentCheck(arguments.callee, message ||
        'Expected value to be defined but was undefined.',
        Array.prototype.slice.call(arguments, 2));
};

module.exports.checkIsDefAndNotNull = function(value, message) {
    // Note that undefined == null.
    if (value != null) {
        return value;
    }

    failArgumentCheck(arguments.callee, message ||
        'Expected value to be defined and not null but got "' +
        typeOf(value) + '".', Array.prototype.slice.call(arguments, 2));
};

// Fixed version of the typeOf operator which returns 'null' for null values
// and 'array' for arrays.
function typeOf(value) {
    var s = typeof value;
    if (s == 'object') {
        if (!value) {
            return 'null';
        } else if (value instanceof Array) {
            return 'array';
        }
    }
    return s;
}

function typeCheck(expect) {
    return function(value, message) {
        var type = typeOf(value);

        if (type == expect) {
            return value;
        }

        failArgumentCheck(arguments.callee, message ||
            'Expected "' + expect + '" but got "' + type + '".',
            Array.prototype.slice.call(arguments, 2));
    };
}

module.exports.checkIsString = typeCheck('string');
module.exports.checkIsArray = typeCheck('array');
module.exports.checkIsNumber = typeCheck('number');
module.exports.checkIsBoolean = typeCheck('boolean');
module.exports.checkIsFunction = typeCheck('function');
module.exports.checkIsObject = typeCheck('object');

},{"./errors":4,"util":7}],4:[function(require,module,exports){
/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var util = require('util');

function IllegalArgumentError(message) {
    Error.call(this, message);
    this.message = message;
}
util.inherits(IllegalArgumentError, Error);

IllegalArgumentError.prototype.name = 'IllegalArgumentError';

function IllegalStateError(message) {
    Error.call(this, message);
    this.message = message;
}
util.inherits(IllegalStateError, Error);

IllegalStateError.prototype.name = 'IllegalStateError';

module.exports.IllegalStateError = IllegalStateError;
module.exports.IllegalArgumentError = IllegalArgumentError;
},{"util":7}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],7:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":6,"_process":5,"inherits":1}],8:[function(require,module,exports){
/*

   Copyright 2015 Maciej Chałapuk

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

var autoboot = require('./js/autoboot');

/**
 * During project build, this script is compiled to `dist/hermes.js`,
 * which contains ES5 code that can be run in all modern browsers.
 * It is to be used only when programming in vanilla-browser style.
 * When using nodejs-based javascript preprocessor, it's better to load
 * hermes module and call ${link boot} function from client code.
 */
window.addEventListener('load', function() {
  autoboot(document.body);
});

/*
  eslint-env node, browser
*/


},{"./js/autoboot":10}],9:[function(require,module,exports){
/*

   Copyright 2015 Maciej Chałapuk

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

module.exports = {
  transformPropertyName: getFeatureName('transform', {
    OTransform: '-o-transform',
    MozTransform: '-moz-transform',
    WebkitTransform: '-webkit-transform',
  }),
  transitionEventName: getFeatureName('transitionend', {
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  }),
};

/**
 * Detects browser-specific names of browser features by checking availability
 * of browser-specific CSS atributes in a DOM element.
 *
 * @param defaultName name used if nothing else detected (standard-compliant name)
 * @param candidateMap browser-specific css attribute names (keys) mapped to feature names (values)
 * @return value from candidateMap or defaultName
 */
function getFeatureName(defaultName, candidateMap) {
  var elem = document.createElement('fakeelement');

  for (var key in candidateMap) {
    if (typeof elem.style[key] !== 'undefined') {
      return candidateMap[key];
    }
  }
  return defaultName;
}

/*
  eslint-env node, browser
*/


},{}],10:[function(require,module,exports){
/*

   Copyright 2015 Maciej Chałapuk

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

var boot = require('./boot');
var Option = require('./classnames/_options');

module.exports = autoboot;

/**
 * Calls ${link boot} with passed element if it contains ${link Option.AUTOBOOT} option.
 *
 * @params {Element} containerElement element that will be passed to ${link boot}
 */
function autoboot(containerElement) {
  if (containerElement.classList.contains(Option.AUTOBOOT)) {
    boot(containerElement);
  }
}

/*
  eslint-env node
*/


},{"./boot":11,"./classnames/_options":15}],11:[function(require,module,exports){
/*

   Copyright 2015 Maciej Chałapuk

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

Object.values = require('./polyfill/values');

var Slider = require('./slider');
var Option = require('./classnames/_options');

module.exports = boot;

/**
 * Default Hermes boot procedure.
 *
 * For each element with ${link Layout.SLIDER} class name found in passed container
 * (typically document's `<body>`):
 *
 *  1. Adds ${link Option options class names} found on container element,
 *  1. Creates ${link Slider} object,
 *  2. Invokes its ${link Slider.prototype.start} method.
 *
 * If you are using browserify, you may want to call this function at some point...
 *
 * ```javascript
 * var hermes = require('hermes-slider');
 * hermes.boot();
 * ```
 *
 * ...or event consider implementing bootup by yourself.
 *
 * @param {Element} containerElement element that contains sliders
 * @return array containing all created ${link Slider} isntances
 *
 * @see Option.AUTOBOOT
 * @fqn boot
 */
function boot(containerElement) {
  var containerOptions = getEnabledOptions(containerElement);
  var sliderElems = [].slice.call(containerElement.querySelectorAll('.hermes-layout--slider'));

  var sliders = sliderElems.map(function(elem) {
    // TODO this should be a feature of Phaser
    // turn off vanilla behavior (vertical scroll bar)
    elem.classList.add('is-upgraded');

    containerOptions.forEach(function(option) {
      if (elem.classList.contains(option)) {
        return;
      }
      elem.classList.add(option);
    });

    return new Slider(elem);
  });

  // TODO maybe requestAnimationFrame with a polyfill instead of setTimeout?
  window.setTimeout([].forEach.bind(sliders, function(slider) { slider.start(); }), 100);
  return sliders;
}

// finds option class names on passed element
function getEnabledOptions(element) {
  var retVal = [];
  Object.values(Option).forEach(function(option) {
    if (element.classList.contains(option) && option !== Option.AUTOBOOT) {
      retVal.push(option);
    }
  });
  return retVal;
}

/*
  eslint-env node, browser
*/


},{"./classnames/_options":15,"./polyfill/values":19,"./slider":20}],12:[function(require,module,exports){
/*!

   Copyright 2015 Maciej Chałapuk

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
 * They are automatically set by the slider. Flag class names MUST NOT be manipulated from
 * client HTML or JavaScript and **SHOULD be used only in client CSS**.
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
   * Automatically set on ${link Layout.DOT} button connected with currently active slide.
   *
   * @invariant This class is set on only one dot button.
   *
   * @fqn Flag.ACTIVE
   */
  ACTIVE: 'is-active',
};

module.exports = Flag;

/*
  eslint-env node
*/


},{}],13:[function(require,module,exports){
/*!

   Copyright 2015 Maciej Chałapuk

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
 * Their usage is limited to:
 *  1. **role-id** - class names are used to identify element's role during slider upgrade,
 *  2. **transition** - class names must be used in CSS definitions of transitions,
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

/*
  eslint-env node
*/


},{}],14:[function(require,module,exports){
/*!

   Copyright 2015 Maciej Chałapuk

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
 * They are automatically set on slide elements (${link Layout.SLIDE}).
 * Marker class names MUST NOT be manipulated from client HTML or JavaScript
 * and **SHOULD be used only in definitions of CSS transitions**.
 *
 * @name Transition Marker Class Names
 */
var Marker = {

  /**
   * Automatically set on previously active ${link Layout.SLIDE}.
   *
   * @invariant After starting first transition this class name is set on only one slide.
   *
   * @fqn Marker.SLIDE_FROM
   */
  SLIDE_FROM: 'hermes-slide-from',

  /**
   * Automatically set on currently active ${link Layout.SLIDE}.
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

/*
  eslint-env node
*/


},{}],15:[function(require,module,exports){
/*!

   Copyright 2015 Maciej Chałapuk

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
 * Option classes enable features of the slider.
 *
 * Most options are intended to be set on ${link Layout.SLIDER} element, but they can also be
 * set on document's `<body>`. Options set on `<body>` are treated as defaults for each ${link
 * Layout.SLIDER} declared on the page.
 *
 * Two categories:
 *  1. **single options** - each of which enables one feature,
 *  2. **option groups** - that adds many option classes to the slider during upgrade.
 *
 * Each option class is checked by the slider in one of two ways:
 *  1. <a href='#once' id='once'>**checked once**</a> - class name should be set
 *    in client HTML, slider will check for it only once during upgrade, adding/removing class
 *    after upgrade make no effect,
 *  2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
 *    class name may be added/removed at any time, slider will check if it is set every time
 *    a decission connected with this class is made.
 *
 * @name Option Class Names
 * @summary-column checked Checked
 * @summary-column target Target Element
 */
var Option = {

  /**
   * Automatically creates ${link Slider} objects for all sliders declared on the page
   * and invokes their ${link Slider.prototype.start} methods.
   *
   * This options can be set only on `<body>` element.
   * It enabled using Hermes without any JavaScript programming.
   *
   * > ***WARNING***
   * >
   * > When using Hermes via node and broserify, this option is ignored.
   *
   * @target document's `<body>`
   * @checked once
   * @see boot
   * @see Slider.prototype.start
   *
   * @fqn Option.AUTOBOOT
   */
  AUTOBOOT: 'hermes-autoboot',

  /**
   * Adds
   * ${link Option.AUTOPLAY},
   * ${link Option.CREATE_ARROWS},
   * ${link Option.CREATE_DOTS},
   * ${link Option.ARROW_KEYS},
   * ${link Option.RESPONSIVE_CONTROLS}
   * classes to the slider.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   *
   * @fqn Option.DEFAULTS
   */
  DEFAULTS: 'hermes-defaults',

  /**
   * Automatically moves slider to next slide.
   *
   * Slider is moved to the next after time specified in ${link Time time class name}.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked continuously
   * @see Slider.prototype.moveToNext
   *
   * @fqn Option.AUTOPLAY
   */
  AUTOPLAY: 'hermes-autoplay',

  /**
   * Creates side arrow buttons.
   *
   * `click` event on dispatched on left arrow moves slider to previous slide.
   * `click` event on dispatched on right arrow moves slider to next slide.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   * @see Slider.prototype.moveToPrevious
   * @see Slider.prototype.moveToNext
   *
   * @fqn Option.CREATE_ARROWS
   */
  CREATE_ARROWS: 'hermes-create-arrows',

  /**
   * Creates dot button for each slide.
   *
   * `click` event displatched on dot button moves slider to slide asociated with this dot button.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   * @see Slider.prototype.currentIndex
   *
   * @fqn Option.CREATE_DOTS
   */
  CREATE_DOTS: 'hermes-create-dots',

  /**
   * Adds keyboard control to slider.
   *
   * `keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
   * slide, with `RightArrow` key moves slider to next slide.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   * @see Slider.prototype.currentIndex
   *
   * @fqn Option.ARROW_KEYS
   */
  ARROW_KEYS: 'hermes-arrow-keys',

  /**
   * Adds screen responsiveness to slider controls.
   *
   * Slider controls come in 3 different layouts. Each for different range of screen width.
   *
   * @target `<body` or ${link Layout.SLIDER}
   * @checked once
   * @see [Screen Responsiveness](responsiveness.md)
   * @see Slider.breakpointNarrowToNormal
   * @see Slider.breakpointNormalToWide
   *
   * @fqn Option.RESPONSIVE_CONTROLS
   */
  RESPONSIVE_CONTROLS: 'hermes-responsive-controls',
};

module.exports = Option;

/*
  eslint-env node
*/


},{}],16:[function(require,module,exports){
/*!

   Copyright 2015 Maciej Chałapuk

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
 * All phase classes are automatically set on slider element (${link Layout.SLIDER}).
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
   * Set on slider element while transition of ${link Layout.CONTENT} element is run.
   *
   * @fqn Phase.DURING_TRANSITION
   */
  DURING_TRANSITION: 'hermes-during-transition',

  /**
   * Set on slider element after transition of ${link Layout.CONTENT} element ends.
   *
   * @fqn Phase.AFTER_TRANSITION
   */
  AFTER_TRANSITION: 'hermes-after-transition',
};

module.exports = Phase;

/*
  eslint-env node
*/


},{}],17:[function(require,module,exports){
/*!

   Copyright 2015 Maciej Chałapuk

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
 * @name Other Class Names
 */
var Regexp = {

  /**
   * All transitions used by the slider must match this regular expression.
   *
   * During slider upgrade ${link Layout.SLIDER} element is checked for presence of
   * transition class names. Transitions declared this way will be randomly used by the slider.
   * After upgrade all declared transitions are removed from slider element.
   *
   * Transitions may also be declared on ${link Layout.SLIDE} elements. Slider will always
   * use transition declared on slide element when moving to this slide. Transition declarations of
   * this type are [checked continuously](#continuously), therefore they may be added/removed
   * on slides at runtime (client JavaScript).
   *
   * @invariant Class name of currently running transition is set on slider element.
   *
   * @fqn Regexp.TRANSITION
   */
  TRANSITION: /hermes-transition--([^\s]+)/g,

  /**
   * Slider keeps class name with slide if of current slide to ${link Layout.SLIDER} element.
   *
   * This functionality may be useful if slides other than current are to be partially visible
   * or if appearence of controls or even whole slider needs to change from one slide to another.
   *
   * @invariant Class name with id of current slide is set on slider element.
   *
   * @fqn Regexp.SLIDE_ID
   */
  SLIDE_ID: /hermes-slide-id-([^\s]+)/,
};

module.exports = Regexp;

/*
  eslint-env node
*/


},{}],18:[function(require,module,exports){
/*

   Copyright 2015 Maciej Chałapuk

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
 * This class controls phases of CSS transitions by setting proper
 * ${link Phase phase class names} on slider element.
 *
 * It is an internal used by the ${link Slider}, but it can be used on any other DOM element
 * that require explicit control (from JavaScript) of CSS transitions.
 * To better illustrate how Phaser works, contents of a slide with `zoom-in-out` transition
 * will be used as an example throughout this documentation.
 *
 * There are 3 phases of a transition. Each phase is identified by a ${link Phase phase class name}
 * that is set by the Phaser on the container DOM element. Transitions are as follows.
 *
 *  1. When transition is started, ${link Phase.BEFORE_TRANSITION} class name is set on container
 *    DOM element. This phase is used to prepare all DOM elements inside a container element.
 *    In case of slide's content, `opacity` is set to `0` and `transform` is set to `scale(1.15)`.
 *    Slide is invisible and slightly zoomed-in. This phase lasts for 1 millisecond.
 *  2. After 1 millisecond, next phase (${link Phase.DURING_TRANSITION}) is automatically started.
 *    This is when all animation happens. Contents of current slide fading away
 *    (`opacity:0; transform:scale(1);`) and next slide is fading-in
 *    (`opacity:1; transform:scale(1.35);`). This phase last long (typically seconds).
 *    Time varies depending on transition being used.
 *  3. After animation is done, Phaser sets the phase to ${link Phase.AFTER_TRANSITION}.
 *    There is a possibility of altering CSS in this phase (e.g. slight change of font color),
 *    but in zoom-in-out there is no style change after transition.
 *
 * For all automatic phase changes to work, one of DOM elements that have transition specified
 * must be added to the phaser as a phase trigger (see ${link Phaser.prototype.addPhaseTrigger}).
 * Each time a transition on a phase trigger ends, ${link Phaser.prototype.nextPhase} method
 * is called. During its startup, ${link Slider} sets phase change triggers on ${link Layout
 * layout elements} (background and contents) of each slide and calls proper phase change methods
 * when slider controls are being used.
 *
 * > ***DISCLAIMER***
 * >
 * > Implementation based on `window.setTimeout` function instead of `transitionend` event could
 * > be simpler, but implementing a transition would have to involve JavaScript programming (now
 * > it's purely declarative, CSS-only). Besides, using `window.setTimeout` would also mean using
 * > `window.requestAnimationFrame` as timeout can pass without any rendering, which could result
 * > in wrong animation (or no animation at all).
 *
 * @fqn Phaser
 */
module.exports = Phaser;

var Phase = require('./classnames/_phases');
var domCompat = require('./_dom-compat');
var precond = require('precond');

/**
 * Creates Phaser.
 *
 * This constructor has no side-effects. This means that no ${link Phase phase class name} is set
 * after calling it. For phaser to start doing some work, ${link Phaser.prototype.setPhase}
 * or ${link Phaser.prototype.startTransition} needs to be invoked.
 *
 * @param {Element} elem container DOM element that will receive proper phase class names
 * @fqn Phaser.prototype.constructor
 */
function Phaser(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.phase = null;
  priv.listeners = [];

  var pub = {};
  var methods = [
    getPhase,
    nextPhase,
    addPhaseListener,
    removePhaseListener,
    addPhaseTrigger,
    removePhaseTrigger,
    startTransition,
  ];

  // This trick binds all methods to the public object
  // passing `priv` as the first argument to each call.
  methods.forEach(function(method) {
    pub[method.name] = method.bind(pub, priv);
  });

  return pub;
}

/**
 * A higher level method for starting a transition.
 *
 * ```javascript
 * // a shorthand for
 * phaser.setPhase(Phase.BEFORE_TRANSITION)
 * ```
 *
 * @fqn Phaser.prototype.startTransition
 */
function startTransition(priv) {
  setPhase(priv, Phase.BEFORE_TRANSITION);
}

/**
 * Switches phase to next one.
 *
 * This method is automatically invoked each time a transition ends
 * on DOM element added as phase trigger.
 *
 * @fqn Phaser.prototype.nextPhase
 */
function nextPhase(priv) {
  var phases = [ null, Phase.BEFORE_TRANSITION, Phase.DURING_TRANSITION, Phase.AFTER_TRANSITION ];
  setPhase(priv, phases[(phases.indexOf(priv.phase) + 1) % phases.length]);
}

/**
 * Changes current phase.
 *
 * Invoking this method will result in setting CSS class name of requested phase on container
 * element.
 *
 * @param {String} phase desired phase
 * @fqn Phaser.prototype.setPhase
 */
function setPhase(priv, phase) {
  if (priv.phase !== null) {
    priv.elem.classList.remove(priv.phase);
  }
  priv.phase = phase;

  if (phase !== null) {
    priv.elem.classList.add(phase);
  }
  priv.listeners.forEach(function(listener) {
    listener(phase);
  });
}

/**
 * Adds passed element as phase trigger.
 *
 * Phase will be automatically set to next each time transition
 * of passed property ends on passed element.
 *
 * @param {Element} elem DOM element that will be used as a phase trigger
 * @param {String} transitionProperty CSS property that is used in the transition
 * @fqn Phaser.prototype.addPhaseTrigger
 */
function addPhaseTrigger(priv, elem, transitionProperty) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  var property = transitionProperty || 'transform';
  precond.checkIsString(property, 'transitionProperty is not a String');

  if (property === 'transform') {
    // maybe a prefixed version
    property = domCompat.transformPropertyName;
  }

  elem.hermesPhaseTrigger = function(event) {
    if (event.propertyName !== property || event.target !== this) {
      return;
    }
    nextPhase(priv);
  };
  elem.addEventListener(domCompat.transitionEventName, elem.hermesPhaseTrigger);
}

/**
 * Adds a listener that will be notified on phase changes.
 *
 * It is used by the ${link Slider} to change styles of dots representing slides.
 *
 * @param {Function} listener listener to be added
 * @fqn Phaser.prototype.addPhaseListener
 */
function addPhaseListener(priv, listener) {
  priv.listeners.push(listener);
}

/**
 * Removes passed element from phase triggers.
 *
 * @param {Element} elem DOM element that will no longer be used as a phase trigger
 * @fqn Phaser.prototype.removePhaseTrigger
 */
function removePhaseTrigger(priv, elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  precond.checkIsFunction(elem.hermesPhaseTrigger, 'no trigger found on given element');

  elem.removeEventListener(domCompat.transitionEventName, elem.hermesPhaseTrigger);
}

/**
 * Removes passed listener from the phaser.
 *
 * @param {Function} listener listener to be removed
 * @fqn Phaser.prototype.removePhaseListener
 */
function removePhaseListener(priv, listener) {
  priv.listeners.splice(priv.listeners.indexOf(listener), 1);
}

/**
 * Returns a class name of the current phase.
 *
 * @return {String} current phase
 * @fqn Phaser.prototype.getPhase
 */
function getPhase(priv) {
  return priv.phase;
}

/*
  eslint-env node, browser
*/


},{"./_dom-compat":9,"./classnames/_phases":16,"precond":2}],19:[function(require,module,exports){
/*

   Copyright 2015 Maciej Chałapuk

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

module.exports = Object.values || polyfill;

function polyfill(object) {
  var values = [];
  for (var key in object) {
    values.push(object[key]);
  }
  return values;
}

/*
  eslint-env node
 */


},{}],20:[function(require,module,exports){
/*!

   Copyright 2015 Maciej Chałapuk

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

var phaser = require('./phaser');
var precond = require('precond');

/**
 * > **DISCLAIMER**
 * >
 * > Hermes JavaScript API should be used only when specific initialization or integration
 * > with other parts of the website is required. In other (simpler) cases please consider
 * > using [declarative API](class-names.md).
 *
 * > **DISCLAIMER**
 * >
 * > JavaScript API is in early **alpha stage** and may change in the future.
 * > [Declarative API](class-names.md) is stable (future versions will be backward-compatibile).
 *
 * ### Example
 *
 * ```javascript
 * // browserify is supported
 * var hermes = require('hermes');
 *
 * window.addEventListener('load', function() {
 *   var slider = new hermes.Slider(document.getElementById('my-slider'));
 *   slider.start();
 * });
 * ```
 *
 * @fqn Slider
 */
module.exports = Slider;

// constants

var Layout = require('./classnames/_layout');
var Option = require('./classnames/_options');
var Marker = require('./classnames/_markers');
var Flag = require('./classnames/_flags');
var Regexp = require('./classnames/_regexps');

var Selector = (function() {
  var selectors = {};
  for (var name in Layout) {
    selectors[name] = '.' + Layout[name];
  }
  return selectors;
}());


// public

/**
 * Constructs the slider.
 *
 * @param {Element} elem DOM element for the slider
 *
 * @fqn Slider.prototype.constructor
 */
function Slider(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.transitions = searchForTransitions(elem);
  priv.phaser = phaser(elem);
  priv.slides = searchForSlides(elem);
  priv.tempClasses = [];
  priv.fromIndex = 1;
  priv.toIndex = 0;
  priv.started = false;

  var pub = {};

  /**
   * Array containing all slide elements.
   *
   * @type Array
   * @access read-only
   *
   * @fqn Slider.prototype.slides
   */
  pub.slides = priv.slides;

  /**
   * Index of currently active slide.
   *
   * Set to `null` if ${link Slider.prototype.start} was not called on this slider.
   *
   * @type Number
   * @access read-write
   *
   * @fqn Slider.prototype.currentIndex
   */
  pub.currentIndex = null;
  Object.defineProperty(pub, 'currentIndex', {
    get: function() { return priv.started? priv.toIndex: null; },
    set: moveTo.bind(null, priv),
  });

  /**
   * Currently active slide element.
   *
   * Set to `null` if ${link Slider.prototype.start} was not called on this slider.
   *
   * @type Element
   * @access read-write
   *
   * @fqn Slider.prototype.currentSlide
   */
  pub.currentSlide = null;
  Object.defineProperty(pub, 'currentSlide', {
    get: function() { return priv.started? priv.slides[priv.toIndex]: null; },
    set: function() { throw new Error('read only property! please use currentIndex instead'); },
  });

  bindMethods(pub, [
    start,
    moveTo,
    moveToNext,
    moveToPrevious,
  ], priv);

  return pub;
}

/**
 * Upgrades slider DOM element and shows the first slide.
 *
 * @precondition ${link Slider.prototype.start} was not called on this slider
 * @postcondition calling ${link Slider.prototype.start} again will throw exception
 * @see ${link Option.AUTOBOOT}
 *
 * @fqn Slider.prototype.start
 */
function start(priv) {
  precond.checkState(!priv.started, 'slider is already started');

  // For transition to work, it is required that a single transition class will be present
  // on the slider element. Since there may be many transitions declared on the slider and
  // since transitions can be configured also per slide, all transition class names are removed
  // from the slider. Single transition class name will be added just before before-transition
  // phase and removed right after hitting after-transition.
  // TODO transitions are to be independent from slide time, this needs to change
  // TODO is there a way to test removing transition class names during start?
  priv.elem.className = priv.elem.className.replace(Regexp.TRANSITION, '');

  expandOptionGroups(priv);
  enableControls(priv);
  upgradeSlides(priv);

  priv.started = true;

  var firstSlide = priv.slides[priv.toIndex];
  firstSlide.classList.add(Marker.SLIDE_TO);
  if (firstSlide.id !== null) {
    addTempClass(priv, 'hermes-slide-id-'+ firstSlide.id);
  }
  if (typeof firstSlide.dot !== 'undefined') {
    firstSlide.dot.classList.add(Flag.ACTIVE);
  }

  addTempClass(priv, chooseTransition(priv));
  priv.phaser.addPhaseListener(onPhaseChange.bind(null, priv));
  priv.phaser.startTransition();
}

/**
 * Moves slider to next slide.
 *
 * @precondition ${link Slider.prototype.start} was called on this slider
 * @see ${link Option.AUTOPLAY}
 *
 * @fqn Slider.prototype.moveToNext
 */
function moveToNext(priv) {
  moveTo(priv, (priv.toIndex + 1) % priv.slides.length);
}

/**
 * Moves slider previous slide.
 *
 * @precondition ${link Slider.prototype.start} was called on this slider
 *
 * @fqn Slider.prototype.moveToPrevious
 */
function moveToPrevious(priv) {
  moveTo(priv, (priv.toIndex - 1 + priv.slides.length) % priv.slides.length);
}

/**
 * Moves slider slide of given index.
 *
 * @param {Number} index index of the slide that slider will be moved to
 * @precondition ${link Slider.prototype.start} was called on this slider
 *
 * @fqn Slider.prototype.moveTo
 */
function moveTo(priv, index) {
  precond.checkState(priv.started, 'slider not started');
  precond.checkIsNumber(index, 'given index is not a number');

  var toIndex = index <= priv.slides.length? index % priv.slides.length: index;
  if (priv.toIndex === toIndex) {
    return;
  }

  removeMarkersAndFlags(priv);
  removeTempClasses(priv);

  priv.fromIndex = priv.toIndex;
  priv.toIndex = toIndex;

  addMarkersAndFlags(priv);
  var toSlide = priv.slides[priv.toIndex];
  if (toSlide.id !== null) {
    addTempClass(priv, 'hermes-slide-id-'+ toSlide.id);
  }
  addTempClass(priv, chooseTransition(priv));

  priv.phaser.startTransition();
}

// private

// initialization functions

function searchForSlides(elem) {
  var slides = [].slice.call(elem.querySelectorAll(Selector.SLIDE));
  precond.checkState(slides.length >= 2, 'at least 2 slides needed');
  return slides;
}

function searchForTransitions(elem) {
  var transitions = [];
  var matches = elem.className.match(Regexp.TRANSITION);
  if (matches) {
    for (var i = 0; i < matches.length; ++i) {
      transitions.push(matches[i]);
    }
  }
  return transitions;
}

function create() {
  var elem = document.createElement('div');
  elem.className = [].join.call(arguments, ' ');
  return elem;
}

function upgradeSlides(priv) {
  priv.slides.forEach(function(slide) {
    var content = slide.querySelector(Selector.CONTENT);
    if (content === null) {
      content = create(Layout.CONTENT);
      while (slide.childNodes.length) {
        content.appendChild(slide.childNodes[0]);
      }
      slide.appendChild(content);
    }
    priv.phaser.addPhaseTrigger(content);

    var background = slide.querySelector(Selector.BACKGROUND);
    if (background === null) {
      slide.insertBefore(create(Layout.BACKGROUND), content);
    }
  });
}

function expandOptionGroups(priv) {
  var list = priv.elem.classList;

  if (list.contains(Option.DEFAULTS)) {
    list.add(Option.AUTOPLAY);
    list.add(Option.ARROW_KEYS);
    list.add(Option.CREATE_ARROWS);
    list.add(Option.CREATE_DOTS);
    list.add(Option.RESPONSIVE_CONTROLS);
  }
}

function enableControls(priv) {
  var list = priv.elem.classList;

  if (list.contains(Option.CREATE_ARROWS)) {
    createArrowButtons(priv);
  }
  if (list.contains(Option.CREATE_DOTS)) {
    createDotButtons(priv);
  }
  if (list.contains(Option.ARROW_KEYS)) {
    window.addEventListener('keydown', keyBasedMove.bind(null, priv));
  }
}

function createArrowButtons(priv) {
  var previousButton = create(Layout.ARROW, Layout.ARROW_LEFT);
  previousButton.addEventListener('click', moveToPrevious.bind(null, priv));
  priv.elem.appendChild(previousButton);

  var nextButton = create(Layout.ARROW, Layout.ARROW_RIGHT);
  nextButton.addEventListener('click', moveToNext.bind(null, priv));
  priv.elem.appendChild(nextButton);
}

function createDotButtons(priv) {
  var dots = create(Layout.DOTS);
  priv.elem.appendChild(dots);

  for (var i = 0; i < priv.slides.length; ++i) {
    var dot = create(Layout.DOT);
    dot.addEventListener('click', moveTo.bind(null, priv, i));
    dots.appendChild(dot);
    priv.slides[i].dot = dot;
  }
}

function keyBasedMove(priv, event) {
  switch (event.key) {
    case 'ArrowLeft': moveToPrevious(priv); break;
    case 'ArrowRight': moveToNext(priv); break;
    default: break;
  }
}

function removeMarkersAndFlags(priv) {
  var fromSlide = priv.slides[priv.fromIndex];
  var toSlide = priv.slides[priv.toIndex];
  fromSlide.classList.remove(Marker.SLIDE_FROM);
  toSlide.classList.remove(Marker.SLIDE_TO);
  if (typeof toSlide.dot !== 'undefined') {
    toSlide.dot.classList.remove(Flag.ACTIVE);
  }
}

function addMarkersAndFlags(priv) {
  var fromSlide = priv.slides[priv.fromIndex];
  var toSlide = priv.slides[priv.toIndex];
  fromSlide.classList.add(Marker.SLIDE_FROM);
  toSlide.classList.add(Marker.SLIDE_TO);
  if (typeof toSlide.dot !== 'undefined') {
    toSlide.dot.classList.add(Flag.ACTIVE);
  }
}

function addTempClass(priv, className) {
  priv.tempClasses.push(className);
  priv.elem.classList.add(className);
}

function removeTempClasses(priv) {
  priv.tempClasses.forEach(function(className) {
    priv.elem.classList.remove(className);
  });
  priv.tempClasses = [];
}

function onPhaseChange(priv, phase) {
  if (phase === 'hermes-after-transition' && priv.elem.classList.contains(Option.AUTOPLAY)) {
    moveToNext(priv);
  }
}

// transition change functions

function chooseTransition(priv) {
  var match = priv.slides[priv.toIndex].className.match(Regexp.TRANSITION);
  return (match? match[0]: false) || random(priv.transitions);
}

function random(array) {
  if (array.length === 0) {
    return 'hermes-no-transition';
  }
  return array[parseInt(Math.random() * array.length, 10)];
}

// utilities

function bindMethods(wrapper, methods, arg) {
  methods.forEach(function(method) {
    wrapper[method.name] = method.bind(wrapper, arg);
  });
}

/*
  eslint-env node, browser
*/


},{"./classnames/_flags":12,"./classnames/_layout":13,"./classnames/_markers":14,"./classnames/_options":15,"./classnames/_regexps":17,"./phaser":18,"precond":2}]},{},[8]);
