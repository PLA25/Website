module.exports = {
  "env": {
    "browser": true,
    "jquery": true,
    "mocha": true,
    "node": true,
  },
  "extends": "airbnb-base",
  "rules": {
    "multiline-comment-style": ["error", "starred-block"],
    "no-console": ["error", {
      "allow": ["error", "warn"]
    }],
    "no-multiple-empty-lines": ["error", {
      "max": 1,
      "maxBOF": 0,
      "maxEOF": 1
    }],
    "no-use-before-define": ["error", {
      "functions": false
    }],
    "object-property-newline": ["error", {
      "allowAllPropertiesOnSameLine": false
    }],
    "require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": true,
        "FunctionExpression": true
      }
    }],
    "spaced-comment": ["error", "always", {
      "block": {
        "balanced": true
      }
    }],
    "valid-jsdoc": ["error", {
      "prefer": {
        "arg": "param",
        "argument": "param",
        "class": "class",
        "return": "returns",
        "virtual": "abstract"
      },
      "preferType": {
        "boolean": "Boolean",
        "number": "Number",
        "object": "Object",
        "string": "String"
      },
      "matchDescription": ".+",
      "requireParamDescription": true,
      "requireReturn": true,
      "requireReturnDescription": true,
      "requireReturnType": true,
    }]
  }
};
