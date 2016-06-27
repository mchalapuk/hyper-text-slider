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
    link: function(arg) {
      var fqn = arg.split(/\s/)[0], anchor = arg.split(/\s/).slice(1).join(' ');
      return interpolateLink(priv, context, fqn, anchor);
    },
    value: function(arg) {
      return interpolateValue(priv, context, arg);
    },
  };

  return replaceExpressions(str, function(commandName, argument) {
    var command = check(commands[commandName], 'unknown command: '+ commandName);
    return command(interpolate(priv, context, argument));
  });
}

function replaceExpressions(str, replaceFunction) {
  check(typeof str === 'string', 'passed argument is not a string: '+ JSON.stringify(str));

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

function interpolateLink(priv, context, fqn, anchor) {
  var comment = check(priv.fqnMap.get(fqn), 'couldn\'t find element of fqn='+ fqn);
  var titleProperty = priv.options.titleProperty(comment);
  var title = comment[titleProperty];

  var anchorFactory = {
    fqn: function() {
      var prefix = fqn.startsWith(context.fqn) && fqn !== context.fqn? context.fqn:
        context.parent && fqn.startsWith(context.parent.fqn)? context.parent.fqn:
        '';
      var anchorText = fqn.substring(prefix.length);
      if (comment.type === 'function') {
        anchorText += '('+ paramList(comment) +')';
      }

      return anchorText;
    },
  };

  var anchorText = anchor || anchorFactory[titleProperty] && anchorFactory[titleProperty]();
  var url = priv.options.urlBase(comment) +'#'+ toGithubHashLink(title);
  return '['+ (anchorText || title) +']('+ url +')';
}


function paramList(comment) {
  return comment.multiTags.param.map(function(param) { return param.name; }).join(', ');
}

function toGithubHashLink(headerName) {
  return headerName.toLowerCase().replace(/ /g, '-').replace(/[\[\]{}()<>^$#@!%&*+\/\\|~`"':;,.]/g, '');
}

function interpolateValue(priv, context, maybeFqn) {
  var fqn = maybeFqn || context.fqn;
  var comment = check(priv.fqnMap.get(fqn), 'couldn\'t find element of fqn='+ fqn);
  var value = comment.raw.value;

  return interpolateLink(priv, context, fqn, value);
}

/*
  eslint-env node
*/

