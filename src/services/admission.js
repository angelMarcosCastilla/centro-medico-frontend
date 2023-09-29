export const addAdmissionAndData = async (data) => {
  const response = await fetch('http://localhost:3000/api/atenciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const getInProcessAttentionsByArea = async (idArea) => {
  const response = await fetch(
    `http://localhost:3000/api/atenciones/areas/${idArea}`
  )
  const data = await response.json()
  return data
}

export const getInProcessReportAttentionsByArea = async (idArea) => {
  const response = await fetch(
    `http://localhost:3000/api/atenciones/informes/${idArea}`
  )
  const data = await response.json()
  return data
}

export const changeStatus = async (idDetAttention, newStatus) => {
  const response = await fetch(
    `http://localhost:3000/api/atenciones/detalles/${idDetAttention}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estado: newStatus
      })
    }
  )
  const result = await response.json()
  return result
}

export const getServiciesByDoctor = async (idpersona) => {
  const response = await fetch(
    `http://localhost:3000/api/atenciones/externalModule/${idpersona}`,
    {
      method: 'GET'
    }
  )

  const data = await response.json()
  return data
}
