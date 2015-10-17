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

module.exports = format;
module.exports.reset = reset;

var fqnMap = {};
var nextId = 0;
var currentDoc = null;

function format(docfile) {
  var toplevel = [];

  docfile.javadoc.forEach(function(javadoc) {
    javadoc.filename = docfile.filename;
    currentDoc = javadoc;

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
      var tagValue = tag.url || tag.local || tag.string;

      if (tag.type in multiTagValues) {
        multiTagValues[tag.type].push(tagValue);
      } else {
        tagValues[tag.type] = tagValue;
      }
    });

    var fqn = tagValues.fqn || name;
    name = tagValues.name || name;

    if (fqn in fqnMap) {
      err('found second element of fqn='+ fqn,
          'first seen in '+ fqnMap[fqn].raw.filename +':'+ fqnMap[fqn].raw.line,
          'fqn MUST uniquely identify a comment');
    }

    var formatted = {
      commentId: nextId++,
      type: type,
      name: name,
      fqn: fqn,
      value: value,
      tags: tagValues,
      multiTags: multiTagValues,
      ignore: javadoc.ignore,
      raw: javadoc,
    };

    register(formatted);
    // properties, that may need other comments
    // to be registered, are lazy-loaded
    lazyInterpolateExpr(formatted);
    lazyBuildObjectTree(formatted);
  });

  function register(formatted) {
    var fqn = formatted.fqn;
    if (fqn === '') {
      return;
    }
    fqnMap[fqn] = formatted;

    if (fqn.indexOf('.') === -1) {
      toplevel.push(formatted);
    }
  }

  var result = {};
  result.filename = docfile.filename;
  result.javadoc = toplevel;
  return result;
}

function reset() {
  fqnMap = {};
  nextId = 0;
  currentDoc = null;
}

function lazyInterpolateExpr(formatted) {
  var description = formatted.raw.description;
  var multiTagValues = formatted.multiTags;

  definePropertyGetters(formatted, {
    description: lazy(function() {
      return {
        summary: interpolate(formatted, description.summary.replace(/\n/g, '')),
        body: interpolate(formatted, description.body),
        full: interpolate(formatted, description.full),
      };
    }),
  });

  var multiTags = {};
  Object.keys(multiTagValues).forEach(function(tagName) {
    multiTags[tagName] = lazy([].map.bind(multiTagValues[tagName], function(tagValue) {
      var process = null;
      switch (tagName) {
        default: process = pass; break;
        case 'summary-column': process = processSummaryColumnTags; break;
        case 'param': process = processParamTags; break;
      }
      return process(interpolate(formatted, tagValue));
    }));
  });
  definePropertyGetters(formatted.multiTags, multiTags);
}

