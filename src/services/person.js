export const addPersonService = async (data) => {
  const response = await fetch('http://localhost:3000/api/personas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const searchPersonByNumDoc = async (numDocumento) => {
  const response = await fetch(
    `http://localhost:3000/api/personas/numdocumento/${numDocumento}`
  )
  const result = await response.json()
  return result
}

export const searchById = async (idPersona) => {
  const response = await fetch(
    `http://localhost:3000/api/personas/${idPersona}`
  )
  const result = await response.json()
  return result
}
