import axios from 'axios'
export const getAllEspecialidad = async () => {
  const {
    data: { data }
  } = await axios.get('/especialidades')
  return data
}

export const createPersonalMedico = async (personalMedico) => {
  try {
    const { data } = await axios.post('/personalesMedicos', personalMedico, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  } catch {}
}
