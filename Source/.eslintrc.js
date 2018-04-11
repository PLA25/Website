module.exports = {
  "extends": "airbnb-base",
  "rules": {
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
