import resolve from '@rollup/plugin-node-resolve'; // resolves node modules
import commonjs from '@rollup/plugin-commonjs'; // converts CommonJS to ES modules
import typescript from '@rollup/plugin-typescript'; // processes TypeScript files

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'es', // or 'cjs', 'iife', etc.
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(), // Add the TypeScript plugin here
  ],
};
