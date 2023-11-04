import axios from 'axios'

export const getAllChartData = async () => {
  const {
    data: { data }
  } = await axios.get('/reportes/graficos')
  return data
}

export const getPaymentsByDateRange = async (
  startDate,
  endDate,
  numDocument
) => {
  const {
    data: { data }
  } = await axios.get(`/reportes/pagos/intervalo/${startDate}/${endDate}`, {
    params: { documento: numDocument }
  })
  return data
}

export const getAttentionsByAreaAndDateRange = async (
  areaId,
  startDate,
  endDate
) => {
  const {
    data: { data }
  } = await axios.get(
    `/reportes/atenciones/area/${areaId}/intervalo/${startDate}/${endDate}`
  )
  return data
}
