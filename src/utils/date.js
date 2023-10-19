export const createQueryParams = (paramsObj) => {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(paramsObj)) {
    params.append(key, value)
  }

  return `?${params.toString()}`
}

export const calculateAgePerson = (date) => {
  const dateFormat = date?.split('/')
  if (dateFormat) {
    const fechaInvertida = `${dateFormat[2]}-${dateFormat[1]}-${dateFormat[0]}`

    const fechaNacimientoDate = new Date(fechaInvertida)

    const fechaActual = new Date()

    const diferenciaEnMilisegundos = fechaActual - fechaNacimientoDate

    const edad = diferenciaEnMilisegundos / (365.25 * 24 * 60 * 60 * 1000)

    if (edad >= 18) {
      return true
    } else {
      return false
    }
  }
}

export const formatDate = (dateString, includeTime = false) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.hour12 = true
  }

  return new Date(dateString).toLocaleDateString('es-ES', options)
}
