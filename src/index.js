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
    x: 295,
    y: 145,
    vx: -2,
    vy: 0,
  },
  player1: {
    x: 2,
    y: 100,
  },
  player2: {
    x: 588,
    y: 100,
  },
  score: {
    player1: 0,
    player2: 0,
  },
}
const increment = 2
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

  socket.on('position', (position) => {
    if (socket.playerId == 1) {
      if (position == 'up' && gameObj.player1.y > 2) {
        gameObj.player1.y -= 2
      } else if (position == 'down' && gameObj.player1.y < 198) {
        gameObj.player1.y += 2
      }
    } else if (socket.playerId == 2) {
      if (position == 'up' && gameObj.player2.y > 2) {
        gameObj.player2.y -= 2
      } else if (position == 'down' && gameObj.player2.y < 198) {
        gameObj.player2.y += 2
      }
    }
  })

  socket.on('disconnect', () => {
    console.log(`DISCONNECTED: ${socket.id}`)
    if (!socket.playerId) {
      return
    }
    playersOnline[socket.playerId - 1] = false
  })
})

function updateBall() {
  gameObj.ball.x += gameObj.ball.vx
  gameObj.ball.y += gameObj.ball.vy
}

function handleCollision() {
  if (checkCollisionWithPaddle() == 1) {
    gameObj.ball.vx = -gameObj.ball.vx
    //// ONLY ENABLE IF YOU WANT TO MAKE THE BALL FASTER
    // if (gameObj.ball.vx < 10 && gameObj.ball.vx > -10) {
    //   gameObj.ball.vx += increment
    // }
    gameObj.ball.vy = getRelativeHitPosition(gameObj.player1)
  } else if (checkCollisionWithPaddle() == 2) {
    gameObj.ball.vx = -gameObj.ball.vx
    //// ONLY ENABLE IF YOU WANT TO MAKE THE BALL FASTER
    // if (gameObj.ball.vx < 10 && gameObj.ball.vx > -10) {
    //   gameObj.ball.vx -= increment
    // }
    gameObj.ball.vy = getRelativeHitPosition(gameObj.player2)
  }
}

function checkCollisionWithPaddle() {
  const paddle1 = gameObj.player1
  const paddle2 = gameObj.player2
  const ball = gameObj.ball

  if (
    ball.x >= paddle1.x &&
    ball.x <= paddle1.x + 10 &&
    ball.y >= paddle1.y &&
    ball.y <= paddle1.y + 100
  ) {
    return 1
  }

  if (
    ball.x + 10 >= paddle2.x &&
    ball.x + 10 <= paddle2.x + 10 &&
    ball.y + 10 >= paddle2.y &&
    ball.y + 10 <= paddle2.y + 100
  ) {
    return 2
  }

  return 0
}

function getRelativeHitPosition(paddle) {
  const paddleCenter = paddle.y + 50
  const ball = gameObj.ball

  const relativeHitPosition = (ball.y + 5 - paddleCenter) / 25

  return relativeHitPosition
}

function checkCollisionWithVerticalWalls() {
  if (gameObj.ball.x < 0) {
    resetBall(2)
  } else if (gameObj.ball.x > 590) {
    resetBall(1)
  }
}

function checkCollsionWithHorizontalWalls() {
  if (gameObj.ball.y < 0) {
    gameObj.ball.vy = -gameObj.ball.vy
    gameObj.ball.vx > 0
      ? (gameObj.ball.vx += increment)
      : (gameObj.ball.vx -= increment)
  } else if (gameObj.ball.y > 290) {
    gameObj.ball.vy = -gameObj.ball.vy
    gameObj.ball.vx > 0
      ? (gameObj.ball.vx += increment)
      : (gameObj.ball.vx -= increment)
  }
}

function resetBall(playerId) {
  if (playerId == 1) {
    gameObj.score.player1 += 1
    gameObj.ball = {
      x: 295,
      y: 145,
      vx: -2,
      vy: 0,
    }
  } else if (playerId == 2) {
    gameObj.score.player2 += 1
    gameObj.ball = {
      x: 295,
      y: 145,
      vx: 2,
      vy: 0,
    }
  } else {
    gameObj.ball = {
      x: 295,
      y: 145,
      vx: -2,
      vy: 0,
    }
  }
}

function resetGame() {
  const defaultGameObj = {
    ball: {
      x: 295,
      y: 145,
      vx: -2,
      vy: 0,
    },
    player1: {
      x: 2,
      y: 100,
    },
    player2: {
      x: 588,
      y: 100,
    },
    score: {
      player1: 0,
      player2: 0,
    },
  }

  if (defaultGameObj != gameObj) {
    gameObj = defaultGameObj
  }
}

setInterval(() => {
  if (
    (!playersOnline[0] && !playersOnline[1]) ||
    (playersOnline[0] && !playersOnline[1]) ||
    (!playersOnline[0] && playersOnline[1])
  ) {
    resetGame()
  } else {
    updateBall()
    handleCollision()
    checkCollisionWithVerticalWalls()
    checkCollsionWithHorizontalWalls()
    console.log(gameObj.ball.vx)
  }
  io.emit('game', gameObj)
}, 1000 / 60)

httpServer.listen(port, () => {
  console.log(`ONLINE: ${port}`)
})
