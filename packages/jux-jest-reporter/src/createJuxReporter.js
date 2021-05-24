const JuxReporterConnection = require('./JuxReporterConnection')

/**
 *
 */
const createJuxReporter = channel => context => {
  const reporter = new JuxReporterConnection(channel, context)
  reporter.connect()
  return reporter
}

module.exports = createJuxReporter