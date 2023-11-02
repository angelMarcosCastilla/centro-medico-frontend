import axios from 'axios'

export const loginServices = async (claveAcceso, usuario) => {
  const { data } = await axios.post('/auth/login', {
    claveAcceso,
    usuario
  })
  return data
}

export const validatePassword = async (user, password) => {
  const { data } = await axios.post('/auth/validatepassword', {
    user,
    password
  })
  return data
}
