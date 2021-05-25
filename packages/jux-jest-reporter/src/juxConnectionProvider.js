const JuxReporterConnection = require('./api/JuxReporterConnection')

/**
 * We instantiate and connect just once.
 * JuxJestReporter might be instantiated several times but we will keep the
 * same connection for the whole jest lifecycle
 * TODO: I need to confirm that it instantiate the reporter > 1 time
 */
let connection

/**
 *
 */
const juxConnectionProvider = channel => context => {
  if (!connection) {
    connection = new JuxReporterConnection(channel, context)
    connection.connect()
    return connection
  }
  return connection
}

module.exports = juxConnectionProvider