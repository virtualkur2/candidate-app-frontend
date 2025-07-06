const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src/'],
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: '<rootDir>/'
    })
  };