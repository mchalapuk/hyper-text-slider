(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

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
 * During project build, this script is compiled to `dist/polyfills.js`,
 * which contains ES5 code that can be run in not-so-modern browsers.
 * It is to be used only when programming in vanilla-browser style.
 * When using nodejs-based javascript preprocessor, it's better to load
 * hermes module and polyfills with `require()` function.
 */
Object.values = require('./polyfills/values');
window.DOMTokenList = require('./polyfills/dom-token-list');
require('./polyfills/class-list')(window.Element);

/*
  eslint-env node, browser
 */


},{"./polyfills/class-list":2,"./polyfills/dom-token-list":3,"./polyfills/values":4}],2:[function(require,module,exports){
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

var DOMTokenList = require('./dom-token-list');

module.exports = applyPolyfill;

/**
 * Checks if prototype of passed ElementClass contains classList and,
 * in case not, creates a polyfill implementation.
 */
function applyPolyfill(ElementClass) {
  if (ElementClass.prototype.hasOwnProperty('classList')) {
    return;
  }

  Object.defineProperty(ElementClass.prototype, 'classList', {
    get: lazyDefinePropertyValue('classList', function() {
      if (!(this instanceof ElementClass)) {
        throw new Error(
            '\'get classList\' called on an object that does not implement interface Element.');
      }
      return new DOMTokenList(this, 'className');
    }),
    set: throwError('classList property is read-only'),
    enumerable: true,
    configurable: true,
  });
}

/**
 * Returns a function that:
 *  1. Calls fiven **loader** on first call,
 *  2. Defines a property of given **propertyName** with value returned from loader.
 */
function lazyDefinePropertyValue(propertyName, loader) {
  return function() {
    var value = loader.apply(this, arguments);

    Object.defineProperty(this, propertyName, {
      value: value,
      enumerable: true,
      configurable: true,
    });

    return value;
  };
}

/**
 * Returns a function that throws an Error with given **message**.
 */
function throwError(message) {
  return function() { throw new Error(message); };
}

/*
  eslint-env node
 */

/*
  eslint
    no-invalid-this: 0,
 */


},{"./dom-token-list":3}],3:[function(require,module,exports){
(function (global){
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

var check = require('../utils/check');

var namespace = typeof window !== 'undefined'? window: global;

module.exports = namespace.DOMTokenList || Polyfill;

/**
 * Constructs Polyfill of DOMTokenList.
 *
 * The list will be represented as a string located in given **object**
 * under property of name **key**.
 *
 * @see https://developer.mozilla.org/pl/docs/Web/API/DOMTokenList
 */
function Polyfill(object, key) {
  check(object, 'object').is.anObject();
  check(key, 'key').is.aString();
  check(object[key], 'object.'+ key).is.aString();

  var that = this;

  that.add = function() {
    var tokens = [].slice.apply(arguments);
    check(tokens, 'tokens').contains.onlyStrings();
    object[key] += (object[key].length ?' ' :'') + tokens.join(' ');
  };
  that.remove = function(token) {
    check(token, 'token').is.aString();
    object[key] = object[key].replace(new RegExp('\\b'+ token +'\\b\\s*'), '').replace(/^\\s*/, '');
  };
  that.contains = function(token) {
    check(token, 'token').is.aString();
    return object[key].search(new RegExp('\\b'+ token +'\\b')) !== -1;
  };
  Object.defineProperty(that, 'length', {
    get: function() {
      return (object[key].match(/[^\s]+/g) || []).length;
    },
  });

  return that;
}

/*
  eslint-env node, browser
 */


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/check":5}],4:[function(require,module,exports){
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

var check = require('../utils/check');

module.exports = Object.values || polyfill;

function polyfill(object) {
  check(object, 'object').is.not.Empty();

  var values = [];
  for (var key in object) {
    values.push(object[key]);
  }
  return values;
}

/*
  eslint-env node
 */


},{"../utils/check":5}],5:[function(require,module,exports){
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

var check = require('offensive');
var Assertion = require('offensive/lib/model/assertion');
var ParameterizedAssertion = require('offensive/lib/model/parameterized-assertion');

module.exports = check;

check.addAssertion('True', new Assertion(function() {
  this.message = [ 'true' ];
  this.condition = function(value) {
    return value === true;
  };
}));

check.addAssertion('False', new Assertion(function() {
  this.message = [ 'false' ];

  this.condition = function(value) {
    return value === false;
  };
}));

check.addAssertion('oneOf', new ParameterizedAssertion(function(context, set, setName) {
  check(set, 'set').is.anArray();
  check(setName, 'setName').is.either.aString.or.Undefined();

  if (setName) {
    this.message = [ 'one of', setName ];
  } else {
    this.message = [ 'one of [ ' ].concat(set.reduce(join(', '), [])).concat(' ]');
  }
  this.condition = function(value) {
    return set.indexOf(value) !== -1;
  };
}));

check.addAssertion('greaterThan', new ParameterizedAssertion(function(context, leftBounds) {
  check(leftBounds, 'leftBounds').is.aNumber();

  context.is.aNumber();
  context._reset();

  this.message = [ '> ', leftBounds ];
  this.condition = function(value) {
    return value > leftBounds;
  };
}));

check.addAssertion('lessThan', new ParameterizedAssertion(function(context, rightBounds) {
  check(rightBounds, 'rightBounds').is.aNumber();

  context.is.aNumber();
  context._reset();

  this.message = [ '< ', rightBounds ];
  this.condition = function(value) {
    return value < rightBounds;
  };
}));

check.addAssertion('inRange', new ParameterizedAssertion(function(context, leftBounds, rightBounds) {
  check(leftBounds, 'leftBounds').is.aNumber();
  check(rightBounds, 'rightBounds').is.aNumber();

  this.message = [ 'in range <', leftBounds, ', ', rightBounds, '>' ];
  context._push();
  context.is.greaterThan(leftBounds - 1).and.lessThan(rightBounds);
  context._pop();
}));

function join(separator) {
  return function(retVal, object) {
    if (retVal.length) {
      retVal.push(separator);
    }
    retVal.push(object);
    return retVal;
  };
}

/*
  eslint-env node
 */

/*
  eslint
    no-invalid-this: 0,
    no-underscore-dangle: 0,
 */


},{"offensive":30,"offensive/lib/model/assertion":17,"offensive/lib/model/parameterized-assertion":20}],6:[function(require,module,exports){
'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../getters');

module.exports = {
  'elementThatIs': new ParameterizedAssertion(function(context, index, assertName, condition) {
    context._newCheck(assertName, 'assertName').is.aString();
    context._newCheck(condition, 'condition').is.either.aFunction.or.anObject();

    var conditionFunction = null;
    if (typeof condition === 'object') {
      context._newCheck(condition, 'condition').has.property('isSatisfiedBy');
      conditionFunction = condition.isSatisfiedBy.bind(condition);
    } else {
      conditionFunction = condition;
    }

    this.getter = Getters.element(index);
    this.message = assertName;
    this.condition = elemSatisfiesCondition;

    function elemSatisfiesCondition(value) {
      return conditionFunction(value[index]);
    }
  }),
  'elementWhichIs': new Alias('elementThatIs'),

  'eachElementIs': new ParameterizedAssertion(function(context, assertName, condition) {
    context._newCheck(assertName, 'assertName').is.aString();
    context._newCheck(condition, 'condition').is.either.aFunction.or.anObject();
    if (typeof condition === 'object') {
      context._newCheck(condition, 'condition').has.property('isSatisfiedBy');
    }

    context._push();
    if (!context.is.anArray._result || context._value.length === 0) {
      context._pop();
      return;
    }
    context._reset();
    context._push();

    context._value.map(generateIntegers(0)).forEach(function(index) {
      if (context.elementThatIs(index, assertName, condition)._result) {
        // we don't want satisfied assertions in error message
        context._reset();
        return;
      }
      context._pop();
      noop(context._operatorContext.and);
      context._push();
    });

    context._pop(true);
    context._pop(true);
  }),
  'everyElementIs': new Alias('eachElementIs'),
  'allElements': new Alias('eachElementIs'),
  'onlyElements': new Alias('eachElementIs'),

  'onlyNumbers': new Assertion(function(context) {
    context.eachElementIs('a number', partial(isOfType, 'number'));
  }),
  'onlyStrings': new Assertion(function(context) {
    context.eachElementIs('a string', partial(isOfType, 'string'));
  }),
  'onlyObjects': new Assertion(function(context) {
    context.eachElementIs('an object', partial(isOfType, 'object'));
  }),
  'onlyFunctions': new Assertion(function(context) {
    context.eachElementIs('a function', partial(isOfType, 'function'));
  }),
  'onlyInstancesOf': new ParameterizedAssertion(function(context, Class) {
    context._newCheck(Class, 'Class').is.aFunction();
    context.eachElementIs('an instance of '+ Class.name, partial(isInstanceOf, Class));
  }),
};

function generateIntegers(startingFrom) {
  var nextValue = startingFrom;
  return function() {
    return nextValue++;
  };
}

function partial(func, arg) {
  return func.bind(null, arg);
}

function isOfType(requiredType, value) {
  return typeof value === requiredType;
}
function isInstanceOf(RequiredClass, value) {
  return value instanceof RequiredClass;
}

function noop() {
  // noop
}

/*
  eslint-env node
 */


},{"../../getters":14,"../../model/alias":16,"../../model/assertion":17,"../../model/parameterized-assertion":20}],7:[function(require,module,exports){
'use strict';

Object.assign = require('../../polyfill/assign');

var nullAssertions = require('./null');
var typeAssertions = require('./type');
var propertyAssertions = require('./property');
var arrayAssertions = require('./array');

module.exports = Object.assign({},
    nullAssertions, typeAssertions, propertyAssertions, arrayAssertions);

/*
  eslint-env node
 */


},{"../../polyfill/assign":23,"./array":6,"./null":8,"./property":9,"./type":10}],8:[function(require,module,exports){
'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'Null': new Assertion(function() {
    this.message = 'null';
    this.condition = isNull;
  }),
  'null': new Alias('Null'),
  'Nil': new Alias('Null'),
  'nil': new Alias('Nil'),
  'Empty': new Assertion(function(context) {
    this.message = 'empty';

    context._push();
    context.is.either.Null.or.Undefined();
    context._pop();
  }),
  'empty': new Alias('Empty'),
};

