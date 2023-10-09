import { useEffect, useState } from 'react'

export default function DateTimeClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const formattedDate = currentDateTime.toLocaleDateString('es', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })

  const updateDateTime = () => {
    const dateTimeNow = new Date()
    setCurrentDateTime(dateTimeNow)
    requestAnimationFrame(updateDateTime)
  }

  useEffect(() => {
    const animationFrame = requestAnimationFrame(updateDateTime)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <div className='text-[17px] text-gray-500 select-none'>
      <span>{formattedTime}</span>
      <span> • </span>
      <span>{formattedDate}</span>
    </div>
  )
}
