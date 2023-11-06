import axios from 'axios'

export const addAdmissionAndData = async (body) => {
  const { data } = await axios.post('/atenciones', body)
  return data
}

export const getInProcessAttentionsByArea = async (idArea) => {
  const {
    data: { data }
  } = await axios.get(`/atenciones/areas/${idArea}`)
  return data
}

export const getInProcessReportAttentionsByArea = async (idArea) => {
  const {
    data: { data }
  } = await axios.get(`/atenciones/informes/area/${idArea}`)
  return data
}

export const getInProcessReportsPendingAndFinished = async () => {
  const {
    data: { data }
  } = await axios.get('/atenciones/informes/pendientes')
  return data
}

export const getInProcessReportAttentionsByExternalDoctor = async (
  idPersona
) => {
  const {
    data: { data }
  } = await axios.get(`/atenciones/gestion-informes/${idPersona}`)
  return data
}

export const changeStatus = async (idDetAttention, newStatus) => {
  const { data } = await axios.put(`/atenciones/detalles/${idDetAttention}`, {
    estado: newStatus
  })
  return data
}

export const updateMedicoByDetatencion = async (idsMedicos, idDetAtencion) => {
  const { data } = await axios.put(
    `/atenciones/detalle/doctor/${idDetAtencion}`,
    idsMedicos
  )
  return data
}

export const changeOrder = async (data) => {
  const res = await axios.post('/atenciones/changeOrder', data)
  return res
}
