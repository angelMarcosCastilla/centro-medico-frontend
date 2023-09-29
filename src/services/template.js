export const addTemplate = async (data) => {
  const response = await fetch('http://localhost:3000/api/plantillas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const getTemplateLatestVersionByService = async (idService) => {
  const response = await fetch(
    `http://localhost:3000/api/plantillas/servicios/${idService}`
  )
  const result = await response.json()
  return result
}
