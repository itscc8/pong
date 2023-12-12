const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const api = express.Router()

var playersOnline = [false, false]
var gameObj = {
  ball: {
    x: 2,
    y: 200,
  },
  player1: {
    x: 2,
    y: 2,
  },
  player2: {
    x: 588,
    y: 2,
  },
}
const port = 3000

app.use(express.json())
app.use(express.static('public'))
app.use('/api', api)

api.post('/select', (req, res) => {
  const { playerId } = req.body
  if (playersOnline[0] == false && playerId == 1) {
    res.sendStatus(200)
  } else if (playersOnline[1] == false && playerId == 2) {
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
})

io.on('connection', (socket) => {
  console.log(`CONNECTED: ${socket.id}`)
  setTimeout(() => {
    if (!socket.playerId) {
      socket.disconnect()
    }
  }, 5000)

  socket.on('playerId', (playerId) => {
    socket.playerId = playerId
    playersOnline[playerId - 1] = true
  })

  socket.on('disconnect', () => {
    console.log(`DISCONNECTED: ${socket.id}`)
    if (!socket.playerId) {
      return
    }
    playersOnline[socket.playerId - 1] = false
  })
})

setInterval(() => {
  io.emit('game', gameObj)
}, 100)

httpServer.listen(port, () => {
  console.log(`ONLINE: ${port}`)
})
