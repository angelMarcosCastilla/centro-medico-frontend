import axios from 'axios'

export const addResult = async (resultData) => {
  const { data } = await axios.post('/resultados', resultData)
  return data
}

export const updateResult = async (resultData) => {
  const { data } = await axios.put('/resultados', resultData)
  return data
}

export const updateResultForCorrection = async (correctionData) => {
  const { data } = await axios.put('/resultados/correcciones/', correctionData)
  return data
}

export const removeResult = async (idDetAttention) => {
  const { data } = await axios.delete(`/resultados/${idDetAttention}`)
  return data
}

export const searchResultByDetAttention = async (idDetAttention) => {
  const { data } = await axios.get(
    `/resultados/detatenciones/${idDetAttention}`
  )
  return data
}
