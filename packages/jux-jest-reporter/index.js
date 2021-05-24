const JUXJestReporter = require('./src/JUXJestReporter')
const WSChannel = require('./src/WSChannel')
const createJuxReporter = require('./src/createJuxReporter')

// config: maybe we should read if from the config when jest instantiates us (?)
const JUX_SERVICE_PORT = 5326
const JUX_PROTOCOL = 'JUX_REPORTER'

const channel = new WSChannel(JUX_SERVICE_PORT, JUX_PROTOCOL)

module.exports = JUXJestReporter(createJuxReporter(channel))