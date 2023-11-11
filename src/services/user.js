import axios from 'axios'

export const getAllUsers = async () => {
  const {
    data: { data }
  } = await axios.get('/usuarios')
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

export const SearchPersonNotUser = async (numDoc) => {
  const { data } = await axios.get(`/usuarios/persona/notUser/${numDoc}`)
  return data
}

export const createUser = async (data) => {
  const { data: response } = await axios.post('/usuarios', data)
  return response
}

export const editUser = async (idusuario, data) => {
  const { data: response } = await axios.put(`usuarios/${idusuario}`, data)
  return response
}
