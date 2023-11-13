import axios from 'axios'

export const addAdmissionAndData = async (body) => {
  const { data } = await axios.post('/atenciones', body)
  return data
}

export const getInProcessAttentionsByArea = async (areaId) => {
  const {
    data: { data }
  } = await axios.get(`/atenciones/areas/${areaId}`)
  return data
}

export const getInProcessReportAttentionsByArea = async (areaId) => {
  const {
    data: { data }
  } = await axios.get(`/atenciones/informes/area/${areaId}`)
  return data
}

export const getInProcessReportsPendingAndFinished = async () => {
  const {
    data: { data }
  } = await axios.get('/atenciones/informes/pendientes')
  return data
}

export const getInProcessReportAttentionsByExternalDoctor = async (
  personId
) => {
  const {
    data: { data }
  } = await axios.get(`/atenciones/gestion-informes/${personId}`)
  return data
}

export const changeStatus = async (idDetAttention, newStatus) => {
  const { data } = await axios.put(`/atenciones/detalles/${idDetAttention}`, {
    estado: newStatus
  })
  return data
}

export const addDoctorsDetails = async (idsDoctors, idDetAttention) => {
  const { data } = await axios.put(
    `/atenciones/detalle/doctor/${idDetAttention}`,
    idsDoctors
  )
  return data
}

export const changeOrderDetail = async (orderData) => {
  const { data } = await axios.post('/atenciones/changeOrder', orderData)
  return data
}
