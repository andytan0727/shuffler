module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "react-hooks", "@typescript-eslint", "prettier"],
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
  },
  rules: {
    "prettier/prettier": "error",

    // typescript
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/camelcase": ["error", { properties: "never" }],
    "@typescript-eslint/no-explicit-any": "off",

    // hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // common
    "no-console": "off",
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
};
