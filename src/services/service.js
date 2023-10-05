import axios from 'axios'

export const getAllServices = async () => {
  const { data } = await axios.get('/servicios')
  return data.data
}

export const getService = async (idService) => {
  const response = await fetch(
    `http://localhost:3000/api/servicios/${idService}`
  )
  const { data } = await response.json()
  return data
}

export const getServicesByArea = async (idArea) => {
  const { data } = await axios.get(`/servicios/areas/${idArea}`)
  return data.data
}

export const getAllPersonal = async (idArea) => {
  const response = await fetch(
    `http://localhost:3000/api/servicios/personal/${idArea}`
  )
  const { data } = await response.json()
  return data
}

export const getListStatePE = async () => {
  const response = await fetch(
    'http://localhost:3000/api/servicios/pendiente/results'
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

export const updateService = async (idService, data) => {
  const response = await fetch(
    `http://localhost:3000/api/servicios/${idService}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )
  const result = await response.json()
  return result
}