function isNull(value) {
  return value === null;
}

/*
  eslint-env node
 */


},{"../../model/alias":16,"../../model/assertion":17}],9:[function(require,module,exports){
'use strict';

Object.getPrototypeOf = require('../../polyfill/get-prototype-of');

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../getters');

module.exports = {
  // property assertions
  'property': new ParameterizedAssertion(function(context, propertyName, propertyValue) {
    context._newCheck(propertyName, 'propertyName').is.aString();

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }

    context._reset();

    this.getter = Getters.property(propertyName);
    if (typeof propertyValue !== 'undefined') {
      this.message = propertyValue;
      this.condition = function PropertyHasValue(value) {
        return value[propertyName] === propertyValue;
      };
    } else {
      this.message = 'not undefined';
      this.condition = function PropertyIsDefined(value) {
        return hasProperty(value, propertyName);
      };
    }
    context._pop();
  }),
  'field': new Alias('property'),

  'method': new ParameterizedAssertion(function(context, methodName) {
    context._newCheck(methodName, 'methodName').is.aString();

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }

    context._reset();
    this.getter = Getters.property(methodName);
    this.message = 'a function';
    this.condition = hasMethod;
    context._pop();

    function hasMethod(value) {
      return typeof value[methodName] === 'function';
    }
  }),

  // length assertions
  'length': new ParameterizedAssertion(function(context, requiredLength) {
    context._newCheck(requiredLength, 'requiredLength').is.aNumber();
    context.has.property('length', requiredLength);
  }),
  'len': new Alias('length'),
  // TODO 'lengthGT': new Alias('lengthGreaterThan'),
  // TODO 'lengthLT': new Alias('lengthLessThan'),
};