// sets parent->child relations
function lazyBuildObjectTree(formatted) {
  definePropertyGetters(formatted, {
    children: lazy(getChildrenByFqn.bind(null, formatted.fqn)),
    fields: lazy(filterChildrenByType.bind(null, formatted, 'property')),
    methods: lazy(filterChildrenByType.bind(null, formatted, 'function')),
    parent: lazy(getParentByFqn.bind(null, formatted.fqn)),
    parentElement: lazy(function() { return fqnMap[formatted.tags['parent-element']]; }),
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

function getChildrenByFqn(fqn) {
  var level = (fqn !== ''? fqn.split('.').length: 0) + 1;

  function isChild(name) {
    return name.indexOf(fqn) === 0 && level === name.split('.').length;
  }
  function isChildOfPrototype(name) {
    return name.indexOf(fqn +'.prototype') === 0 && level === name.split('.').length - 1;
  }

  return Object.keys(fqnMap)
    .filter(function(name) { return isChild(name) || isChildOfPrototype(name); })
    .map(function(name) { return fqnMap[name]; })
    .sort(function(left, right) { return left.commentId > right.commentId; })
    ;
}

function filterChildrenByType(comment, type) {
  return comment.children.filter(function(child) { return child.type === type; });
}

function getParentByFqn(fqn) {
  var lastDotIndex = fqn.indexOf('.', -1);
  if (lastDotIndex === -1) {
    return null;
  }
  var parentFqn = fqn.substring(0, lastDotIndex);
  if (parentFqn.endsWith('.prototype')) {
    parentFqn = parentFqn.substring(0, -'.prototype'.length);
  }
  return check(fqnMap[parentFqn],
      'couldn\'t find parent element of fqn='+ fqn +' parentfqn='+ parentFqn);
}

function pass(arg) {
  return arg;
}

function processSummaryColumnTags(tag) {
  var spaceIndex = tag.indexOf(' ');
  return {
    key: spaceIndex !== -1? tag.substring(0, spaceIndex): tag,
    description: spaceIndex !== -1? tag.substring(spaceIndex + 1): tag,
    full: tag,
  };
}

function processParamTags(tag) {
  var type = 'Unkonwn';
  var nameAndDesc = tag;
  if (tag.indexOf('{') !== -1) {
    var typeEnd = tag.indexOf('}');
    type = tag.substring(1, typeEnd);
    nameAndDesc = tag.substring(typeEnd + 2);
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
    full: tag,
  };
}

function interpolate(context, str) {
  var commands = {
    name: function(arg) { return interpolateProperty(arg, 'name'); },
    value: function(arg) { return interpolateProperty(arg, 'value'); },
    link: function(arg) { return interpolateLink.apply(null, arg.split(' ')); },
    hash: function(arg) { return interpolateHash.apply(null, [ context ].concat(arg.split(' '))); },
  };

  return replaceExpressions(str, function(commandName, argument) {
    var command = check(commands[commandName], 'unknown command: '+ commandName);
    return command(interpolate(context, argument));
  });
}

function replaceExpressions(str, replaceFunction) {
  check(typeof str === 'string', 'passed argument is not a string: '+ str);

  var retVal = '';
  var worker = textWorker();
  str.split('').forEach(function(c) { worker(c); });
  return retVal;

  function textWorker() {
    var maybeExpression = false;

    function appendCharacter(c) {
      if (maybeExpression) {
        maybeExpression = false;
        retVal += '$';
      }
      retVal += c;
    }

    function startExpression(c) {
      if (maybeExpression) {
        worker = expressionWorker();
      } else {
        retVal += c;
      }
    }

    return function(c) {
      switch (c) {
        default: appendCharacter(c); break;
        case '$': maybeExpression = true; break;
        case '{': startExpression(c); break;
      }
    };
  }

  function expressionWorker() {
    var expressionString = '';
    var opened = 1;

    function replace() {
      var spaceIndex = expressionString.indexOf(' ');
      if (spaceIndex === -1) {
        return replaceFunction(expressionString, '');
      }
      var commandName = expressionString.substring(0, spaceIndex);
      var argument = expressionString.substring(spaceIndex + 1);
      return replaceFunction(commandName, argument);
    }

    function maybeFlush(c) {
      opened -= 1;
      if (opened !== 0) {
        expressionString += c;
        return;
      }
      retVal += replace();
      worker = textWorker();
    }

    return function(c) {
      switch (c) {
        default: expressionString += c; break;
        case '{': opened += 1; expressionString += c; break;
        case '}': maybeFlush(c); break;
      }
    };
  }
}

function interpolateProperty(fqn, property) {
  var comment = fqnMap[fqn];
  if (!comment) {
    err('could not find element of fqn: '+ fqn);
  }
  return comment[property];
}

function interpolateLink(url) {
  var anchorText = [].slice.call(arguments, 1).join(' ') || url;
  return '['+ anchorText +'](#'+ url +')';
}

function interpolateHash(context, fqn) {
  var comment = check(fqnMap[fqn], 'couldn\'t find element of fqn='+ fqn);
  var anchorText = [].slice.call(arguments, 2).join(' ') || getAnchorText(context, comment);
  return interpolateLink(toGithubHashLink(fqn), anchorText);
}

function getAnchorText(context, comment) {
  var fqn = comment.fqn;

  var prefix = fqn.startsWith(context.fqn) && fqn !== context.fqn? context.fqn:
    context.parent && fqn.startsWith(context.parent.fqn)? context.parent.fqn:
    '';
  var anchorText = fqn.substring(prefix.length);
  if (comment.type === 'function') {
    anchorText += '('+ paramList(comment) +')';
  }

  return anchorText;
}

function paramList(comment) {
  return comment.multiTags.param.map(function(param) { return param.name; }).join(', ');
}

function toGithubHashLink(headerName) {
  return headerName.toLowerCase().replace(/ /g, '-').replace(/[\[\]{}()<>^$#@!%&*+\/\\|~`"':;,.]/g, '');
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

function err() {
  throw new Error('error while processing '+ currentDoc.filename +':'+ currentDoc.line +'\n'+
    [].map.call(arguments, function(line) { return '    '+ line; }).join('\n'));
}

function check(condition) {
  if (!condition) {
    err.apply(null, [].slice.call(arguments, 1));
  }
  return condition;
}

/*
  eslint-env node
*/

