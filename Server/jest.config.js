module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "routes/**/*.js",
    "middlewares/**/*.js",
    "utils/**/*.js",
  ],
  coverageDirectory: "coverage",
  clearMocks: true,
};