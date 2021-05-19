const { propOr, pipe, map, applySpec, prop, pick, filter, propEq, drop, take, dropLast } = require('ramda')
const WebSocket = require('ws')
const Protocol = require('./Protocol')
const RequestHandler = require('./RequestHandler')

const JUX_SERVICE_PORT = 5326
const JUX_PROTOCOL = 'JUX_REPORTER'

let server

const createServerIfNeeded = context => {
  if (server) return

  console.log('Firing up JUX server')
  const wss = new WebSocket.Server({
    // TODO: take this from config !
    port: 8888,
  })
  wss.on('connection', ws => {
    console.log('<<< Connected to browser/client !')

    const reply = (id, value) => {
      ws.send(JSON.stringify({
        type: Protocol.Type.RESPONSE, id, value
      }))
    }

    ws.on('message', async messageString => {
      const message = JSON.parse(messageString)
      const { type, id } = message
      const handler = RequestHandler[type]
      if (handler) {
        try {
          const value = await handler(message, context)
          reply(id, value)
        } catch(err) {

        }
      }
    })

  })

  server = {
    send: msg => {
      console.log('sending message to', wss.clients.size, 'clients')
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg))
        }
      })
    }
  }
}

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
      type: 'identifyReporter',
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
    const handler = RequestHandler[type]
    if (handler) {
      try {
        const value = await handler(message, context)
        reply(id, value)
      } catch(err) {
        // TODO: handle here
      }
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