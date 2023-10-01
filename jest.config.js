/** @type {import('jest').Config} */
const config = {
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/lib/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testEnvironment: "jsdom",
};

module.exports = config;
