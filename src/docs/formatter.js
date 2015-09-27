var fqnMap = {};
var nextId = 0;

var currentDoc = null;

function err() {
  throw 'error while processing '+ currentDoc.filename +':'+ currentDoc.line +'\n'+
    [].map.call(arguments, function(line) {return '  '+ line; }).join('\n');
}

function format(docfile) {
  var toplevel = [];

  docfile.javadoc.forEach(function(javadoc){
    javadoc.filename = docfile.filename;
    currentDoc = javadoc;

    var type = (javadoc.ctx && javadoc.ctx.type);
    var name = (javadoc.ctx && typeof javadoc.ctx.name === 'string') ? javadoc.ctx.name : '';
    var value = (javadoc.ctx? javadoc.ctx.value.replace(/(^[\s,;'"]*|[\s,;'"]*$)/g, ''): '');
    var description = javadoc.description;
    description.summary = description.summary.replace(/\n/g, '');

    var tagValues = {
      'deprecated': false,
    };
    var multiTagValues = {
      'summary-column': [],
      'invariant': [],
      'see': [],
    };

    javadoc.tags.forEach(function(tag) {
      var value = tag.url || tag.local || tag.string;

      if (tag.type in multiTagValues) {
        multiTagValues[tag.type].push(value);
      } else {
        tagValues[tag.type] = value;
      }
    });

    multiTagValues['summary-column'] = multiTagValues['summary-column'].map(function(tag) {
      var spaceIndex = tag.indexOf(' ');
      return {
        key: spaceIndex !== -1? tag.substring(0, spaceIndex): tag,
        description: spaceIndex !== -1? tag.substring(spaceIndex + 1): tag,
        full: tag,
      };
    });

    var fqn = tagValues.fqn? tagValues.fqn: name;
    name = tagValues.name? tagValues.name: name

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

    // properties that may need other comments to be formatted are lazy-loaded
    Object.defineProperty(formatted, 'description', {
      get: lazy(function() {
        return {
          summary: interpolate(description.summary),
          body: interpolate(description.body),
          full: interpolate(description.full),
        };
      }),
    });
    Object.defineProperty(formatted, 'parent', {
      get: lazy(getParentByFqn.bind(null, fqn)),
    });
    Object.defineProperty(formatted, 'children', {
      get: lazy(getChildrenByFqn.bind(null, fqn)),
    });
    Object.defineProperty(formatted, 'parentElement', {
      get: lazy(function() { return fqnMap[tagValues['parent-element']]; }),
    });

    fqnMap[fqn] = formatted;

    if (fqn.indexOf('.') === -1) {
      toplevel.push(formatted);
    }
  });

  var result = {};
  result.filename = docfile.filename;
  result.javadoc = toplevel;
  return result;
};

module.exports = format;

return;

function getParentByFqn(fqn) {
  var lastDotIndex = fqn.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    var parentFqn = fqn.substring(0, lastDotIndex);
    return fqnMap[fqn];
  } else {
    return null;
  }
}

function getChildrenByFqn(fqn) {
  var level = (fqn !== ''? fqn.split('.').length: 0) + 1;

  return Object.keys(fqnMap)
    .filter(function(name) { return name.indexOf(fqn) === 0 && level === name.split('.').length; })
    .map(function(name) { return fqnMap[name]; })
    .sort(function(a, b) { return a.commentId > b.commentId; })
    ;
}

function interpolate(str) {
  var retVal = '';
  var i = 0;

  while (true) {
    var startIndex = str.indexOf('${', i);
    if (startIndex === -1) {
      retVal += str.substring(i);
      break;
    }

    retVal += str.substring(i, startIndex);
    var endIndex = str.indexOf('}', startIndex);
    if (endIndex === -1) {
      err('unclosed variable: "'+ str +'"');
    }

    var variable = str.substring(startIndex + 2, endIndex);
    var openBrackets = variable.match(/{/g);
    if (openBrackets) {
      for (var i = 0; i < openBrackets.length; ++i) {
        endIndex = str.indexOf('}', endIndex + 1);
        if (endIndex === -1) {
          err('unclosed variable: "'+ str +'"');
        }
      }
      variable = str.substring(startIndex + 2, endIndex);
    }

    var spaceIndex = variable.indexOf(' ');
    if (spaceIndex === -1) {
      err('no space found in variable: "'+ str +'"');
    }

    var command = variable.substring(0, spaceIndex);
    var argument = interpolate(variable.substring(spaceIndex + 1));

    switch (command) {
      case 'name': retVal += interpolateProperty(argument, 'name'); break;
      case 'hash': retVal += toGithubHashLink(interpolateProperty(argument, 'name')); break;
      case 'value': retVal += interpolateProperty(argument, 'value'); break;
      case 'link': retVal += interpolateLink.apply(null, argument.split(' ')); break;
      default: err('unknown command in: '+ variable);
    }

    i = endIndex + 1;
  }
  return retVal
}

function interpolateProperty(fqn, property) {
  var comment = fqnMap[fqn];
  if (!comment) {
    err('could not find element of fqn: '+ fqn);
  }
  return comment[property];
}

function interpolateLink(url) {
  anchorText = [].slice.call(arguments, 1).join(' ') || url;
  return '['+ anchorText +'](#'+ url +')';
}

function toGithubHashLink(headerName) {
  return headerName.toLowerCase().replace(/ /g, '-').replace(/[\[\]{}()^$#@!%&*]/g, '');
}

function lazy(loader) {
  var getter = function() {
    var retVal = loader();
    getter = function() { return retVal; };
    return retVal;
  }
  return function() {
    return getter();
  }
}

