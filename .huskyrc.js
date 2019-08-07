const tasks = (arr) => arr.join(" && ");

module.exports = {
  hooks: {
    "pre-commit": tasks(["yarn type-check", "lint-staged"]),
  },
};
