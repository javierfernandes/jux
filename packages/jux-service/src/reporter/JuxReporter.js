const ReporterMessageType = require('./ReporterMessageType')
const JuxApp = require('../service/JuxApp')

/**
 * A test reporter program that connects to JUX service to broadcast test execution
 * events.
 *
 * @see "ReporterMessageType" to understand its WS protocol
 */
class JuxReporter extends JuxApp {

  constructor(id, channel, service) {
    super(id, channel, service)
    this.context = null
  }

  // if we need reporters to send messages to the service we will need work here
  // currently it broadcasts all messages to all clients.
  async onMessage(message) {
    switch (message.type) {
      // identify gets treated here so that it register the data into this reporter
      // for further connections from clients
      case ReporterMessageType.fromReporter.IDENTIFY_REPORTER: this.context = message.context;
      default:
        // TODO explicitly handle each type that needs to be broadcasting as case's
        // leave default for error / unknown
        this.service.withClients(c => {
          c.reporterMessage(message, this)
        })
        // console.error(`<<< [reporter-${this.id}] UNKNOWN message`, parsed)
    }
  }

}

module.exports = JuxReporter