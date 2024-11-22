module.exports = {
    preset: "ts-jest",
    transform: {
      "^.+\\.(ts|tsx)?$": "ts-jest",
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleNameMapper: {
      "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.json"
    },
    testEnvironment: "jsdom"
};