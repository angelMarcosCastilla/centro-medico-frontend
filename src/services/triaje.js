export const listarTriajeService = async () => {
  const response = await fetch('http://localhost:3000/api/triaje/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const result = await response.json()
  return result
}
