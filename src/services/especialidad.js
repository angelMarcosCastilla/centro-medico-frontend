import  axios  from 'axios'
export const getAllEspecialidad = async () => {
  try {
    const { data } = await axios.get('/especialidades')
    return data
  } catch {}
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
