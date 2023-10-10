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
  const {
    data: { data }
  } = await axios.get(`/servicios/personal/${idArea}`)
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

export const getListofPaymentsbyAgreement = async ()=>{
  const response = await fetch('http://localhost:3000/api/servicios/pagos/pendiente')
  const {data} = await response.json()
  return data
}

export const getCompanyAgreement = async ()=>{
  const response = await fetch('http://localhost:3000/api/servicios/empresa/convenios')
  const {data} = await response.json()  
  return data
}
