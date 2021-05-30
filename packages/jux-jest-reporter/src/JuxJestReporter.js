const createContext = require('./jest/createContext')
const createAdapter = require('./jest/createAdapter')

/**
 * Class factory for the JustJexReporter.
 */
module.exports = juxReporterProvider => {

  /**
   * A jest test runner that accepts incoming WS connections (from the JUX UI)
   * and forwards every Jest event to all clients.
   */
  return class JUXJestReporter {

    constructor(globalConfig, options) {
      this.context = createContext(globalConfig, options)

      this.justReporter = juxReporterProvider(this.context)

      // create delegating methods that "adapt" jest to JUX events
      createAdapter(this.context, this)
    }

  }

}