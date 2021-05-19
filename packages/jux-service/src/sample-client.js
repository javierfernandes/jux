const WebSocket = require('ws')

const PORT = 5326

const openSocket = () => {
  const ws = new WebSocket(`ws://localhost:${PORT}/`, ['JUX_CLIENT']);

  ws.on('open', () => {})
  ws.on('message', msg => {
    const message = JSON.parse(msg)
    if (message.type === 'reporterMessage') {
      console.log('>> REPORTER EVENT from', message.reporter, 'with data', message.data)
    } else {
      console.log('>> UNKNOWN MESSAGE', msg)
    }
  })
}

openSocket()