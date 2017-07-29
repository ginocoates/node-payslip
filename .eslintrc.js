module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [
      "mocha"
    ],
    "globals": {
      "sinon": true,
      "chai": true,
      "expect": true
    },
    "rules": {
        "strict" : [
          "error",
          "global"
        ],
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "mocha/no-exclusive-tests":"error"
    }
};
