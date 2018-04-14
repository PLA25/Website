module.exports = {
  "env": {
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
    "object-property-newline": ["error", {
      "allowAllPropertiesOnSameLine": false
    }],
    "spaced-comment": ["error", "always", {
      "block": {
        "balanced": true
      }
    }]
  }
};
