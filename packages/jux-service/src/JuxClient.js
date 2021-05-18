
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
    this.ws.send(msg)
  }

  sendReporters() {
    this.send(JSON.stringify({
      type: 'acceptReporters',
      reporters: this.service.getReporters().map(r => r.id)
    }))
  }

}

module.exports = JuxClient