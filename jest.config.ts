import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',

  moduleFileExtensions: ['ts', 'js', 'json'],

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  collectCoverageFrom: ['src/**/*.(t|j)s'],

  coverageDirectory: '<rootDir>/coverage',

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '.module.ts$',
    '.dto.ts$',
    '.entity.ts$',
    'main.ts$',
    '.interface.ts$',
    '.enum.ts$',
    'index.ts$',
    'repository.ts$',
    'src/config/',
    'src/migrations/',
    'src/seeds/',
    'src/common/constants',
    'src/common/decorators',
    'src/common/exceptions',
    'src/common/service',
    'src/common/guards/jwt-auth.guard.ts',
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default config
