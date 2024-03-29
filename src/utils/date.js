export const createQueryParams = (paramsObj) => {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(paramsObj)) {
    params.append(key, value)
  }

  return `?${params.toString()}`
}

export const calculatePersonAge = (date) => {
  let birthDate

  if (typeof date === 'string') {
    const dateFormat = date.split('/')
    if (dateFormat.length === 3) {
      birthDate = new Date(`${dateFormat[2]}-${dateFormat[1]}-${dateFormat[0]}`)
    } else {
      birthDate = new Date(date)
    }
  } else if (date instanceof Date) {
    birthDate = date
  } else {
    return null
  }

  const currentDate = new Date()
  const millisecondsDiff = currentDate - birthDate
  const age = millisecondsDiff / (365.25 * 24 * 60 * 60 * 1000)
  return Math.floor(age)
}

export const isPersonAdult = (date, minimumAge = 18) => {
  const age = calculatePersonAge(date)
  return age !== null && age >= minimumAge
}

export const formatDate = (dateString, includeTime = false, hour12 = true) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.hour12 = hour12
  }

  return new Date(dateString.replace('Z', '')).toLocaleDateString(
    'es-ES',
    options
  )
}
