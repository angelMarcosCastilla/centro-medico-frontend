import axios from 'axios'

export const addPersonService = async (body) => {
  const { data } = await axios.post('/personas', body)
  return data
}

export const searchPersonByNumDoc = async (numDocumento) => {
  const { data } = await axios.get(`/personas/numdocumento/${numDocumento}`)
  return data
}

export const searchPersonById = async (idPersona) => {
  const { data } = await axios.get(`/personas/${idPersona}`)
  return data
}

export const getDoctorByAreaFunction = async (idarea) => {
  const {
    data: { data }
  } = await axios.get(`/personalesmedicos/areas/${idarea}`)
  return data
}
