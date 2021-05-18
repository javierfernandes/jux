const { v4: uuid } = require('uuid')
const JuxClient = require('./JuxClient')
const JuxReporter = require('./JuxReporter')

/**
 *
 */
class JuxService {
  constructor() {
    this.clients = []
    this.reporters = []
  }

  addClient(ws) {
    this.clients.push(new JuxClient(uuid(), ws, this))
  }
  addReporter(ws) {
    this.reporters.push(new JuxReporter(uuid(), ws, this))
  }

  getReporters() { return this.reporters }

  sendToClients(data, reporter) {
    this.clients.forEach(c => c.send(JSON.stringify({
      type: 'REPORTER_MESSAGE',
      reporter: reporter.id,
      data: data
    })))
  }

}

module.exports = JuxService