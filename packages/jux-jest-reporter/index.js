const JUXJestReporter = require('./src/JUXJestReporter')
const WSChannel = require('./src/channel/WSChannel')
const BufferingChannel = require('./src/channel/BufferingChannel')
const juxConnectionProvider = require('./src/juxConnectionProvider')

// config: maybe we should read if from the config when jest instantiates us (?)
const CONFIG_DEFAULTS = {
  juxServicePort: 5326,
  juxWSProtocol: 'JUX_REPORTER',
}

const channel = BufferingChannel(new WSChannel(CONFIG_DEFAULTS.juxServicePort, CONFIG_DEFAULTS.juxWSProtocol))
channel.onError(error => {
  console.error(`
  >>>>
  >>>> ERROR connecting to JUX Service !
  >>>>   make sure the service is running
  ${error}
  `)
})

module.exports = JUXJestReporter(juxConnectionProvider(channel))