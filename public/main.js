function selectPlayer(playerId) {
  fetch('/api/select', {
    method: 'POST',
    body: JSON.stringify({ playerId }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = `/game?playerId=${playerId}`
      } else {
        window.location.href = `/error?message=Invalid playerId or there might already be a player with that Id.`
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
