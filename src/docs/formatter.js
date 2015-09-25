
function format(docfile) {
  var fqnMap = {};
  var toplevel = [];
  var nextId = 0;

  docfile.javadoc.forEach(function(javadoc){
    var type = (javadoc.ctx && javadoc.ctx.type);
    var name = (javadoc.ctx && typeof javadoc.ctx.name === 'string') ? javadoc.ctx.name : '';
    var value = (javadoc.ctx? javadoc.ctx.value.replace(/(^[\s,;'"]*|[\s,;'"]*$)/g, ''): '');
    var description = javadoc.description;

    var tagValues = {
      'name': '',
      'fqn': '',
      'usage': '',
      'client-html': '',
      'parent-element': '',
      'see': '',
      'deprecated': false,
    }

    javadoc.tags.forEach(function(tag) {
      tagValues[tag.type] = tag.url || tag.local || tag.string;
    });

    var fqn = tagValues.fqn !== ''? tagValues.fqn: name;
    name = tagValues.name !== ''? tagValues.name: name

    javadoc.filename = docfile.filename;

    if (fqn in fqnMap) {
      var first = fqnMap[fqn].raw;
      var second = javadoc;

      throw 'Two elements of the same fully qualified name (fqn) found:\n'+
        ' 1. '+ first.filename +':'+ first.line +'\n'+
        ' 2. '+ second.filename +':'+ second.line;
    }

    fqnMap[fqn] = {
      commentId: nextId++,
      type: type,
      name: name,
      fqn: fqn,
      value: value,
      description: description,
      usage: tagValues.usage,
      clientHTML: tagValues['client-html'],
      parentElement: tagValues['parent-element'],
      see: tagValues.see,
      deprecated: tagValues.deprecated,
      ignore: javadoc.ignore,
      raw: javadoc,

      // set after all elements are defined
      parent: null,
      children: [],
    };
  });


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

  Object.keys(fqnMap).forEach(function(fqn){
    var comment = fqnMap[fqn];

    comment.parent = getParentByFqn(fqn);
    comment.children = getChildrenByFqn(fqn);
    comment.parentElement = fqnMap[comment.parentElement];

    if (!comment.parent) {
      toplevel.push(comment);
    }
  });

  var result = {};
  result.filename = docfile.filename;
  result.javadoc = toplevel;
//  console.log(JSON.stringify(result, '\n', 2));
  return result;
};

module.exports = format;

