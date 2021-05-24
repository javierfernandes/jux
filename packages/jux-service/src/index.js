const WebSocket = require('ws')
const JuxService = require('./service/JuxService')
const WSChannel = require('./ws/WSChannel')
const WSProtocols = require('./ws/WSProtocols')

// TODO: take this from param
const PORT = 5326

/**
 *
 */
const openSocket = () => {
  const service = new JuxService()

  const wss = new WebSocket.Server({ port: PORT })
  wss.on('connection', ws => {
    console.log('<<< Incoming connection !', ws.protocol)

    const channel = new WSChannel(ws)

    switch(ws.protocol) {
      case WSProtocols.CLIENT: service.addClient(channel); break
      case WSProtocols.REPORTER: service.addReporter(channel); break
      default: {
        console.error('Got connection from unknown protocol', ws.protocol)
      }
    }

  })

  wss.on('disconnect', ws => {
    console.log('## Disconnected', ws.protocol)
  })

}

openSocket()