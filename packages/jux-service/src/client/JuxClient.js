const ClientMessageType = require('./ClientMessageType')
const JuxApp = require('../service/JuxApp')

/**
 * A client app that connects to JUX service to monitor test executions.
 */
class JuxClient extends JuxApp {

  constructor(id, channel, service) {
    super(id, channel, service)
    this.sendReporters()
  }

  async onMessage(message) {
    const { type } = message
    switch (type) {
      case ClientMessageType.fromClient.MESSAGE_TO_REPORTER: {
        this.service.sendToReporter(message.reporterId, message.message)
        break
      }
      default: {
        console.error(`<<< [client-${this.id}] - UNKNOWN MESSAGE:`, message)
      }
    }
  }

  sendReporters() {
    this.send({
      type: ClientMessageType.toClient.ACCEPT_REPORTERS,
      reporters: this.service.getReporters().map(r => ({
        id: r.id,
        context: r.context
      }))
    })
  }

  // API

  reporterAdded(reporter) {
    this.send({
      type: ClientMessageType.toClient.REPORTER_ADDED,
      reporter: reporter.id
    })
  }
  // TODO: reporterRemoved

  reporterMessage(message, reporter) {
    this.send({
      type: ClientMessageType.toClient.REPORTER_MESSAGE,
      reporter: reporter.id,
      message,
    })
  }
}

module.exports = JuxClient