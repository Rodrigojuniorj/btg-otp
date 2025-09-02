import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  moduleFileExtensions: ['ts', 'js', 'json'],

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.enum.ts',
    '!src/**/*.repository.ts',
    '!src/main.ts',
    '!src/config/database/data-source.ts',
    '!src/migrations/**',
    '!src/seeds/**',
    '!src/common/constants/**',
    '!src/common/decorators/**',
    '!src/common/exceptions/**',
    '!src/common/service/**',
    '!src/common/guards/jwt-auth.guard.ts',
  ],

  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/test/',
    '.module.ts$',
    '.dto.ts$',
    '.entity.ts$',
    'main.ts$',
    '.interface.ts$',
    '.enum.ts$',
    'index.ts$',
    '.repository.ts$',
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

  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  testTimeout: 10000,

  // Configurações para testes de integração
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/test/e2e/'],

  // Configurações para melhor performance
  maxWorkers: '50%',
  maxConcurrency: 1,
}

export default config
