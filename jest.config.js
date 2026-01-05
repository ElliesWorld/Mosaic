export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/Interface/Components/$1',
    '^@styles/(.*)$': '<rootDir>/src/Styles/$1',
    '^@types/(.*)$': '<rootDir>/src/Types/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/Tests/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/Tests/setup.ts'],
  testMatch: ['<rootDir>/Tests/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/Interface/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/Interface/main.tsx',
    // Remove this line: '!src/Interface/app.tsx',
    '!src/Interface/Hooks/useVoiceRecognition.ts',
    '!src/Interface/Hooks/useOnlineSTT.ts',
    '!src/Interface/Components/LoadingSpinner.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  globals: {
    'process.env.NODE_ENV': 'test',
  },
}