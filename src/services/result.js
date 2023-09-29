export const addResult = async (data) => {
  const response = await fetch('http://localhost:3000/api/resultados', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const updateResult = async (data) => {
  const response = await fetch('http://localhost:3000/api/resultados', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const searchByDetAttention = async (idDetAttention) => {
  const response = await fetch(
    `http://localhost:3000/api/resultados/detatenciones/${idDetAttention}`
  )
  const result = await response.json()
  return result
}
