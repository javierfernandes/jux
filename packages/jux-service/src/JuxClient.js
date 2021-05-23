
const ClientTypes = {

  toClient: {

    /**
     * Pushes a list of reporters to the client
     */
    ACCEPT_REPORTERS: 'acceptReporters',

    /**
     * Notify that a new reporter has been registered
     */
    REPORTER_ADDED: 'reporterAdded',

    /**
     * Forwards a message from a reporter to a client
     */
    REPORTER_MESSAGE: 'reporterMessage',

  },

  fromClient: {

    /**
     * A client ask to send a message to a given reporter.
     */
    MESSAGE_TO_REPORTER: 'messageToReporter',

  }

}

/**
 *
 */
class JuxClient {

  constructor(id, ws, service) {
    this.id = id
    this.ws = ws
    this.service = service
    ws.on('message', m => this.onMessage(m))

    this.sendReporters()
  }
  async onMessage(messageString) {
    const message = JSON.parse(messageString)
    const { type } = message
    switch (type) {
      case ClientTypes.fromClient.MESSAGE_TO_REPORTER: {
        this.service.sendToReporter(message.reporterId, message.message)
        break
      }
      default: {
        console.error(`<<< [client-${this.id}] - UNKNOWN MESSAGE:`, message)
      }
    }
  }

  send(msg) {
    this.ws.send(JSON.stringify(msg))
  }

  sendReporters() {
    this.send({
      type: ClientTypes.toClient.ACCEPT_REPORTERS,
      reporters: this.service.getReporters().map(r => ({
        id: r.id,
        context: r.context
      }))
    })
  }

  // API

  reporterAdded(reporter) {
    this.send({
      type: ClientTypes.toClient.REPORTER_ADDED,
      reporter: reporter.id
    })
  }
  // TODO: reporterRemoved

  reporterMessage(message, reporter) {
    this.send({
      type: ClientTypes.toClient.REPORTER_MESSAGE,
      reporter: reporter.id,
      message,
    })
  }
}

module.exports = JuxClient