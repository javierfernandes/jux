const { propOr, pipe, map, applySpec, prop, pick, filter, propEq, drop, take, dropLast } = require('ramda')
const WebSocket = require('ws')
const Protocol = require('./Protocol')
const RequestHandler = require('./RequestHandler')

const JUX_SERVICE_PORT = 5326
const JUX_PROTOCOL = 'JUX_REPORTER'

const ReporterTypes = {

  toReporter: {

  },

  fromReporter: {

    IDENTIFY_REPORTER: 'identifyReporter'

  }

}

let server

const connectToServiceIfNeeded = context => {
  if (server) return

  server = {
    send: () => {} // noop while offline
  }

  console.log('Connecting to JUX service...')
  const ws = new WebSocket(`ws://localhost:${JUX_SERVICE_PORT}/`, [JUX_PROTOCOL])
  ws.on('open', () => {
    console.log('Connected to JUX service !')
    server.send = msg => {
      ws.send(JSON.stringify(msg))
    }

    // send our initial info
    server.send({
      type: ReporterTypes.fromReporter.IDENTIFY_REPORTER,
      context
    })
  })

  const reply = (id, value) => {
    ws.send(JSON.stringify({
      type: Protocol.Type.RESPONSE,
      id,
      value
    }))
  }

  ws.on('message', async messageString => {
    const message = JSON.parse(messageString)
    const { type, id } = message
    // console.log('RECEIVED', messageString)
    const handler = RequestHandler[type]
    if (handler) {
      try {
        const value = await handler(message, context)
        reply(id, value)
      } catch(err) {
        // TODO: handle here
      }
    } else {
      console.error(`No handler for message type ${type}`, message)
    }
  })


}

/**
 * A jest test runner that accepts incoming WS connections (from the JUX UI)
 * and forwards every Jest event to all clients.
 */
class JUXReporter {

  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options

    console.log('Instantiated JUXReporter')
    connectToServiceIfNeeded({
      globalConfig,
      options
    })
  }

  send(msg) {
    server.send(msg)
  }

  onRunStart(aggregatedResults, options) {
    this.send({
      type: 'onRunStart',
      aggregatedResults
    })
  }

  onRunComplete(contexts, results) {
    this.send({
      type: 'onRunComplete',
      results
    })
  }

  onTestStart(test) {
    this.send({
      type: 'onTestStart',
      test
    })
  }
  onTestResult(test, testResult, aggregatedResult) {
    this.send({
      type: 'onTestResult',
      test,
      result,
      aggregatedResult
    })
  }
  onTestFileStart(test) {
    this.send({
      type: 'onTestFileStart',
      test
    })
  }
  onTestFileResult(test, result, aggregatedResult) {
    this.send({
      type: 'onTestFileResult',
      test,
      result,
      aggregatedResult
    })
  }

  onTestCaseResult(test, result) {
    this.send({
      type: 'onTestCaseResult',
      test,
      result,
    })
  }

}

module.exports = JUXReporter