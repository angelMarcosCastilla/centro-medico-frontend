export const getallDetails = async () => {
  const response = await fetch('http://localhost:3000/api/detalleAtencion')
  const data = await response.json()
  return data
}

export const getAllDetailsRayosx = async () => {
  const response = await fetch(
    'http://localhost:3000/api/detalleAtencion/rayosx'
  )
  const data = await response.json()
  return data
}

export const getInProcessAttentionsByLaboratory = async () => {
  const response = await fetch(
    'http://localhost:3000/api/detalleatencion/areas/3'
  )
  const data = await response.json()
  return data
}

export const getInProcessReportAttentionsByLaboratory = async () => {
  const response = await fetch(
    'http://localhost:3000/api/detalleatencion/informes/3'
  )
  const data = await response.json()
  return data
}

export const changeStatus = async (iddetatencion, nuevoEstado) => {
  const response = await fetch(
    `http://localhost:3000/api/detalleAtencion/${iddetatencion}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estado: nuevoEstado
      })
    }
  )
  const result = await response.json()
  return result
}
