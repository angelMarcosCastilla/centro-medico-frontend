import axios from 'axios'

export const getAttentionsByAreaAndDateRange = async (
  areaId,
  startDate,
  endDate
) => {
  const {
    data: { data }
  } = await axios.get(
    `/reportes/area/${areaId}/intervalo/${startDate}/${endDate}`
  )
  return data
}
