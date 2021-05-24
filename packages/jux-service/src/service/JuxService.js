const { v4: uuid } = require('uuid')
const { propEq } = require('ramda')

const JuxClient = require('../client/JuxClient')
const JuxReporter = require('../reporter/JuxReporter')

/**
 * Main abstraction for the service.
 * Holds state of the connected apps (both clients and reporters).
 * Acts as a registry for those and provide shortcut methods so that
 * they talk each other.
 */
class JuxService {

  constructor() {
    this.clients = []
    this.reporters = []
  }

  addClient(channel) {
    const client = new JuxClient(uuid(), channel, this)
    this.clients.push(client)
    client.onDisconnected(() => {
      this.clients.reject(propEq('id', client.id))
    })
    return client
  }
  addReporter(channel) {
    const reporter = new JuxReporter(uuid(), channel, this)
    this.reporters.push(reporter)
    this.clients.forEach(c => c.reporterAdded(reporter))

    reporter.onDisconnected(() => {
      // TODO: we must broadcast a message so that clients remove it
      this.reporters.reject(propEq('id', reporter.id))
    })
    return reporter
  }

  getReporters() { return this.reporters }
  getClients() { return this.clients }
  getReporter(id) { return this.reporters.find(propEq('id', id)) }

  /** to be used by reporters */

  withClients(fn) { this.clients.forEach(fn) }

  sendToReporter(reporterId, message) {
    this.getReporter(reporterId).send(message)
  }

}

module.exports = JuxService