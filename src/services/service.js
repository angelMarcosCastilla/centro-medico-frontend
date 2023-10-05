import axios from 'axios'

export const getAllServices = async () => {
  const { data } = await axios.get('/servicios')
  return data.data
}

export const getService = async (idService) => {
  const { data } = await axios.get(`servicios/${idService}`)
  return data.data
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

export const createService = async (serviceData) => {
  const { data } = await axios.post('/servicios', serviceData)
  return data
}

export const updateService = async (idService, serviceData) => {
  const { data } = await axios.put(`/servicios/${idService}`, serviceData)
  return data
}
