const { coerce } = require('semver')
const { when, isNil, pipe, not, path } = require('ramda')

/**
 * Given jest initial params like globalConfig (jest config params)
 * and options (this reporter particular options defined when specifying the reporter)
 * it creates a "context" object for our own model.
 *
 */
const createContext = (globalConfig, options) => ({
  jest: {
    // we can use this to support different version of jest which have
    // different reporter API and therefore different "test events"
    version: readJestVersion(globalConfig.rootDir),
  },
  globalConfig,
  options
})

module.exports = createContext

//

const whenNotNil = when(pipe(isNil, not))
const readPackageJSON = folder => require(`${folder}/package.json`)
const pathToJestVersion = path(['devDependencies', 'jest'])
const parseVersion = whenNotNil(coerce)
const readJestVersion = pipe(
  readPackageJSON,
  whenNotNil(pipe(pathToJestVersion, parseVersion))
)
