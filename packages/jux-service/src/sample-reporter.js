const WebSocket = require('ws')

const PORT = 5326

const openSocket = () => {
  const ws = new WebSocket(`ws://localhost:${PORT}/`, ['JUX_REPORTER']);

  ws.on('message', msg => {
    console.log('>> received', msg)
  })

  ws.on('open', () => {

    ws.send(JSON.stringify({
      type: 'REPORTER_EVENT',
      data: { blah: 'blah' }
    }))

  })
}

openSocket()