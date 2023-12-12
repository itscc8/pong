const urlParams = new URLSearchParams(window.location.search)
const playerId = urlParams.get('playerId')

if (playerId !== '1' && playerId !== '2') {
  window.location.href = '/'
}

const socket = io()

socket.on('connect', () => {
  socket.emit('playerId', playerId)
})

socket.on('disconnect', () => {
  window.location.href = '/error?message=You got disconnected!'
})

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

var gameObj = {}

socket.on('game', (game) => {
  gameObj = game

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'white'
  ctx.fillRect(gameObj.ball.x, gameObj.ball.y, 10, 10)
  ctx.fillRect(gameObj.player1.x, gameObj.player1.y, 10, 100) // Draw paddle for player1
  ctx.fillRect(gameObj.player2.x, gameObj.player2.y, 10, 100) // Draw paddle for player2
})

// var paddle1Height = 2
// var paddle2Height = 2
// var ball = { x: 100, y: 100, color: 'white' }

// function updateCanvas() {
//   ctx.fillStyle = 'black'
//   ctx.fillRect(0, 0, canvas.width, canvas.height)

//   if (paddle1Height < 0) {
//     paddle1Height = 2
//   } else if (paddle1Height > 200) {
//     paddle1Height = 198
//   } else if (paddle2Height < 0) {
//     paddle2Height = 2
//   } else if (paddle2Height > 200) {
//     paddle2Height = 198
//   }

//   // Draw the paddles
//   ctx.fillStyle = 'white'
//   ctx.fillRect(10, paddle1Height, 10, 100) // Draw pixel for paddle1
//   ctx.fillRect(canvas.width - 20, paddle2Height, 10, 100) // Draw pixel for paddle2
//   ctx.fillRect(ball.x, ball.y, 10, 10) // Draw pixel for ball

//   // Move the ball
//   ball.x += 10
//   ball.y += 10

//   console.log(paddle1Height)
// }

// setInterval(updateCanvas, 100)

// document.addEventListener('keydown', function (event) {
//   if (event.key === 'w') {
//     console.log('w key pressed')
//     paddle1Height -= 10 // Move paddle1 up by 1 pixel
//   } else if (event.key === 's') {
//     console.log('s key pressed')
//     paddle1Height += 10 // Move paddle1 down by 1 pixel
//   } else if (event.key === 'ArrowUp') {
//     console.log('Up key pressed')
//     paddle2Height -= 10 // Move paddle2 up by 1 pixel
//   } else if (event.key === 'ArrowDown') {
//     console.log('Down key pressed')
//     paddle2Height += 10 // Move paddle2 down by 1 pixel
//   }
// })
