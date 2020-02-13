module.exports = {
  rootDir: "../",
  testMatch: ["<rootDir>/src/**/*.test.js"],
  moduleDirectories: [
    "<rootDir>/node_modules",
    "./node_modules",
    "<rootDir>/jest"
  ],
  setupFiles: ["<rootDir>/jest/setup.js"],
  setupFilesAfterEnv: ["<rootDir>/jest/setupForEach.js"],
  transformIgnorePatterns: ["node_modules"],
  verbose: true,
  coverageDirectory: "<rootDir>/coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/jest/"],
  coverageThreshold: {
    global: {
      branches: 100.0,
      functions: 100.0
    }
  },
  globals: {}
};
