import { print, Source } from 'graphql/language';
import gql, { disableFragmentWarnings } from 'graphql-tag';

var immutable = extend;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}

function inlineSpreadFragments(fragmentDefinitions, definition) {
  if (definition.kind === 'FragmentSpread') {
    return fragmentDefinitions.find(function (_ref) {
      var name = _ref.name;
      return name.value === definition.name.value;
    });
  }
  if (!definition.selectionSet) {
    return definition;
  }

  definition.selectionSet = immutable(definition.selectionSet, {
    selections: definition.selectionSet.selections.map(function (selection) {
      return inlineSpreadFragments(fragmentDefinitions, selection);
    })
  });

  return definition;
}

function toInlineFragment(doc) {
  var definitions = doc.definitions.map(function (definition) {
    if (definition.kind !== 'FragmentDefinition') {
      throw new Error('fraql: toInlineFragment must be called on a document that only contains fragments');
    }

    return {
      kind: 'InlineFragment',
      name: definition.name,
      directives: definition.directives,
      selectionSet: definition.selectionSet,
      typeCondition: definition.typeCondition
    };
  });

  definitions = definitions.map(function (definition) {
    return inlineSpreadFragments(definitions, definition);
  });

  var definition = definitions[0];

  if (!definition) {
    throw new Error('Unable to find a fragment definition');
  }

  var newDoc = immutable(doc, {
    originalDocument: doc,
    definitions: [definition]
  });

  newDoc.loc = immutable(doc.loc, {
    source: new Source(print(newDoc))
  });

  return newDoc;
}

var fraql = function fraql() {
  disableFragmentWarnings();

  var doc = gql.apply(undefined, arguments);

  if (doc.definitions.every(function (_ref) {
    var kind = _ref.kind;
    return kind === 'FragmentDefinition';
  })) {
    return toInlineFragment(doc);
  }

  return doc;
};

export default fraql;
export { toInlineFragment };
//# sourceMappingURL=fraql.es.js.map
