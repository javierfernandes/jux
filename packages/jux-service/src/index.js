const WebSocket = require('ws')
const JuxService = require('./JuxService')

// TODO: take this from param
const PORT = 5326

const Protocols = {
  CLIENT: 'JUX_CLIENT',
  REPORTER: 'JUX_REPORTER',
}

const openSocket = () => {
  const service = new JuxService()

  const wss = new WebSocket.Server({
    port: PORT,
  })
  wss.on('connection', ws => {
    console.log('<<< Incoming connection !', ws.protocol)
    switch(ws.protocol) {
      case Protocols.CLIENT: service.addClient(ws); break
      case Protocols.REPORTER: service.addReporter(ws); break
      default: {
        console.error('Got connection from unknown protocol', ws.protocol)
      }
    }
    ws.on('disconnect', () => {
      // TODO: this doesn't seems to work
      // we must remove the reporter / client from our registry
      // for reporters we must broadcast a message so that clients remove them
      console.log('>>> Disconnected', ws.protocol)
    })
  })
  wss.on('disconnect', ws => {
    console.log('## Disconnected', ws.protocol)
  })
}

openSocket()