import axios from 'axios'

export const getAllAreas = async () => {
  const { data } = await axios.get('/areas')
  return data.data
}
