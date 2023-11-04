import axios from 'axios'

export const getAllCategories = async () => {
  const { data } = await axios.get('/categorias')
  return data
}

export const getCategoria = async (idCategoria) =>{
  const {data} = await axios.get(`categorias/${idCategoria}`)
  return data.data
}

export const addCategoria = async (categoryData)=>{
  const {data} = await axios.post(`/categorias`, categoryData)
  return data
}

export const removeCategoria = async (idCategoria)=>{
  const {data} = await axios.delete(`/categorias/${idCategoria}`)
  return data
}

export const updateCategoria = async (idCategoria, categoryData)=>{
  const {data}  = await axios.put(`/categorias/${idCategoria}`, categoryData)
  return data
}
