const urlParams = new URLSearchParams(window.location.search)
const playerId = urlParams.get('playerId')

if (playerId !== '1' && playerId !== '2') {
  window.location.href = '/'
}

const playerIdEl = document.getElementById('playerId')
// if playerId is 1, then the player is on the left side and if it's 2, then the player is on the right side
if (playerId == 1) {
  playerIdEl.innerText = `You're player ${playerId} (left side))`
} else if (playerId == 2) {
  playerIdEl.innerText = `You're player ${playerId} (right side)`
}

const socket = io()

socket.on('connect', () => {
  socket.emit('playerId', playerId)
  document.addEventListener('keydown', function (event) {
    switch (event.key) {
      case 'w':
        socket.emit('position', 'up')
        break
      case 's':
        socket.emit('position', 'down')
        break
      case 'ArrowUp':
        socket.emit('position', 'up')
        break
      case 'ArrowDown':
        socket.emit('position', 'down')
        break
      default:
        break
    }
  })
})

socket.on('disconnect', () => {
  window.location.href = '/error?message=You got disconnected!'
})

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const score = document.getElementById('score')

var gameObj = {}

socket.on('game', (game) => {
  gameObj = game

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'white'
  ctx.fillRect(gameObj.ball.x, gameObj.ball.y, 10, 10)
  ctx.fillRect(gameObj.player1.x, gameObj.player1.y, 10, 100)
  ctx.fillRect(gameObj.player2.x, gameObj.player2.y, 10, 100)
  score.innerText = `${gameObj.score.player1} - ${gameObj.score.player2}`
  // if at any point one score is 10, the game is over and the winner is declared
  if (gameObj.score.player1 == 5) {
    window.location.href = '/winner?playerId=1'
  } else if (gameObj.score.player2 == 5) {
    window.location.href = '/winner?playerId=1'
  }
})
