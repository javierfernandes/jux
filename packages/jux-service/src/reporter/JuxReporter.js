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


  async onMessage(message) {
    switch (message.type) {
      // identify gets treated here so that it register the data into this reporter
      // for further connections from clients
      case ReporterMessageType.fromReporter.IDENTIFY_REPORTER: this.context = message.context;
      default:
        // currently we broadcast every message to clients
        this.service.withClients(c => {
          c.reporterMessage(this.id, message)
        })
        // console.error(`<<< [reporter-${this.id}] UNKNOWN message`, parsed)
    }
  }

}

module.exports = JuxReporter