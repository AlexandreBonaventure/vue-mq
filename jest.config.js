module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/tests/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  setupFiles: ['<rootDir>/tests/unit/setup'],
  transformIgnorePatterns: ['/node_modules/(?!lodash-es|flatpickr)'], // <-- this allows babel to load only the node modules I need (which is lodash-es) and ignore the rest
  testMatch: [
    '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))',
  ],
  verbose: true,
}
