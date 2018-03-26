module.exports = {
  extends: 'airbnb-base',
  rules: {
    'import/extensions': 'off',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'no-multiple-empty-lines': ['error', {
      max: 1,
      maxBOF: 0,
      maxEOF: 1,
    }],
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'no-trailing-spaces': 'error',
  },
};
