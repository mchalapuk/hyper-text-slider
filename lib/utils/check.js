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

