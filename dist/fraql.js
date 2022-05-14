(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('graphql/language'), require('graphql-tag')) :
    typeof define === 'function' && define.amd ? define(['exports', 'graphql/language', 'graphql-tag'], factory) :
    (factory((global.fraql = {}),global.graphqlLanguage,global.gql));
}(this, (function (exports,language,gql) { 'use strict';

    var gql__default = 'default' in gql ? gql['default'] : gql;

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
        source: new language.Source(language.print(newDoc))
      });

      return newDoc;
    }

    var fraql = function fraql() {
      gql.disableFragmentWarnings();

      var doc = gql__default.apply(undefined, arguments);

      if (doc.definitions.every(function (_ref) {
        var kind = _ref.kind;
        return kind === 'FragmentDefinition';
      })) {
        return toInlineFragment(doc);
      }

      return doc;
    };

    exports.default = fraql;
    exports.toInlineFragment = toInlineFragment;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=fraql.js.map
