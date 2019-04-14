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

module.exports = GithubMarkdownFormatter;

function GithubMarkdownFormatter() {
  var priv = {};
  priv.fqnMap = new FqnMap();
  priv.interpolator = new Interpolator(priv.fqnMap);
  priv.nextId = 0;

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

    var idTagValues = {
      'fqn': null,
      'name': null,
      'parent-element': null,
    };
    var tagValues = {
      'deprecated': false,
      'return': '{void}',
      'type': 'unknown',
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
      var tagValue = getTagValue(tag);

      if (tag.type in multiTagValues) {
        multiTagValues[tag.type].push(tagValue);
      } else if (tag.type in idTagValues) {
        idTagValues[tag.type] = tagValue;
      } else {
        tagValues[tag.type] = tagValue;
      }
    });

    var fqn = idTagValues.fqn || name;
    name = idTagValues.name || name;
    checkNotDefined(priv, fqn);

    var formatted = {
      commentId: priv.nextId++,
      type: type,
      name: name,
      fqn: fqn,
      value: value,
      tags: tagValues,
      multiTags: multiTagValues,
      idTags: idTagValues,
      ignore: javadoc.ignore,
      raw: javadoc,
    };

    priv.fqnMap.put(formatted);
    if (isTopLevel(fqn)) {
      toplevel.push(formatted);
    }
    // properties, that may need other comments
    // to be registered, are lazy-loaded
    lazyLoadProperties(priv, formatted, docfile);
    lazyInterpolateTexts(priv, formatted);
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

function lazyLoadProperties(priv, formatted, docfile) {
  var getters = {};

  switch (formatted.type) {
    case 'property':
      getters.signature = lazy(_.partial(getFieldSignature, formatted));
      break;
    case 'function':
      getters.signature = lazy(_.partial(getMethodSignature, formatted));
      break;
    default:
      break;
  }
  getters.link = lazy(function() {
    var retVal = {};
    retVal.url = getGithubUrl(formatted, docfile);
    retVal.full = getLink(formatted, retVal.url, docfile);
    retVal.short = getShortLink(formatted, retVal.url, docfile);
    return retVal;
  });

  definePropertyGetters(formatted, getters);
}

function lazyInterpolateTexts(priv, formatted) {
  var description = formatted.raw.description;
  var tagValues = formatted.tags;
  var multiTagValues = formatted.multiTags;

  definePropertyGetters(formatted, {
    description: lazy(function() {
      return {
        summary: priv.interpolator.interpolate(formatted, description.summary.replace(/\n/g, ' ')),
        body: priv.interpolator.interpolate(formatted, description.body),
        full: priv.interpolator.interpolate(formatted, description.full),
      };
    }),
  });

  var tags = {};
  Object.keys(tagValues).forEach(function(tagName) {
    var tagValue = tagValues[tagName];

    tags[tagName] = lazy(function() {
      switch (tagName) {
        default: return priv.interpolator.interpolate(formatted, tagValue);
        case 'return': return processReturnTag(priv, formatted, tagValue);
      }
    });
  });
  definePropertyGetters(formatted.tags, tags);

  var multiTags = {};
  Object.keys(multiTagValues).forEach(function(tagName) {
    multiTags[tagName] = lazy([].map.bind(multiTagValues[tagName], function(tagValue) {
      switch (tagName) {
        default: return priv.interpolator.interpolate(formatted, tagValue);
        case 'summary-column': return processSummaryColumnTag(priv, formatted, tagValue);
        case 'param': return processParamTag(priv, formatted, tagValue);
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
    parentElement: lazy(function() { return priv.fqnMap.get(formatted.idTags['parent-element']); }),
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
function getTagValue(rawTag) {
  return (rawTag.url || rawTag.local || rawTag.string).trim();
}

function getFieldSignature(formatted) {
  return formatted.fqn;
}
function getParamList(formatted) {
  return formatted.multiTags.param.map(function(param) { return param.name; }).join(', ');
}
function getMethodSignature(formatted) {
  return formatted.fqn +'('+ getParamList(formatted) +')';
}

function getGithubUrl(formatted, docfile) {
  var urlBase = checkOptionDefined(docfile.options, 'concat', formatted.raw.filename);
  return urlBase +'#'+ toGithubHash(getLinkAnchor(formatted, docfile));
}
// Algorithm of generating a HTML label used in Github Markdown
function toGithubHash(title) {
  var GITHUB_ILLEGAL = new RegExp('[\\[\\]{}()<>^$#@!%&*+\/\\|~`"\':;,.]', 'g');
  return title.toLowerCase().replace(/ /g, '-').replace(GITHUB_ILLEGAL, '');
}

function getLink(formatted, url, docfile) {
  return '<a href="'+ url +'">'+ getLinkAnchor(formatted, docfile) +'</a>';
}
function getShortLink(formatted, url, docfile) {
  return '<a href="'+ url +'">'+ getShortLinkAnchor(formatted, docfile) +'</a>';
}

function getLinkAnchor(formatted, docfile) {
  if (formatted.idTags.name) {
    return formatted.idTags.name;
  }
  var titleProperty = docfile.options.titleProperty;
  if (titleProperty && formatted[titleProperty]) {
    return formatted[titleProperty];
  }
  return formatted.fqn;
}
function getShortLinkAnchor(formatted, docfile) {
  var anchor = getLinkAnchor(formatted, docfile);
  if (anchor.startsWith(formatted.fqn) && formatted.parent) {
    anchor = anchor.substring(formatted.parent.fqn.length);
  }
  return anchor;
}

function checkNotDefined(priv, fqn) {
  if (priv.fqnMap.contains(fqn)) {
    check(false, 'found second element of fqn='+ fqn,
        'first seen in '+ priv.fqnMap.get(fqn).raw.filename +':'+ priv.fqnMap.get(fqn).raw.line,
        'fqn MUST uniquely identify a comment');
  }
}
function checkOptionDefined(fileOptions, optionName, fileName) {
  var value = fileOptions[optionName];
  return check(value, '"'+ optionName +'" option undefined for source file: '+ fileName);
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

  var type = 'unknown';
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

function processReturnTag(priv, formatted, value) {
  var interpolated = priv.interpolator.interpolate(formatted, value);

  var type = 'unknown';
  var desc = interpolated;
  if (interpolated.indexOf('{') !== -1) {
    var typeEnd = interpolated.indexOf('}');
    type = interpolated.substring(1, typeEnd);
    desc = interpolated.substring(typeEnd + 2);
  }

  return {
    type: type,
    description: desc,
    full: interpolated,
  };
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

