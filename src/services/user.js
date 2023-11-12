import axios from 'axios'

export const getAllUsers = async () => {
  const {
    data: { data }
  } = await axios.get('/usuarios')
  return data
}

export const searchPersonNotUser = async (numDoc) => {
  const { data } = await axios.get(`/usuarios/persona/notUser/${numDoc}`)
  return data
}

export const createUser = async (userData) => {
  const { data } = await axios.post('/usuarios', userData)
  return data
}

export const updateUser = async (userId, userData) => {
  const { data } = await axios.put(`usuarios/${userId}`, userData)
  return data
}

export const disableUser = async (userId) => {
  const { data } = await axios.delete(`/usuarios/${userId}`)
  return data
}

export const enableUser = async (userId) => {
  const { data } = await axios.patch(`/usuarios/${userId}`)
  return data
}
