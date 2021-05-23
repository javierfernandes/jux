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
    const reporter = new JuxReporter(uuid(), ws, this)
    this.reporters.push(reporter)
    this.clients.forEach(c => c.reporterAdded(reporter))
  }

  getReporters() { return this.reporters }
  getReporter(id) {
    return this.reporters.find(r => r.id === id)
  }

  /** to be used by reporters */

  withClients(fn) {
    this.clients.forEach(c => fn(c))
  }

  sendToReporter(reporterId, message) {
    this.getReporter(reporterId).send(message)
  }

}

module.exports = JuxService