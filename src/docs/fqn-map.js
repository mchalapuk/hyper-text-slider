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

var _ = require('underscore');
var check = require('./check');

module.exports = FqnMap;

function FqnMap() {
  var priv = {};
  priv.data = {};

  var pub = {};
  pub.put = _.partial(put, priv);
  pub.get = _.partial(get, priv);
  pub.contains = _.partial(contains, priv);
  pub.getChildrenOf = _.partial(getChildrenOf, priv);
  pub.getParentOf = _.partial(getParentOf, priv);
  pub.walk = _.partial(walk, priv);
  return pub;
}

function contains(priv, fqn) {
  return priv.data.hasOwnProperty(fqn);
}

function get(priv, fqn) {
  return priv.data[fqn];
}

function put(priv, formatted) {
  var fqn = formatted.fqn;
  if (fqn !== '') {
    priv.data[fqn] = formatted;
  }
}

function getParentOf(priv, fqn) {
  var lastDotIndex = fqn.indexOf('.', -1);
  if (lastDotIndex === -1) {
    return null;
  }
  var parentFqn = fqn.substring(0, lastDotIndex);
  if (parentFqn.endsWith('.prototype')) {
    parentFqn = parentFqn.substring(0, -'.prototype'.length);
  }
  return check(priv.data[parentFqn],
      'couldn\'t find parent element of fqn='+ fqn +' parentfqn='+ parentFqn);
}

function getChildrenOf(priv, fqn) {
  var level = (fqn !== ''? fqn.split('.').length: 0) + 1;

  function isChild(name) {
    return name.indexOf(fqn) === 0 && level === name.split('.').length;
  }
  function isChildOfPrototype(name) {
    return name.indexOf(fqn +'.prototype') === 0 && level === name.split('.').length - 1;
  }

  return Object.keys(priv.data)
    .filter(function(name) { return isChild(name) || isChildOfPrototype(name); })
    .map(function(name) { return priv.data[name]; })
    .sort(function(left, right) { return left.commentId > right.commentId; })
    ;
}

function walk(priv, callback) {
  _.keys(priv.data).forEach(function(fqn) { callback(fqn, priv.data[fqn]); });
}

/*
  eslint-env node
*/

