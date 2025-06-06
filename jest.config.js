const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in test environment
  dir: './',
});

// Custom Jest configuration
const customJestConfig = {
  // Use jsdom test environment to simulate browser APIs
  testEnvironment: 'jsdom',

  // Setup files to run after Jest environment is set up
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module path alias mapping (adjust to your tsconfig/jsconfig paths)
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/stores/(.*)$': '<rootDir>/src/stores/$1',

    // Handle CSS imports (mock them)
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',

    // Handle static assets (images, etc.)
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Ignore node_modules except for specific packages if needed
  transformIgnorePatterns: ['/node_modules/'],

  // Optional: collect coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
