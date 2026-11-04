import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Sources import siblings with an explicit `.js` extension (required by native ES modules);
  // map them back to the `.ts` files under test.
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  // The hybrid module kind (node16) only warns about isolatedModules; type-checking stays on.
  transform: { '^.+\\.ts$': ['ts-jest', { diagnostics: { ignoreCodes: [151002] } }] },
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;
