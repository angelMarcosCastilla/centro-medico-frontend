import axios from 'axios'

export const addResult = async (body) => {
  const { data } = await axios.post('/resultados', body)
  return data
}

export const updateResult = async (data) => {
  const { data: result } = await axios.put('/resultados', data)
  return result
}

export const updateResultForCorrection = async (data) => {
  const { data: result } = await axios.put('/resultados/correciones', data)
  return result
}

export const searchByDetAttention = async (idDetAttention) => {
  const { data } = await axios.get(
    `/resultados/detatenciones/${idDetAttention}`
  )
  return data
}
