'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var gql = _interopDefault(require('graphql-tag'));
var graphql = require('graphql');
var graphqlTools = require('graphql-tools');

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

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

var _templateObject = taggedTemplateLiteralLoose(['\n    query {\n      ', ' {\n        ', '\n      }\n    }\n  '], ['\n    query {\n      ', ' {\n        ', '\n      }\n    }\n  ']);

function generateSchemaFromIntrospectionResult(introspectionResult) {
  var introspectionData = introspectionResult.data || introspectionResult;
  var originalSchema = graphql.buildClientSchema(introspectionData);

  var typeMap = originalSchema.getTypeMap();
  var fields = Object.keys(typeMap).reduce(function (fields, typeName) {
    var _extend;

    var type = typeMap[typeName];
    if (typeName.startsWith('__') || typeName === 'Query' || !(type instanceof graphql.GraphQLObjectType) && !(type instanceof graphql.GraphQLInterfaceType)) {
      return fields;
    }
    return immutable(fields, (_extend = {}, _extend['fraql__' + typeName] = {
      type: typeMap[typeName]
    }, _extend));
  }, {});

  var fraqlSchema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({ name: 'Query', fields: fields })
  });

  return graphqlTools.mergeSchemas({ schemas: [originalSchema, fraqlSchema] });
}

function _mockSchema(schema) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      mocks = _ref.mocks;

  // Clone schema
  var clonedSchema = graphqlTools.transformSchema(schema, []);
  graphqlTools.addMockFunctionsToSchema({ schema: clonedSchema, mocks: mocks });
  return clonedSchema;
}

function executeFragment(schema, fragmentDocument) {
  if (!fragmentDocument.originalDocument) {
    throw new Error('fraql: generateDataFromFragment supports only fraql fragments');
  }
  var typeName = fragmentDocument.definitions[0].typeCondition.name.value;
  var fieldName = 'fraql__' + typeName;
  var query = gql(_templateObject, fieldName, fragmentDocument);

  var res = graphql.execute(schema, query);

  if (res.errors && res.errors.length) {
    throw res.errors[0];
  }

  if (res.data[fieldName] === undefined) {
    throw new Error('fraql: type "' + typeName + '" not found');
  }
  return res.data[fieldName];
}

var Mocker = function () {
  function Mocker(schema) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        mocks = _ref2.mocks;

    classCallCheck(this, Mocker);

    this.schema = schema;
    this.mocks = mocks;
  }

  Mocker.prototype.mockSchema = function mockSchema() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        mocks = _ref3.mocks;

    var mergedMocks = immutable(this.mocks, mocks);
    return _mockSchema(this.schema, { mocks: mergedMocks });
  };

  Mocker.prototype.mockFragment = function mockFragment(fragmentDocument, options) {
    var schema = this.mockSchema(options);
    return executeFragment(schema, fragmentDocument);
  };

  Mocker.prototype.mockFragments = function mockFragments(fragmentDocuments, options) {
    var schema = this.mockSchema(options);
    return Object.keys(fragmentDocuments).reduce(function (data, key) {
      var _extend2;

      var fragmentDocument = fragmentDocuments[key];
      return immutable(data, (_extend2 = {}, _extend2[key] = executeFragment(schema, fragmentDocument), _extend2));
    }, {});
  };

  return Mocker;
}();

function createMockerFromSchema(schema, options) {
  return new Mocker(schema, options);
}

function createMockerFromIntrospection(introspectionResult, options) {
  var schema = generateSchemaFromIntrospectionResult(introspectionResult);
  return createMockerFromSchema(schema, options);
}

exports.generateSchemaFromIntrospectionResult = generateSchemaFromIntrospectionResult;
exports.Mocker = Mocker;
exports.createMockerFromSchema = createMockerFromSchema;
exports.createMockerFromIntrospection = createMockerFromIntrospection;
//# sourceMappingURL=fraql.mock.cjs.js.map
