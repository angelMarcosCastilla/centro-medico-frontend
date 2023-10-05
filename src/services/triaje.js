import axios from "axios"

export const listarTriajeService = async () => {
  const { data } = await axios.get(`/triaje/all`)
  return data
}


export const registrarTriajeService = async (data) => {
  const { data: result } = await axios.post(`/triaje/register`, data)
  return result
}