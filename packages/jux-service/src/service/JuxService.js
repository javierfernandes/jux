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
    this.clients.push(new JuxClient(uuid(), channel, this))
  }
  addReporter(channel) {
    const reporter = new JuxReporter(uuid(), channel, this)
    this.reporters.push(reporter)
    this.clients.forEach(c => c.reporterAdded(reporter))

    reporter.onDisconnected(() => {
      // we must remove the reporter / client from our registry
      // for reporters we must broadcast a message so that clients remove them
    })
  }

  getReporters() { return this.reporters }
  getReporter(id) { return this.reporters.find(propEq('id', id)) }

  /** to be used by reporters */

  withClients(fn) {
    this.clients.forEach(c => fn(c))
  }

  sendToReporter(reporterId, message) {
    this.getReporter(reporterId).send(message)
  }

}

module.exports = JuxService