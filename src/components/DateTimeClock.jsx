import { useEffect, useState } from 'react'

export default function DateTimeClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

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
    <h2 className='text-lg'>
      {currentDateTime.toLocaleDateString('es', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}
    </h2>
  )
}
