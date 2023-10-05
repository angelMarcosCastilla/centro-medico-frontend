import axios from 'axios'

export const getAllCategories = async () => {
  const { data } = await axios.get('/categorias')
  return data.data
}
