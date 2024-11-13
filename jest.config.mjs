export default {
    preset: 'ts-jest',            // Use ts-jest preset for TypeScript
    testEnvironment: 'node',      // Set the test environment to Node.js
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',  // Transform TypeScript files using ts-jest
    },
    moduleFileExtensions: ['js', 'ts', 'tsx'],  // Ensure Jest supports these extensions
  };
  