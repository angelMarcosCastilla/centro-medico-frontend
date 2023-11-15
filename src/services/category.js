import axios from 'axios'

export const getAllCategories = async () => {
  const {
    data: { data }
  } = await axios.get('/categorias')
  return data
}

export const createCategory = async (categoryData) => {
  const { data } = await axios.post(`/categorias`, categoryData)
  return data
}

export const updateCategory = async (categoryId, categoryData) => {
  const { data } = await axios.put(`/categorias/${categoryId}`, categoryData)
  return data
}

export const disableCategory = async (categoryId) => {
  const { data } = await axios.delete(`/categorias/${categoryId}`)
  return data
}

export const enableCategory = async (categoryId) => {
  const { data } = await axios.patch(`/categorias/${categoryId}`)
  return data
}
