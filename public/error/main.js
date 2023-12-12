const urlParams = new URLSearchParams(window.location.search)
const message = urlParams.get('message')

if (!message) {
  window.location.href = '/'
} else {
  const error = document.getElementById('error')
  const redirect = document.getElementById('redirect')
  error.innerText = message

  let countdown = Math.ceil(message.length / 50) * 5
  const countdownInterval = setInterval(() => {
    redirect.innerText = `Redirecting in ${countdown} seconds`
    countdown--
    if (countdown === 0) {
      clearInterval(countdownInterval)
      window.location.href = '/'
    }
  }, 1000)
}
