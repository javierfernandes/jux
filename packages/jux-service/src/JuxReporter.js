
/**
 *
 */
class JuxReporter {

  constructor(id, ws, service) {
    this.id = id
    this.context = null
    this.ws = ws
    this.service = service

    ws.on('message', m => this.onMessage(m))
  }
  async onMessage(messageString) {
    // if we need reporters to send messages to the service we will need work here
    // currently it broadcasts all messages to all clients.
    const parsed = JSON.parse(messageString)

    console.log(`[reporter-${this.id}]`, parsed)

    this.service.withClients(c => {
      c.reporterMessage(parsed, this)
    })

    // identify gets treated here so that it register the data into this reporter
    // for further connections from clients
    if (parsed.type === 'identifyReporter') {
      this.context = parsed.context
    }
  }
}

module.exports = JuxReporter