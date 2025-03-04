// jest.config.cjs
module.exports = {
  transform: {
    "^.+\\.svelte$": "svelte-jester", // or 'jest-transform-svelte' if preferred
    "^.+\\.js$": "babel-jest",
  },
  // Update transformIgnorePatterns to also transform svelte packages
  transformIgnorePatterns: ["node_modules/(?!(@testing-library|svelte)/)"],
  moduleFileExtensions: ["js", "svelte"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testPathIgnorePatterns: ["node_modules"],
  extensionsToTreatAsEsm: [".svelte"],
};
