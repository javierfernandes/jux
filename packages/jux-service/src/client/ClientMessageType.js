
/**
 * Specifies the WS message's "type" for cliet related messages
 * This is like an API doc for a JUX client with in/out messages.
 */
const ClientMessageType = {

  /**
   * For messages sent to clients
   */
  toClient: {

    /**
     * Pushes a list of reporters to the client
     */
    ACCEPT_REPORTERS: 'acceptReporters',

    /**
     * Notify that a new reporter has been registered
     */
    REPORTER_ADDED: 'reporterAdded',

    /**
     * Forwards a message from a reporter to a client
     */
    REPORTER_MESSAGE: 'reporterMessage',

  },

  /**
   * For incoming messages from clients
   */
  fromClient: {

    /**
     * A client ask to send a message to a given reporter.
     */
    MESSAGE_TO_REPORTER: 'messageToReporter',

  }

}

module.exports = ClientMessageType