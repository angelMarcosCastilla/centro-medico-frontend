import axios from 'axios'

export const listarTriajeService = async () => {
  const {
    data: { data }
  } = await axios.get(`/triajes`)
  return data
}

export const createTriage = async (data) => {
  const { data: result } = await axios.post(`/triajes`, data)
  return result
}
