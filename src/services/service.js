export const getAllServices = async () => {
  const response = await fetch('http://localhost:3000/api/servicios')
  const { data } = await response.json()
  return data
}

export const getServicesByArea = async (idArea) => {
  const response = await fetch(`http://localhost:3000/api/servicios/${idArea}`)
  const { data } = await response.json()
  return data
}

export const getAllPersonal = async (idArea) => {
  const response = await fetch(
    `http://localhost:3000/api/servicios/personal/${idArea}`
  )
  const { data } = await response.json()
  return data
}

export const createService = async (data) => {
  const response = await fetch('http://localhost:3000/api/servicios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const updateService = async (data) => {
  const response = await fetch('http://localhost:3000/api/servicios', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}
