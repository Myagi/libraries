'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var gql = _interopDefault(require('graphql-tag'));
var graphql = require('graphql');

var taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

var _templateObject = taggedTemplateLiteralLoose(['\n      ', '\n    '], ['\n      ', '\n    ']);

function introspectSchema(schema) {
  var data = graphql.execute(schema, gql(_templateObject, graphql.introspectionQuery));
  return data;
}

exports.introspectSchema = introspectSchema;
//# sourceMappingURL=fraql.server.cjs.js.map
