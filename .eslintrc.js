module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: [
    // 'airbnb'
    "airbnb-base"
    // "plugin:vue-libs/recommended"
    // 'airbnb',
    // "vue"
  ],
  // required to lint *.vue files
  plugins: [
    "html"
    // "flowtype-errors"
  ],
  // check if imports actually resolve
  // "settings": {
  //   "import/resolver": {
  //     "webpack": {
  //       "config": "build/webpack.base.conf.js"
  //     }
  //   }
  // },
  // add your custom rules here
  "rules": {
    // "flowtype-errors/show-errors": 2,
    // don't require .vue extension when importing
    // 'import/extensions': ['error', 'always', {
    //     'js': 'never',
    //     'vue': 'never'
    // }],
    // allow optionalDependencies
    // "import/no-extraneous-dependencies": [
    //   "error",
    //   {
    //     "optionalDependencies": ["test/unit/index.js"]
    //   }
    // ],
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "no-console": process.env.NODE_ENV === "production" ? 2 : 0,
    // "space-before-function-paren": 0,
    // Remove later
    "comma-dangle": 0,
    // "semi": 0,
    // "object-curly-spacing": 0,
    // "no-unused-expressions": 0,
    // "dot-notation": 0,
    // "object-shorthand": 0,
    "object-curly-newline": 0,
    // "prefer-const": 0,
    // "no-case-declarations": 0,
    // "array-bracket-spacing": 1,
    // "import/first": 0,
    // "import/newline-after-import": 0,
    // "import/no-unresolved": 0,
    // "import/extensions": ["warn", "always", { "js": "never" }],
    // "no-underscore-dangle": 0,
    // "arrow-parens": 0
    "function-paren-newline": 0
  }
}
