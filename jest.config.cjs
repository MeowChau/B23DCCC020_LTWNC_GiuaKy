/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/features/books/**/*.{ts,tsx}',
    'src/shared/hooks/useDebounce.ts',
    '!src/**/*.test.*',
  ],
};
