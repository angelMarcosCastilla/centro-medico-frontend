import axios from 'axios'

export const getAllAreas = async () => {
  const {
    data: { data }
  } = await axios.get('/areas')
  return data
}

export const createArea = async (areaData) => {
  const { data } = await axios.post('/areas', areaData)
  return data
}

export const updateArea = async (areaId, areaData) => {
  const { data } = await axios.put(`/areas/${areaId}`, areaData)
  return data
}

export const disableArea = async (areaId) => {
  const { data } = await axios.delete(`/areas/${areaId}`)
  return data
}

export const enableArea = async (areaId) => {
  const { data } = await axios.patch(`/areas/${areaId}`)
  return data
}
