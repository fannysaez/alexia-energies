const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Fournit le chemin vers votre app Next.js pour charger next.config.js et .env files
  dir: './',
})

// Configuration Jest personnalisée
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Gérer les alias de module dans votre app Next.js
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.js',
    '!src/app/globals.css',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
  ],
}

// createJestConfig est exporté de cette manière pour s'assurer que next/jest peut charger la config Next.js qui est async
module.exports = createJestConfig(customJestConfig)