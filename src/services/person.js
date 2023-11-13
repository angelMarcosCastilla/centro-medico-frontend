import axios from 'axios'

export const getAllPersons = async () => {
  const {
    data: { data }
  } = await axios.get(`/personas`)

  return data
}

export const searchPersonById = async (idPersona) => {
  const { data } = await axios.get(`/personas/${idPersona}`)
  return data
}

export const searchPersonByNumDoc = async (numDocumento) => {
  const { data } = await axios.get(`/personas/numdocumento/${numDocumento}`)
  return data
}

export const createPerson = async (personData) => {
  const { data } = await axios.post('/personas', personData)
  return data
}

export const updatePerson = async (personId, personData) => {
  const { data } = await axios.put(`/personas/${personId}`, personData)
  return data
}

export const disablePerson = async (personId) => {
  const { data } = await axios.delete(`/personas/${personId}`)
  return data
}

export const enablePerson = async (personId) => {
  const { data } = await axios.patch(`/personas/${personId}`)
  return data
}
