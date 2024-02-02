import './css/style.css'

import React, { useEffect, useState, useMemo } from 'react'
import { calculateTimeRemaining, startCountdown } from './js/script'

function UnderConstructionPage() {
  const eventDate = useMemo(() => new Date('2024-06-01T00:00:00'), [])

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(eventDate))

  useEffect(() => {
    // Start the countdown when the component mounts
    const intervalId = startCountdown(eventDate, setTimeRemaining)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [eventDate])
  return (
    <div className="UnderConstructionPage">
      <h3 className="headline">Coming Soon</h3>

      <p className="info">Our website is under construction</p>

      <div className="countdown">
        <div className="countdown-numbers">
          <div className="time">{timeRemaining.days}</div>
          <div className="time-unit">Days</div>
        </div>

        <div className="countdown-numbers">
          <div className="time">{timeRemaining.hours}</div>
          <div className="time-unit">Hours</div>
        </div>

        <div className="countdown-numbers">
          <div className="time">{timeRemaining.minutes}</div>
          <div className="time-unit">Minutes</div>
        </div>

        <div className="countdown-numbers">
          <div className="time">{timeRemaining.seconds}</div>
          <div className="time-unit">Seconds</div>
        </div>
      </div>
    </div>
  )
}

export default UnderConstructionPage
