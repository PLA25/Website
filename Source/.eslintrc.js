module.exports = {
  "env": {
    "jquery": true,
    "mocha": true,
    "node": true,
  },
  "extends": "airbnb-base",
  "rules": {
    "no-console": ["error", {
      "allow": ["error", "warn"]
    }],
    "no-multiple-empty-lines": ["error", {
      "max": 1,
      "maxBOF": 0,
      "maxEOF": 1
    }],
    "multiline-comment-style": ["error", "starred-block"],
    "spaced-comment": ["error", "always", {
      "block": {
        "balanced": true
      }
    }]
  }
};
