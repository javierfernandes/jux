
const ClientTypes = {
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
  async onMessage(messageString){
    const message = JSON.parse(messageString)
    const { type } = message
    // TODO: accept here
  }

  send(msg) {
    this.ws.send(JSON.stringify(msg))
  }

  sendReporters() {
    this.send({
      type: ClientTypes.ACCEPT_REPORTERS,
      reporters: this.service.getReporters().map(r => ({
        id: r.id,
        context: r.context
      }))
    })
  }

  // API

  reporterAdded(reporter) {
    this.send({
      type: ClientTypes.REPORTER_ADDED,
      reporter: reporter.id
    })
  }
  // TODO: reporterRemoved

  reporterMessage(message, reporter) {
    const msg = {
      type: ClientTypes.REPORTER_MESSAGE,
      reporter: reporter.id,
      message,
    }
    console.log('BROADCASTING reporter message', msg)
    this.send(msg)
  }
}

module.exports = JuxClient