import './css/main.css'
import './css/util.css'
import './css/bootstrap.css'

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
      <div className="bg-g1 size1 flex-w flex-col-c-sb p-l-15 p-r-15 p-t-55 p-b-35 respon1">
        <div className="flex-col-c p-t-50 p-b-50">
          <h3 className="l1-txt1 txt-center p-b-10">Coming Soon</h3>

          <p className="txt-center l1-txt2 p-b-60">Our website is under construction</p>

          <div className="flex-w flex-c cd100 p-b-82">
            <div className="flex-col-c-m size2 how-countdown">
              <div className="l1-txt3 p-b-9 days">{timeRemaining.days}</div>
              <div className="s1-txt1">Days</div>
            </div>

            <div className="flex-col-c-m size2 how-countdown">
              <div className="l1-txt3 p-b-9 hours">{timeRemaining.hours}</div>
              <div className="s1-txt1">Hours</div>
            </div>

            <div className="flex-col-c-m size2 how-countdown">
              <div className="l1-txt3 p-b-9 minutes">{timeRemaining.minutes}</div>
              <div className="s1-txt1">Minutes</div>
            </div>

            <div className="flex-col-c-m size2 how-countdown">
              <div className="l1-txt3 p-b-9 minutes">{timeRemaining.seconds}</div>
              <div className="s1-txt1">Seconds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnderConstructionPage
