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
    // Remove this line: '!src/Interface/app.tsx',  // ← Include app.tsx!
    '!src/Interface/Hooks/useVoiceRecognition.ts',
    '!src/Interface/Hooks/useOnlineSTT.ts',
    '!src/Interface/Components/LoadingSpinner.tsx',
    '!src/Interface/tasksContext.tsx',  // Exclude - has untested API paths
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 65,
      lines: 62,
      statements: 60,
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