function hasProperty(object, propertyName) {
  var instance = object;
  while (instance) {
    if (instance.hasOwnProperty(propertyName)) {
      return true;
    }
    instance = Object.getPrototypeOf(instance);
  }
  return false;
}

/*
  eslint-env node
 */


},{"../../getters":14,"../../model/alias":16,"../../model/parameterized-assertion":20,"../../polyfill/get-prototype-of":24}],10:[function(require,module,exports){
'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

module.exports = {
  'aString': typeofAssertion('string'),
  'String': new Alias('aString'),
  'string': new Alias('aString'),
  'aNumber': typeofAssertion('number'),
  'Number': new Alias('aNumber'),
  'number': new Alias('aNumber'),
  'aBoolean': typeofAssertion('boolean'),
  'Boolean': new Alias('aBoolean'),
  'boolean': new Alias('aBoolean'),
  'aFunction': typeofAssertion('function'),
  'Function': new Alias('aFunction'),
  'function': new Alias('aFunction'),
  'anObject': typeofAssertion('object'),
  'Object': new Alias('anObject'),
  'object': new Alias('anObject'),
  'Undefined': typeofAssertion('undefined'),
  'undefined': new Alias('Undefined'),

  'anArray': new Assertion(function(context) {
    this.message = 'an array';

    context._push();
    context.has.method('splice').and.method('forEach');
    context._pop();
  }),
  'Array': new Alias('anArray'),
  'array': new Alias('anArray'),

  'anInstanceOf': new ParameterizedAssertion(function(context, RequiredClass) {
    context._newCheck(RequiredClass, 'RequiredClass').is.aFunction();

    this.message = 'an instance of '+ RequiredClass.name;
    this.condition = isInstanceOf;

    function isInstanceOf(value) {
      return value instanceof RequiredClass;
    }
  }),
  'instanceOf': new Alias('anInstanceOf'),
};

function typeofAssertion(requiredType) {
  function hasProperType(value) {
    return typeof value === requiredType;
  }
  return new Assertion(function() {
    this.message = getTypePrefix(requiredType) + requiredType;
    this.condition = hasProperType;
  });
}

function getTypePrefix(type) {
  return type === 'object'? 'an ': type === 'undefined'? '': 'a ';
}

/*
  eslint-env node
 */


},{"../../model/alias":16,"../../model/assertion":17,"../../model/parameterized-assertion":20}],11:[function(require,module,exports){
'use strict';

// names of context methods that will do nothing and return this
module.exports = [
  'is', 'be', 'being',
  'which', 'that',
  'to', 'from', 'under', 'over',
  'has', 'have',
  'defines', 'define',
  'contains', 'contain',
  'precondition', 'postcondition', 'invariant',
];

/*
  eslint-env node
 */


},{}],12:[function(require,module,exports){
'use strict';

var UnaryOperator = require('../../model/unary-operator');
var BinaryOperator = require('../../model/binary-operator');
var Alias = require('../../model/alias');

module.exports = {
  'and': new BinaryOperator(function() {
    this.message = 'and';
    this.apply = applyAnd;
  }),
  'of': new Alias('and'),
  'with': new Alias('and'),

  'not': new UnaryOperator(function() {
    this.message = 'not';
    this.apply = applyNot;
  }),
  'no': new Alias('not'),
  'dont': new Alias('not'),
  'doesnt': new Alias('not'),

  // either and or must be used in combination
  'either': new UnaryOperator(function(context) {
    context._push('either');
  }),
  'weather': new Alias('either'),

  'or': new BinaryOperator(function(context) {
    if (context._stackName !== 'either') {
      throw new Error('.or used without .either');
    }
    this.message = 'or';
    this.apply = applyOr;
    context._pop();
  }),
};

function applyAnd(lhs, rhs) {
  return lhs() && rhs();
}

function applyOr(lhs, rhs) {
  return lhs() || rhs();
}

function applyNot(operand) {
  return !operand();
}

/*
  eslint-env node
 */


},{"../../model/alias":16,"../../model/binary-operator":18,"../../model/unary-operator":21}],13:[function(require,module,exports){
'use strict';

Object.setPrototypeOf = require('./polyfill/set-prototype-of');

var SyntaxTreeBuilder = require('./syntax-tree-builder');
var MessageBuilder = require('./message-builder');
var AssertionRegistry = require('./registry/assertion');
var OperatorRegistry = require('./registry/operator');

var nodsl = require('./nodsl');

module.exports = CheckFactory;

function CheckFactory(assertionRegistry, operatorRegistry) {
  nodsl.check(assertionRegistry instanceof AssertionRegistry,
      'assertionRegistry must be an instance of AssertionRegistry; got ', assertionRegistry);
  nodsl.check(operatorRegistry instanceof OperatorRegistry,
      'operatorRegistry must be an instance of OperatorRegistry; got ', operatorRegistry);

  this.contextProto = {
    assertion: assertionRegistry.contextProto,
    operator: operatorRegistry.contextProto,
  };
}

CheckFactory.prototype = {
  newCheck: newCheck,
  onError: null,
};

function newCheck(value, name) {
  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

  var factory = this;
  var priv = {};

  var context = Object.create(factory.contextProto.assertion);
  context._value = value;
  context._name = name;
  context._assert = _assert;
  context._operator = _operator;
  context._newCheck = newCheck.bind(factory);

  var operatorContext = function() {
    return value;
  };
  Object.keys(context).forEach(function(key) {
    operatorContext[key] = context[key];
  });
  Object.setPrototypeOf(operatorContext, factory.contextProto.operator);

  var messageBuilder = new MessageBuilder(context);

  var readOnlyGetters = {
    '_stackName': function() { return priv.state.stackName; },
    '_result': function() { return priv.state.evaluate(); },
    '_message': messageBuilder.build.bind(messageBuilder),
  };
  defineReadOnly(context, readOnlyGetters);
  defineReadOnly(operatorContext, readOnlyGetters);

  var extendedContext = extendContext(context, [ _push, _pop, _reset ]);
  extendedContext._operatorContext = operatorContext;

  priv.state = new State();
  priv.state.syntax.onEvaluateReady = flush;

  priv.stateStack = [];
  priv.running = null;

  return context;

  // called by each assert method
  function _assert(assertionName, proto, args) {
    var assertion = Object.create(proto);
    assertion.name = assertionName;
    assertion.args = args || [];
    assertion.children = [];

    defineWriteOnly(assertion, {
      'condition': function(condition) {
        nodsl.check(typeof condition === 'function',
            '.condition must be a function; got ', condition);
        var operand = condition.bind(null, context._value);
        priv.state.syntax.addOperand(operand);
      },
    });

    run(assertion, [ extendedContext ].concat(assertion.args));

    return operatorContext;
  }

  // called by each operator method
  function _operator(operatorName, proto) {
    var operator = Object.create(proto);
    operator.name = operatorName;
    operator.children = [];

    defineWriteOnly(operator, {
      'apply': function(apply) {
        nodsl.check(typeof apply === 'function',
            '.apply must be a function; got ', apply);
        operator.addToSyntax(priv.state.syntax, apply);
      },
    });

    run(operator, [ extendedContext ]);

    return context;
  }

  // to be used inside assertions

  function _push(stackName) {
    priv.stateStack.push(priv.state);
    priv.state = new State(stackName);
    priv.state.calls = priv.running.children;
    priv.state.startIndex = priv.state.calls.length;
  }
  function _pop(force) {
    if (!priv.state.syntax.isEvaluateReady()) {
      if (!force) {
        priv.state.syntax.onEvaluateReady = pop0;
        return;
      }
      priv.state.syntax.addOperand(returnTrue);
    }
    pop0(priv.state.syntax.evaluate());
  }
  function _reset() {
    priv.state.syntax.flush();
    priv.state.calls.splice(priv.state.startIndex, priv.state.calls.length - priv.state.startIndex);
  }

  // private

  function run(operation, args) {
    priv.state.calls.push(operation);

    var previous = priv.running;
    priv.running = operation;
    operation.runInContext.apply(operation, args);
    priv.running = previous;
  }

  function pop0(evaluate) {
    priv.state = priv.stateStack.pop();
    priv.state.syntax.addOperand(evaluate);
  }

  function flush(evaluate) {
    if (!evaluate()) {
      messageBuilder.addAssertions(priv.state.calls);
      if (factory.onError) {
        factory.onError(context);
      }
    }
    // everything so far satisfied, so not needed in error message
    priv.state.calls.splice(0, priv.state.calls.length);
  }
}

// this gets pushed around alot
function State(stackName) {
  this.stackName = stackName;
  this.syntax = new SyntaxTreeBuilder();
  this.calls = [];
}
State.prototype = {
  evaluate: function() {
    return this.syntax.evaluate()();
  },
  startIndex: 0,
};

function defineReadOnly(instance, propertyGetters) {
  Object.keys(propertyGetters).forEach(function(key) {
    Object.defineProperty(instance, key, {
      get: propertyGetters[key],
      set: readOnlySetter(key),
      enumerable: true,
    });
  });
}
function defineWriteOnly(instance, propertySetters) {
  Object.keys(propertySetters).forEach(function(key) {
    Object.defineProperty(instance, key, {
      get: writeOnlySetter(key),
      set: propertySetters[key],
      enumerable: true,
    });
  });
}

function readOnlySetter(key) {
  return function() { throw new Error(key +' is read only'); };
}
function writeOnlySetter(key) {
  return function() { throw new Error(key +' is write only'); };
}


function extendContext(proto, methods) {
  var extended = Object.create(proto);
  methods.forEach(function(method) { extended[method.name] = method; });
  return extended;
}

function returnTrue() {
  return true;
}

/*
  eslint-env node
 */


},{"./message-builder":15,"./nodsl":22,"./polyfill/set-prototype-of":25,"./registry/assertion":26,"./registry/operator":28,"./syntax-tree-builder":29}],14:[function(require,module,exports){
'use strict';

// built in getters
module.exports = {
  value: {
    name: function(context) { return context._name; },
    value: function(context) { return context._value; },
  },
  property: function(propertyName) {
    return {
      name: function(context) { return context._name +'.'+ propertyName; },
      value: function(context) { return context._value[propertyName]; },
    };
  },
  element: function(index) {
    return {
      name: function(context) { return context._name +'['+ index +']'; },
      value: function(context) { return context._value[index]; },
    };
  },
};

/*
  eslint-env node
 */


},{}],15:[function(require,module,exports){
'use strict';

var Assertion = require('./model/assertion');
var UnaryOperator = require('./model/unary-operator');

var nodsl = require('./nodsl');

module.exports = MessageBuilder;

// code that builds error message is invoked only when assertion fails
// performace is not a concern here
function MessageBuilder(context) {
  var that = Object.create(MessageBuilder.prototype);
  that.context = context;
  that.assertions = [];
  return that;
}

MessageBuilder.prototype = {
  addAssertions: function addAssertions(assertions) {
    this.assertions = this.assertions.concat(assertions);
    return this;
  },

  build: function build() {
    nodsl.check(this.assertions.length !== 0, 'trying to build a message without failed assertions');

    var groupByName = groupByVariableName.bind(null, this.context);
    var toString = groupToString.bind(null, this.context);

    var grouped = this.assertions
      .reduce(replaceEmptyWithChildren, [])
      .reduce(mergeWithOperators(), [])
//      .map(tee.bind(null, console.log))
      .reduce(removeDuplicates, [])
      .reduce(groupByName, []);

    function buildMessage(builder, group) {
      return builder + toString(group);
    }

    grouped[0].operators.binary = '';
    var message = grouped.reduce(buildMessage, '');
    return message;
  },
};

function removeDuplicates(retVal, assertion) {
  var previous = retVal[retVal.length - 1];
  if (retVal.length === 0 || !equal(previous, assertion)) {
    retVal.push(assertion);
  }
  return retVal;
}

function equal(previous, next) {
  return previous.message === next.message &&
    arrayEqual(previous.args, next.args) &&
    previous.operators.unary === next.operators.unary;
}

// naive implementation
function arrayEqual(lhs, rhs) {
  return JSON.stringify(lhs) === JSON.stringify(rhs);
}

function replaceEmptyWithChildren(retVal, group) {
  if (group.message.length !== 0) {
    retVal.push(group);
  } else {
    return group.children.reduce(replaceEmptyWithChildren, retVal);
  }
  return retVal;
}

function mergeWithOperators() {
  var unary = [];
  var binary = null;

  return function(retVal, assertionOrOperator) {
    if (assertionOrOperator instanceof Assertion) {
      var assertion = assertionOrOperator;
      assertion.operators = { unary: unary, binary: binary };
      unary = [];
      binary = null;
      retVal.push(assertion);
      return retVal;
    }

    var operator = assertionOrOperator;
    if (operator instanceof UnaryOperator) {
      unary.push(operator.message);
      return retVal;
    }

    if (binary) {
      throw new Error('BUG! Two binary operators before one assertion.');
    }
    binary = operator.message;
    return retVal;
  };
}

function groupByVariableName(context, retVal, assertion) {
  var name = assertion.getter.name(context);
  var current = retVal.length === 0? createGroup(assertion): retVal.pop();
  var currentName = current.getter.name(context);
  if (name !== currentName) {
    retVal.push(current);
    current = createGroup(assertion);
  }
  var operators = operatorsToString(assertion.operators).full;
  var message = ensureArray(assertion.message).join(' ');
  current.message.push(operators + message);
  current.result &= assertion.result;
  retVal.push(current);
  return retVal;
}

function createGroup(assertion) {
  // has the same properties as assertion
  var group = {
    operators: assertion.operators,
    getter: assertion.getter,
    message: [],
    result: true,
  };
  assertion.operators = { unary: [], binary: '' };
  return group;
}

function groupToString(context, group) {
  var operators = operatorsToString(group.operators);
  if (operators.binary) {
    operators.binary = ' '+ operators.binary;
  }
  var name = group.getter.name(context);
  var conditions = group.message.join(' ');
  var value = group.getter.value(context);
  var retVal = operators.binary + name +' must be '+ operators.unary + conditions +'; got '+ value;
  return retVal;
}

function operatorsToString(operators) {
  var unary = operators.unary.join(' ');
  if (unary.length) {
    unary += ' ';
  }
  var binary = operators.binary || '';
  if (binary.length) {
    binary += ' ';
  }
  return {
    binary: binary,
    unary: unary,
    full: binary + unary,
  };
}

function ensureArray(value) {
  return value instanceof Array? value: [ value ];
}

// debugging

/* eslint-disable no-unused-vars */

function tee(func, group) {
  func(group);
  return group;
}

function pipe() {
  var pipeline = [].slice.call(arguments);

  return function(initialArg) {
    return pipeline.reduce(function(arg, filter) { return filter(arg); }, initialArg);
  };
}

/*
  eslint-env node
 */


},{"./model/assertion":17,"./model/unary-operator":21,"./nodsl":22}],16:[function(require,module,exports){
'use strict';

module.exports = Alias;

function Alias(originalName) {
  var that = Object.create(Alias.prototype);
  that.aliasFor = originalName;
  return that;
}

Alias.prototype = {};

/*
  eslint-env node
 */


},{}],17:[function(require,module,exports){
'use strict';

var getters = require('../getters');

module.exports = Assertion;

function Assertion(assertFunction) {
  var that = Object.create(Assertion.prototype);
  that.runInContext = assertFunction;
  return that;
}

Assertion.prototype = {
  getter: getters.value,
  message: [],
};

/*
  eslint-env node
 */


},{"../getters":14}],18:[function(require,module,exports){
'use strict';

var Operator = require('./operator');

module.exports = BinaryOperator;

function BinaryOperator(operatorFunction) {
  var that = Object.create(BinaryOperator.prototype);
  that.runInContext = operatorFunction;
  return that;
}

BinaryOperator.prototype = new Operator();

BinaryOperator.prototype.addToSyntax = addBinaryOperator;

function addBinaryOperator(syntax, applyFunction) {
  syntax.addBinaryOperator(applyFunction);
}

/*
  eslint-env node
 */


},{"./operator":19}],19:[function(require,module,exports){
'use strict';

module.exports = Operator;

function Operator() {
}

Operator.prototype = {
  message: [],
};

/*
  eslint-env node
 */


},{}],20:[function(require,module,exports){
'use strict';

var Assertion = require('./assertion');

module.exports = ParameterizedAssertion;

function ParameterizedAssertion(assertFunction) {
  var that = Object.create(ParameterizedAssertion.prototype);
  that.runInContext = assertFunction;
  return that;
}

ParameterizedAssertion.prototype = new Assertion();

/*
  eslint-env node
 */


},{"./assertion":17}],21:[function(require,module,exports){
'use strict';

var Operator = require('./operator');

module.exports = UnaryOperator;

function UnaryOperator(operatorFunction) {
  var that = Object.create(UnaryOperator.prototype);
  that.runInContext = operatorFunction;
  return that;
}

UnaryOperator.prototype = new Operator();

UnaryOperator.prototype.addToSyntax = addUnaryOperator;

function addUnaryOperator(syntax, applyFunction) {
  syntax.addUnaryOperator(applyFunction);
}

/*
  eslint-env node
 */


},{"./operator":19}],22:[function(require,module,exports){
'use strict';

module.exports = {
  check: noDslCheck,
};

function noDslCheck(condition) {
  if (!condition) {
    throw new Error([].slice.call(arguments, 1).join(''));
  }
}

/*
  eslint-env node
 */


},{}],23:[function(require,module,exports){
'use strict';

module.exports = Object.assign || polyfill;

function polyfill(target) {
  var sources = [].slice.call(arguments, 1);
  return sources.reduce(assign0, target);
}

function assign0(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */


},{}],24:[function(require,module,exports){
'use strict';

module.exports = originalOrPolyfill();

function originalOrPolyfill() {
  try {
    Object.getPrototypeOf(0);
    // didn't throw for non-object - ES6
    return Object.getPrototypeOf;
  } catch (e) {
    // ES5
    return polyfill;
  }
}

function polyfill(instance) {
  return instance.__proto__;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */


},{}],25:[function(require,module,exports){
'use strict';

module.exports = Object.setPrototypeOf || polyfill;

function polyfill(instance, prototype) {
  instance.__proto__ = prototype;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */


},{}],26:[function(require,module,exports){
'use strict';

var Assertion = require('../model/assertion');
var ParameterizedAssertion = require('../model/parameterized-assertion');
var Alias = require('../model/alias');

var NoopRegistry = require('./noop');

var nodsl = require('../nodsl');

module.exports = AssertionRegistry;

function AssertionRegistry(noopRegistry) {
  nodsl.check(noopRegistry instanceof NoopRegistry,
      'noopRegistry must be an instance of NoopRegistry; got ', noopRegistry);

  this.contextProto = Object.create(noopRegistry.contextProto);
  this.registered = {};
}

AssertionRegistry.prototype = {
  add: function addAssertion(name, assertion) {
    if (assertion instanceof Alias) {
      var aliased = this.registered[assertion.aliasFor];
      nodsl.check(typeof aliased === 'object',
          'assertion of name ', assertion.aliasFor, ' pointed by alias ', name, ' not found');
      this.add(name, aliased);
      return;
    }

    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
    nodsl.check(!(name in this.registered), 'assertion of name ', name, ' already registered');
    nodsl.check(assertion instanceof Assertion, 'assertion must be an instance of Assertion');

    this.registered[name] = assertion;

    if (assertion instanceof ParameterizedAssertion) {
      Object.defineProperty(this.contextProto, name, {
        value: assert(name, assertion),
        enumerable: true,
      });
    } else {
      Object.defineProperty(this.contextProto, name, {
        get: assert(name, assertion),
        enumerable: true,
      });
    }
  },
};

function assert(name, assertion) {
  return function() {
    var args = [].slice.call(arguments);

    try {
      return this._assert(name, assertion, args);

    } catch (e) {
      if (e.name === 'ContractError') {
        // just to shorten the stack trace
        var error = new Error(e.message);
        error.name = 'ContractError';
        error.cause = e;
        throw error;
      }
      throw e;
    }
  };
}

/*
  eslint-env node
 */


},{"../model/alias":16,"../model/assertion":17,"../model/parameterized-assertion":20,"../nodsl":22,"./noop":27}],27:[function(require,module,exports){
'use strict';

var nodsl = require('../nodsl');

module.exports = NoopRegistry;

function NoopRegistry() {
  this.contextProto = {};
}

NoopRegistry.prototype = {
  add: function addNoop(name) {
    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

    Object.defineProperty(this.contextProto, name, {
      get: returnThis,
      enumerable: true,
    });
  },
};

function returnThis() {
  return this;
}

/*
  eslint-env node
 */


},{"../nodsl":22}],28:[function(require,module,exports){
'use strict';

var Operator = require('../model/operator');
var BinaryOperator = require('../model/binary-operator');
var Alias = require('../model/alias');

var NoopRegistry = require('./noop');
var AssertionRegistry = require('./assertion');

var nodsl = require('../nodsl');

module.exports = OperatorRegistry;

function OperatorRegistry(noopRegistry, assertionRegistry) {
  nodsl.check(noopRegistry instanceof NoopRegistry,
      'noopRegistry must be an instance of NoopRegistry; got ', noopRegistry);
  nodsl.check(assertionRegistry instanceof AssertionRegistry,
      'assertionRegistry must be an instance of AssertionRegistry; got ', assertionRegistry);

  this.contextProto = Object.create(noopRegistry.contextProto);
  this.assertionProto = assertionRegistry.contextProto;
  this.registered = {};
}

OperatorRegistry.prototype = {
  add: function addOperator(name, operator) {
    if (operator instanceof Alias) {
      var aliased = this.registered[operator.aliasFor];
      nodsl.check(typeof aliased === 'object',
          'operator of name ', operator.aliasFor, ' pointed by alias ', name, ' not found');
      this.add(name, aliased);
      return;
    }

    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
    nodsl.check(!(name in this.registered), 'operator of name ', name, ' already registered');
    nodsl.check(operator instanceof Operator, 'operator must be an instance of Operator');

    this.registered[name] = operator;

    // only binary operators in operatorProto
    var actualProto = operator instanceof BinaryOperator? this.contextProto: this.assertionProto;

    Object.defineProperty(actualProto, name, {
      get: function() { return this._operator(name, operator); },
      enumerable: true,
    });
  },
};

/*
  eslint-env node
 */


},{"../model/alias":16,"../model/binary-operator":18,"../model/operator":19,"../nodsl":22,"./assertion":26,"./noop":27}],29:[function(require,module,exports){
'use strict';

var nodsl = require('./nodsl');

module.exports = SyntaxTreeBuilder;

function SyntaxTreeBuilder() {
  this.binary = null;
  this.unary = null;
  this.operands = [];
  this.onEvaluateReady = noop;
}

SyntaxTreeBuilder.prototype = {
  addOperand: function(operand) {
    nodsl.check(typeof operand === 'function', 'operand must be a function; got ', operand);

    if (this.unary) {
      this.operands.push(this.unary.bind(null, operand));
      this.unary = null;
    } else {
      this.operands.push(operand);
    }

    if (this.binary) {
      this.operands = [ cacheResult(this.binary.bind(null, this.operands[0], this.operands[1])) ];
      this.binary = null;
    } else {
      nodsl.check(this.operands.length === 1, 'expected binary operator; got operand');
    }

    this.onEvaluateReady(this.evaluate());
  },

  addBinaryOperator: function(operator) {
    nodsl.check(typeof operator === 'function',
        'operator must be a function; got ', operator);
    nodsl.check(this.binary === null,
        'expected operand or unary operator after binary operator; got binary operator');
    nodsl.check(this.operands.length === 1,
        'expected operand or unary operator; got binary operator');

    this.binary = operator;
  },
  addUnaryOperator: function(operator) {
    nodsl.check(typeof operator === 'function',
        'operator must be a function; got ', operator);
    nodsl.check(this.unary === null, 'expected operand after unary operator; got unary operator');
    this.unary = operator;
  },

  isEvaluateReady: function() {
    return this.operands.length === 1 && this.binary === null;
  },
  evaluate: function() {
    nodsl.check(this.unary === null, 'trying to evaluate with dangling unary operator');
    nodsl.check(this.binary === null, 'trying to evaluate with dangling binary operator');
    nodsl.check(this.operands.length === 1, 'trying to evaluate an empty expression');
    return this.operands[0];
  },

  flush: function() {
    nodsl.check(this.unary === null, 'trying to flush with dangling unary operator');
    nodsl.check(this.binary === null, 'trying to flush with dangling binary operator');
    this.operands = [];
  },
};

function noop() {
  // noop
}

function cacheResult(evaluate) {
  var strategy = loader;

  function loader() {
    var result = evaluate();
    strategy = function getter() {
      return result;
    };
    return result;
  }

  return strategy;
}

/*
  eslint-env node
 */


},{"./nodsl":22}],30:[function(require,module,exports){
'use strict';

var CheckFactory = require('./lib/check-factory');

var NoopRegistry = require('./lib/registry/noop');
var AssertionRegistry = require('./lib/registry/assertion');
var OperatorRegistry = require('./lib/registry/operator');

var builtInNoops = require('./lib/built-ins/noops');
var builtInAssertions = require('./lib/built-ins/assertions');
var builtInOperators = require('./lib/built-ins/operators');

var noopRegistry = new NoopRegistry();
builtInNoops.forEach(function(name) {
  noopRegistry.add(name);
});

var assertionRegistry = new AssertionRegistry(noopRegistry);
Object.keys(builtInAssertions).forEach(function(name) {
  assertionRegistry.add(name, builtInAssertions[name]);
});

var operatorRegistry = new OperatorRegistry(noopRegistry, assertionRegistry);
Object.keys(builtInOperators).forEach(function(name) {
  operatorRegistry.add(name, builtInOperators[name]);
});

var offensive = new CheckFactory(assertionRegistry, operatorRegistry);
offensive.onError = throwContractError;

var defensive = new CheckFactory(assertionRegistry, operatorRegistry);

module.exports = offensive.newCheck.bind(offensive);
module.exports.defensive = defensive.newCheck.bind(defensive);
module.exports.addNoop = noopRegistry.add.bind(noopRegistry);
module.exports.addAssertion = assertionRegistry.add.bind(assertionRegistry);
module.exports.addOperator = operatorRegistry.add.bind(operatorRegistry);

function throwContractError(context) {
  var error = new Error(context._message);
  error.name = 'ContractError';
  throw error;
}

/*
  eslint-env node
 */


},{"./lib/built-ins/assertions":7,"./lib/built-ins/noops":11,"./lib/built-ins/operators":12,"./lib/check-factory":13,"./lib/registry/assertion":26,"./lib/registry/noop":27,"./lib/registry/operator":28}]},{},[1]);
