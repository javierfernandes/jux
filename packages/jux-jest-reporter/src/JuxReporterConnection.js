const ReporterMessageType = require('./ReporterMessageType')
const RequestHandler = require('./RequestHandler')

/**
 * Kind of an SDK class to connect to "jux-service" acting as a reporter.
 * Provides a simple JS API to abstract from the communication and connection, etc.
 */
class JuxReporterConnection {

  constructor(channel, context) {
    this.channel = channel
    this.context = context

    this.channel.onConnected(() => {
      // send our initial info
      this.send({
        type: ReporterMessageType.fromReporter.IDENTIFY_REPORTER,
        context
      })
    })

    this.channel.onMessage(async message => {
      const { type, id } = message
      // console.log('RECEIVED', messageString)
      const handler = RequestHandler[type]
      if (handler) {
        try {
          const value = await handler(message, context)
          this.reply(id, value)
        } catch(err) {
          // TODO: handle here
        }
      } else {
        console.error(`No handler for message type ${type}`, message)
      }
    })
  }

  connect() {
    this.channel.connect()
  }

  send(msg) {
    // TODO: if not yet connected then I think that we should buffer
    //   and send it all once connected. That will make the UI get
    //   the initial run
    this.channel.send(msg)
  }

  reply(id, value) {
    this.channel.send({
      type: ReporterMessageType.fromReporter.RESPONSE,
      id,
      value
    })
  }

}

module.exports = JuxReporterConnection