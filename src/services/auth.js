import axios from 'axios'

export const loginServices = async (claveAcceso, usuario) => {
  const { data } = await axios.post('/auth/login', {
    claveAcceso,
    usuario
  })
  return data
}
