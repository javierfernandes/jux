
/**
 *
 */
class JuxReporter {

  constructor(id, ws, service) {
    this.id = id
    this.ws = ws
    this.service = service

    ws.on('message', m => this.onMessage(m))
  }
  async onMessage(messageString) {
    const parsed = JSON.parse(messageString)
    this.service.sendToClients(parsed, this)
  }
}

module.exports = JuxReporter