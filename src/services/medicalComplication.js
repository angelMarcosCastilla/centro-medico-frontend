import axios from 'axios'

export const getAllMedicalComplications = async () => {
  const {
    data: { data }
  } = await axios.get('/complicacionesmedicas')
  return data
}
