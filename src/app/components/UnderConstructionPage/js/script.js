// Function to calculate time remaining from a specific event
export function calculateTimeRemaining(eventDate) {
  const currentTime = new Date()
  const difference = eventDate.getTime() - currentTime.getTime()

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

// Function to continuously update the time remaining
export function startCountdown(eventDate, updateCallback) {
  // Update initially
  updateCallback(calculateTimeRemaining(eventDate))

  // Update every second
  const intervalId = setInterval(() => {
    updateCallback(calculateTimeRemaining(eventDate))
  }, 1000)

  // Return the interval ID in case you want to stop the countdown later
  return intervalId
}
