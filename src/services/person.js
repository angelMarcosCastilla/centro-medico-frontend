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
