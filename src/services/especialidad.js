import axios from 'axios'
export const getAllEspecialidad = async () => {
  const {
    data: { data }
  } = await axios.get('/especialidades')
  return data
}
