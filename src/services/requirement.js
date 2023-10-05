import axios from 'axios'
export const getAllRequirement = async () => {
  const {
    data: { data }
  } = await axios.get(`/requisitos`)
  return data
}
