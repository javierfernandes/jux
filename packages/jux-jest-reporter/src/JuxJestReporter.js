
/**
 * A global connection to jux.
 * We keep the same connection between different instantiations of the Jest reporter.
 * I don't like having this global variable here but well...
 */
let justReporter


module.exports = juxReporterCreator => {

  /**
   * A jest test runner that accepts incoming WS connections (from the JUX UI)
   * and forwards every Jest event to all clients.
   */
  return class JUXJestReporter {

    constructor(globalConfig, options) {
      this._globalConfig = globalConfig
      this._options = options

      console.log('Instantiated JUXReporter')
      if (!justReporter) {
        justReporter = juxReporterCreator({
          globalConfig,
          options
        })
      }
    }

    send(msg) {
      justReporter.send(msg)
    }

    onRunStart(aggregatedResults, options) {
      this.send({
        type: 'onRunStart',
        aggregatedResults
      })
    }

    onRunComplete(contexts, results) {
      this.send({
        type: 'onRunComplete',
        results
      })
    }

    onTestStart(test) {
      this.send({
        type: 'onTestStart',
        test
      })
    }
    onTestResult(test, result, aggregatedResult) {
      this.send({
        type: 'onTestResult',
        test,
        result,
        aggregatedResult
      })
    }
    onTestFileStart(test) {
      this.send({
        type: 'onTestFileStart',
        test
      })
    }
    onTestFileResult(test, result, aggregatedResult) {
      this.send({
        type: 'onTestFileResult',
        test,
        result,
        aggregatedResult
      })
    }

    onTestCaseResult(test, result) {
      this.send({
        type: 'onTestCaseResult',
        test,
        result,
      })
    }

  }
}