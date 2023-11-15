import axios from 'axios'

export const getAllSpecialties = async () => {
  const {
    data: { data }
  } = await axios.get('/especialidades')
  return data
}

export const createSpecialty = async (specialtyData) => {
  const { data } = await axios.post('/especialidades', specialtyData)
  return data
}

export const updateSpecialty = async (specialtyId, specialtyData) => {
  const { data } = await axios.put(
    `/especialidades/${specialtyId}`,
    specialtyData
  )
  return data
}

export const disableSpecialty = async (specialtyId) => {
  const { data } = await axios.delete(`/especialidades/${specialtyId}`)
  return data
}

export const enableSpecialty = async (specialtyId) => {
  const { data } = await axios.patch(`/especialidades/${specialtyId}`)
  return data
}
