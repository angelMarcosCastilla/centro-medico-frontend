import axios from 'axios'

export const getAllAreas = async () => {
  const { data } = await axios.get('/areas')
  return data.data
}

export const getArea = async (idArea) =>{
  const {data} = await axios.get(`areas/${idArea}`)
  return data.data
}

export const addArea = async (areaData)=>{
  const {data} = await axios.post(`/areas`, areaData)
  return data
}

export const removeArea = async (idArea)=>{
  const {data} = await axios.delete(`/areas/${idArea}`)
  return data
}

export const updateArea = async (idArea, areaData)=>{
  const {data}  = await axios.put(`/areas/${idArea}`, areaData)
  return data
}
