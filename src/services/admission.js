import axios from 'axios'

export const addAdmissionAndData = async (body) => {
  const { data } = await axios.post('/atenciones', body)
  return data
}

export const getInProcessAttentionsByArea = async (idArea) => {
  const { data } = await axios.get(`/atenciones/areas/${idArea}`)
  return data
}

export const getInProcessReportAttentionsByArea = async (idArea) => {
  const { data } = await axios.get(`/atenciones/informes/area/${idArea}`)
  return data
}

export const getInProcessReportsPendingAndFinished = async () => {
  const {
    data: { data }
  } = await axios.get('/atenciones/informes/pendientes')
  return data
}

export const changeStatus = async (idDetAttention, newStatus) => {
  const { data } = await axios.put(`/atenciones/detalles/${idDetAttention}`, {
    estado: newStatus
  })
  return data
}

export const getServiciesByDoctor = async (idpersona) => {
  const {
    data: { data }
  } = await axios.get(`/atenciones/externalModule/${idpersona}`)
  return data
}

export const updateMedicoByDetatencion = async (data, iddetatencion) => {
  const { data: dataResponse } = await axios.put(
    `/atenciones/detalle/doctor/${iddetatencion}`,
    data
  )
  return dataResponse
}
