import axios from 'axios'

export const getAllServices = async () => {
  const { data } = await axios.get('/servicios')
  return data.data
}

export const getServicesByArea = async (idArea) => {
  const { data } = await axios.get(`/servicios/areas/${idArea}`)
  return data.data
}

export const createService = async (serviceData) => {
  const { data } = await axios.post('/servicios', serviceData)
  return data
}

export const updateService = async (idService, serviceData) => {
  const { data } = await axios.put(`/servicios/${idService}`, serviceData)
  return data
}

export const removeService = async (idService) => {
  const { data } = await axios.delete(`/servicios/${idService}`)
  return data
}
