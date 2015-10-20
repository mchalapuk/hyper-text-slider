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
var FqnMap = require('./fqn-map');
var Interpolator = require('./interpolator');

module.exports = Formatter;

function Formatter(options) {
  var priv = {};
  priv.fqnMap = new FqnMap();
  priv.interpolator = new Interpolator(priv.fqnMap, options);
  priv.nextId = 0;
  priv.options = options;

  var pub = {};
  pub.format = _.partial(format, priv);
  pub.reset = _.partial(reset, priv);
  return pub;
}

// public

function format(priv, docfile) {
  var toplevel = [];

  docfile.javadoc.forEach(function(javadoc) {
    javadoc.filename = docfile.filename;
    check.setCurrentDoc(javadoc);

    var type = getType(javadoc.ctx);
    var name = getName(javadoc.ctx);
    var value = getValue(javadoc.ctx);

    var tagValues = {
      deprecated: false,
    };
    var multiTagValues = {
      'param': [],
      'summary-column': [],
      'precondition': [],
      'postcondition': [],
      'invariant': [],
      'see': [],
    };

    javadoc.tags.forEach(function(tag) {
      var tagValue = (tag.url || tag.local || tag.string).trim();

      if (tag.type in multiTagValues) {
        multiTagValues[tag.type].push(tagValue);
      } else {
        tagValues[tag.type] = tagValue;
      }
    });

    var fqn = tagValues.fqn || name;
    name = tagValues.name || name;
    checkNotDefined(priv, fqn);

    var formatted = {
      commentId: priv.nextId++,
      type: type,
      name: name,
      fqn: fqn,
      value: value,
      tags: tagValues,
      multiTags: multiTagValues,
      ignore: javadoc.ignore,
      options: priv.options,
      raw: javadoc,
    };

    priv.fqnMap.put(formatted);
    if (isTopLevel(fqn)) {
      toplevel.push(formatted);
    }
    // properties, that may need other comments
    // to be registered, are lazy-loaded
    lazyInterpolateExpr(priv, formatted);
    lazyBuildObjectTree(priv, formatted);
  });

  var result = {};
  result.filename = docfile.filename;
  result.javadoc = toplevel;
  return result;
}

function reset(priv) {
  priv.fqnMap = new FqnMap();
  priv.interpolator = new Interpolator(priv.fqnMap, priv.options);
}

// private

function lazyInterpolateExpr(priv, formatted) {
  var description = formatted.raw.description;
  var multiTagValues = formatted.multiTags;

  definePropertyGetters(formatted, {
    description: lazy(function() {
      return {
        summary: priv.interpolator.interpolate(formatted, description.summary.replace(/\n/g, '')),
        body: priv.interpolator.interpolate(formatted, description.body),
        full: priv.interpolator.interpolate(formatted, description.full),
      };
    }),
  });

  var multiTags = {};
  Object.keys(multiTagValues).forEach(function(tagName) {
    multiTags[tagName] = lazy([].map.bind(multiTagValues[tagName], function(tagValue) {
      switch (tagName) {
        default: return priv.interpolator.interpolate(formatted, tagValue);
        case 'summary-column': return processSummaryColumnTag(priv, formatted, tagValue);
        case 'param': return processParamTag(priv, formatted, tagValue);
        case 'see': return processSeeTag(priv, formatted, tagValue);
      }
    }));
  });
  definePropertyGetters(formatted.multiTags, multiTags);
}

var Filter = {
  ofType: function(type) {
    return function(comment) {
      return comment.type === type;
    };
  },
};

// sets parent->child relations
function lazyBuildObjectTree(priv, formatted) {
  definePropertyGetters(formatted, {
    children: lazy(function() { return priv.fqnMap.getChildrenOf(formatted.fqn); }),
    fields: lazy(function() { return formatted.children.filter(Filter.ofType('property')); }),
    methods: lazy(function() { return formatted.children.filter(Filter.ofType('function')); }),
    parent: lazy(function() { return priv.fqnMap.getParentOf(formatted.fqn); }),
    parentElement: lazy(function() { return priv.fqnMap.get(formatted.tags['parent-element']); }),
  });
}

function getType(ctx) {
  return ctx && ctx.type? ctx.type: '';
}
function getName(ctx) {
  return ctx && ctx.name? ctx.name: '';
}
function getValue(ctx) {
  return ctx && ctx.value? ctx.value.replace(/(^[\s,;'"]*|[\s,;'"]*$)/g, ''): '';
}

function checkNotDefined(priv, fqn) {
  if (priv.fqnMap.contains(fqn)) {
    check(false, 'found second element of fqn='+ fqn,
        'first seen in '+ priv.fqnMap.get(fqn).raw.filename +':'+ priv.fqnMap.get(fqn).raw.line,
        'fqn MUST uniquely identify a comment');
  }
}

function isTopLevel(fqn) {
  return fqn !== '' && fqn.indexOf('.') === -1;
}

function processSummaryColumnTag(priv, formatted, value) {
  var interpolated = priv.interpolator.interpolate(formatted, value);
  var spaceIndex = interpolated.indexOf(' ');
  return {
    key: spaceIndex !== -1? interpolated.substring(0, spaceIndex): value,
    description: spaceIndex !== -1? interpolated.substring(spaceIndex + 1): value,
    full: interpolated,
  };
}

function processParamTag(priv, formatted, value) {
  var interpolated = priv.interpolator.interpolate(formatted, value);

  var type = 'Unkonwn';
  var nameAndDesc = interpolated;
  if (interpolated.indexOf('{') !== -1) {
    var typeEnd = interpolated.indexOf('}');
    type = interpolated.substring(1, typeEnd);
    nameAndDesc = interpolated.substring(typeEnd + 2);
  }

  var name = nameAndDesc;
  var description = '';
  var spaceIndex = nameAndDesc.indexOf(' ');
  if (spaceIndex !== -1) {
    name = nameAndDesc.substring(0, spaceIndex);
    description = nameAndDesc.substring(spaceIndex + 1);
  }

  return {
    type: type,
    name: name,
    description: description,
    full: interpolated,
  };
}

function processSeeTag(priv, formatted, value) {
  if (priv.fqnMap.contains(value)) {
    return priv.interpolator.interpolate(formatted, '${link '+ value +'}');
  }
  return priv.interpolator.interpolate(formatted, value);
}

function lazy(loader) {
  var getter = function() {
    var retVal = loader();
    getter = function() { return retVal; };
    return retVal;
  };
  return function() {
    return getter();
  };
}

function definePropertyGetters(object, propertyGetters) {
  Object.keys(propertyGetters).forEach(function(key) {
    Object.defineProperty(object, key, { get: propertyGetters[key], enumerable: true });
  });
}

/*
  eslint-env node
*/

