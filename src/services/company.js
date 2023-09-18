export const addCompanyService = async (data) => {
  const response = await fetch('http://localhost:3000/api/empresas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  return result
}

export const searchCompanyByRUC = async (ruc) => {
  const response = await fetch(`http://localhost:3000/api/empresas/ruc/${ruc}`)
  const result = await response.json()
  return result
}

export const searchCompanyById = async (idEmpresa) => {
  const response = await fetch(
    `http://localhost:3000/api/empresas/${idEmpresa}`
  )
  const result = await response.json()
  return result
}
