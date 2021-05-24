/**
 * API doc for the `type` field om message to/from a reporter
 */
const ReporterMessageType = {

  toReporter: {
    /**
     * Receives a request from a client. Must respond with another message
     * with type RESPONSE
     */
    // we never really get this type, the service unwraps it and just sent us the
    // body which also has the type
    // REQUEST: 'request',

    FETCH_SOURCE_CODE: 'fetchSourceCode',

  },

  fromReporter: {

    IDENTIFY_REPORTER: 'identifyReporter',

    /**
     * Send a response to a received REQUEST message
     */
    RESPONSE: 'response',

    ON_RUN_START: 'onRunStart',
  }

}

module.exports = ReporterMessageType