
/**
 * Possible message types  for incoming messages from a Reporter.
 * #API
 */
const ReporterMessageType = {

  identifyReporter: 'identifyReporter',

  // test execution events (straight from jest)
  onRunStart: 'onRunStart',
  onRunComplete: 'onRunComplete',
  onTestFileStart: 'onTestFileStart',
  onTestFileResult: 'onTestFileResult',

}

export default ReporterMessageType