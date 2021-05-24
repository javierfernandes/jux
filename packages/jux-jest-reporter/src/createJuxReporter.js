const RequestHandler = require('./RequestHandler')
const ReporterMessageType = require('./ReporterMessageType')
const Protocol = require('./Protocol')

/**
 *
 */
const createJuxReporter = channel => context => {

  const reporter = {
    send: () => {} // noop while offline
  }

  channel.onConnected(() => {
    reporter.send = msg => {
      channel.send(msg)
    }

    // send our initial info
    reporter.send({
      type: ReporterMessageType.fromReporter.IDENTIFY_REPORTER,
      context
    })
  })

  channel.connect()

  const reply = (id, value) => {
    channel.send({ type: Protocol.Type.RESPONSE, id, value })
  }

  channel.onMessage(async message => {
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

  return reporter
}

module.exports = createJuxReporter