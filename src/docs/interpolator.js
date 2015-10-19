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

module.exports = Interpolator;

function Interpolator(fqnMap, options) {
  var priv = {};
  priv.fqnMap = check(fqnMap, 'fqnMap');
  priv.options = _.defaults(options, { getUrlBase: function() { return ''; } });

  var pub = {};
  pub.interpolate = _.partial(interpolate, priv);
  return pub;
}

function interpolate(priv, context, str) {
  check.setCurrentDoc(context.raw);

  var commands = {
    name: function(arg) { return interpolateProperty(priv, arg, 'name'); },
    value: function(arg) { return interpolateProperty(priv, arg, 'value'); },
    link: function(arg) { return interpolateLink.apply(null, [ priv ].concat(arg.split(' '))); },
    hash: function(arg) { return interpolateHash.apply(null, [ priv, context ].concat(arg.split(' '))); },
  };

  return replaceExpressions(str, function(commandName, argument) {
    var command = check(commands[commandName], 'unknown command: '+ commandName);
    return command(interpolate(priv, context, argument));
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

function interpolateProperty(priv, fqn, property) {
  var comment = check(priv.fqnMap.get(fqn), 'could not find element of fqn: '+ fqn);
  return comment[property];
}

function interpolateLink(priv, address) {
  var url = '#'+ address;
  if (priv.fqnMap.contains(address)) {
    url = priv.options.getUrlBase(priv.fqnMap.get(address)) +'#'+ toGithubHashLink(address);
  }
  var anchorText = [].slice.call(arguments, 2).join(' ') || address;
  return '['+ anchorText +']('+ url +')';
}

function interpolateHash(priv, context, fqn) {
  var comment = check(priv.fqnMap.get(fqn), 'couldn\'t find element of fqn='+ fqn);
  var anchorText = [].slice.call(arguments, 3).join(' ') || getAnchorText(context, comment);
  return interpolateLink(priv, fqn, anchorText);
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

/*
  eslint-env node
*/

