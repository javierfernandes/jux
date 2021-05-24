
const WSProtocols = {

  /**
   * A client app, like a UI (jux-ui) that receives events and information
   * about reporters/runners and shows it and provices user interaction
   */
  CLIENT: 'JUX_CLIENT',

  /**
   * A test runner/reporter that generates test execution events
   */
  REPORTER: 'JUX_REPORTER',

}

module.exports = WSProtocols