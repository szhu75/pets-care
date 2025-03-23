module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    setupFiles: ['<rootDir>/.env'],
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
  };