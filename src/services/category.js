import axios from 'axios'

export const listCategoriesByArea = async (idArea) => {
  const response = await axios.get(`/categorias/${idArea}`)
  const {
    data: { data }
  } = response
  return data
}
