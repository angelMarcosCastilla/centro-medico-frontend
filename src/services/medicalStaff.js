import axios from 'axios'

export const getMedicalStaff = async () => {
  const {
    data: { data }
  } = await axios.get('/personalesmedicos')
  return data
}

export const getDoctorsByArea = async (idarea) => {
  const {
    data: { data }
  } = await axios.get(`/personalesmedicos/areas/${idarea}`)
  return data
}

export const searchMedicalPersonnelByNumDoc = async (numDocument) => {
  const { data } = await axios.get(
    `/personalesmedicos/numdocumento/${numDocument}`
  )
  return data
}

export const createMedicalPersonnel = async (medicalPersonnelData) => {
  const { data } = await axios.post(
    '/personalesMedicos',
    medicalPersonnelData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return data
}

export const updateMedicalPersonnel = async (
  medicalPersonnelId,
  medicalPersonnelData
) => {
  const { data } = await axios.put(
    `/personalesmedicos/${medicalPersonnelId}`,
    medicalPersonnelData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return data
}

export const disableMedicalPersonnel = async (medicalPersonnelId) => {
  const { data } = await axios.delete(
    `/personalesmedicos/${medicalPersonnelId}`
  )
  return data
}

export const enableMedicalPersonnel = async (medicalPersonnelId) => {
  const { data } = await axios.patch(`/personalesmedicos/${medicalPersonnelId}`)
  return data
}
