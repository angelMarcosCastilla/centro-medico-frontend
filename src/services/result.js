import axios from 'axios'

export const addResult = async (data) => {
  const { data: result } = await axios.post('/resultados', data)
  return result
}

export const updateResult = async (data) => {
  const { data: result } = await axios.put('/resultados', data)
  return result
}

export const updateResultForCorrection = async (data) => {
  const { data: result } = await axios.put('/resultados/correcciones/', data)
  return result
}

export const removeResult = async (idDetAttention) => {
  const { data: result } = await axios.delete(`/resultados/${idDetAttention}`)
  return result
}

export const searchByDetAttention = async (idDetAttention) => {
  const { data } = await axios.get(
    `/resultados/detatenciones/${idDetAttention}`
  )
  return data
}
