import axios from 'axios'

export const getPersonalMedico = async () => {
  const { data } = await axios.get('/personalesmedicos')
  return data
}

export const updatePersonalMedico = async (id, datos) => {
  const { data } = await axios.put(`/personalesmedicos/${id}`, datos, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return data
}

export const deletePersonalMedico = async (id) => {
  const { data } = await axios.delete(`/personalesmedicos/${id}`)
  return data
}

export const activarPersonalMedico = async (id) => {
  const { data } = await axios.put(`/personalesmedicos/activar/${id}`)
  return data
}