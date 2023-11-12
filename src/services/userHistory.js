import axios from 'axios'

export const createUserHistory = async (userHistoryData) => {
  const { data } = await axios.post('/historialusuarios', userHistoryData)
  return data
}
