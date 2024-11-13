// jest.config.js
module.exports = {
  testEnvironment: 'node', // or 'jsdom' for frontend code
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // If using TypeScript
  },
};
