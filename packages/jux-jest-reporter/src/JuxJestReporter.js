
/**
 * Class factory for the JustJexReporter.
 *
 */
module.exports = juxReporterProvider => {

  /**
   * A jest test runner that accepts incoming WS connections (from the JUX UI)
   * and forwards every Jest event to all clients.
   */
  return class JUXJestReporter {

    constructor(globalConfig, options) {

      this.justReporter = juxReporterProvider({
        globalConfig,
        options
      });

      // create delegating methods
      [

        ['onRunStart', ['aggregatedResults']],
        ['onRunComplete', [IGNORE, 'results']],
        ['onTestStart', ['test']],
        ['onTestResult', ['test', 'result', 'aggregatedResult']],
        ['onTestFileStart', ['test']],
        ['onTestFileResult', ['test', 'result', 'aggregatedResult']],
        ['onTestCaseResult', ['test', 'result']],

      ].forEach(([name, paramNames]) => {
        this[name] = (...args) => {
          this.justReporter.send({
            type: name,
            ...argsToParams(args, paramNames)
          })
        }
      })
    }

  }

}

//
// forwarding utils
//

const IGNORE = '__IGNORE__'

/**
 * Given a list of argument values and a list of param names creates an object
 * Naming the args and using the arg values.
 * Ignores those params having IGNORE name
 */
const argsToParams = (args, paramNames) => paramNames.reduce((acc, paramName, i) => {
  if (paramName !== IGNORE) {
    acc[paramName] = args[i]
  }
  return acc
}, {})