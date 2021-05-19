
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
      type: 'acceptReporters',
      reporters: this.service.getReporters().map(r => ({
        id: r.id,
        context: r.context
      }))
    })
  }

  // API

  reporterAdded(reporter) {
    this.send({
      type: 'reporterAdded',
      reporter: reporter.id
    })
  }
  // TODO: reporterRemoved

  reporterMessage(data, reporter) {
    const msg = {
      type: 'reporterMessage',
      reporter: reporter.id,
      data,
    }
    console.log('BROADCASTING reporter message', msg)
    this.send(msg)
  }
}

module.exports = JuxClient