export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/Tests'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/Interface/Components/$1',
    '^@styles/(.*)$': '<rootDir>/src/Styles/$1',
    '^@types/(.*)$': '<rootDir>/src/Types/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/Tests/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/Tests/setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',  // Changed from 'react' to 'react-jsx'
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/Main/**',
    '!src/Preload/**',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}