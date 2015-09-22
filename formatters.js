var markdox = require('markdox');

module.exports = {
  'markdox': markdox.defaultFormatter,
  'classNames': formatClassNames
};

function tagValue(javadoc, tagName) {
  for (var j = 0; j < javadoc.tags.length; ++j) {
    var tag = javadoc.tags[j];
    if (tag.type === tagName) {
      return tag.string;
    }
  }
}

function formatClassNames(docfile, tagName) {
  var columns = tagValue(docfile.javadoc[0], 'table').split(' ');
  var links = tagValue(docfile.javadoc[0], 'links').split(' ');
  var data = docfile.javadoc.map(function(elem) {
    var retVal = {};
    elem.tags.forEach(function(tag) { retVal[tag.type] = tag.string });
    retVal.description = elem.description.summary;
    links.forEach(function(column) {
      var value = retVal[column];
      retVal[column] = value !== undefined? '['+ value +'](#'+ value +')': undefined;
    });
    return retVal;
  }).slice(1);

  function createRow(values) {
    return columns.map(function(name) { return values[name]; }).join(' | ');
  }

  docfile.javadoc[0].description.full += columns.join(' | ') +'\n'+
  columns.map(function(name) { return name.replace(/./g, '-'); }).join(' | ') +'\n'+
  data.map(createRow).join('\n');
  return markdox.defaultFormatter(docfile);
}

