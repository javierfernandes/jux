
const ReporterTypes = {

  toReporter: {

  },

  fromReporter: {

    /**
     * The reporter identifies itself sending context information like configuration and stuff.
     */
    IDENTIFY_REPORTER: 'identifyReporter'

  }

}

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

    switch (parsed.type) {
      // identify gets treated here so that it register the data into this reporter
      // for further connections from clients
      case ReporterTypes.fromReporter.IDENTIFY_REPORTER: this.context = parsed.context;
      default:
        // TODO explicitly handle each type that needs to be broadcasting as case's
        // leave default for error / unknown
        this.service.withClients(c => {
          c.reporterMessage(parsed, this)
        })
        // console.error(`<<< [reporter-${this.id}] UNKNOWN message`, parsed)
    }
  }

  send(message) {
    // console.log(`>>> [reporter-${this.id}] sending`, message)
    this.ws.send(JSON.stringify(message))
  }

}

module.exports = JuxReporter