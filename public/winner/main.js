const urlParams = new URLSearchParams(window.location.search)
const playerId = urlParams.get('playerId')

if (playerId !== '1' && playerId !== '2') {
  window.location.href = '/'
} else {
  const winner = document.getElementById('winner')
  const redirect = document.getElementById('redirect')
  winner.innerText = `Player ${playerId} won the game!`

  let countdown = 10
  const countdownInterval = setInterval(() => {
    redirect.innerText = `Redirecting in ${countdown} seconds`
    countdown--
    if (countdown === 0) {
      clearInterval(countdownInterval)
      window.location.href = '/'
    }
  }, 1000)
}
