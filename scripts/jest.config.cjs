const path = require('node:path');
const frontendModules = path.resolve(__dirname, '../frontend/node_modules');
module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  testMatch: ['<rootDir>/scripts/frontend-smoke.test.js'],
  testEnvironment: require.resolve('../frontend/node_modules/jest-environment-jsdom'),
  setupFiles: ['<rootDir>/scripts/test-dom.cjs'],
  moduleDirectories: ['node_modules', frontendModules],
  transform: {'^.+\\.[jt]sx?$': [require.resolve('../frontend/node_modules/babel-jest'), {
    presets: [require.resolve('../frontend/node_modules/babel-preset-react-app')], babelrc:false, configFile:false,
  }]},
  moduleNameMapper: {
    '^\\.\\./frontend/src/(.*)$': process.env.BASELINE_FRONTEND
      ? path.resolve(process.env.BASELINE_FRONTEND, 'src/$1')
      : '<rootDir>/frontend/src/$1',
    '\\.(css|woff2?|ttf|eot|svg)$':'<rootDir>/scripts/style-stub.cjs',
  },
};
