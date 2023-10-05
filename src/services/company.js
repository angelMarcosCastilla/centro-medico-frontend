import axios from 'axios'
export const addCompanyService = async (body) => {
  const { data } = await axios.post('/empresas', body)
  return data
}

export const searchCompanyByRUC = async (ruc) => {
  const { data } = await axios.get(`/empresas/ruc/${ruc}`)
  return data
}

export const searchCompanyById = async (idEmpresa) => {
  const { data } = await axios.get(`/empresas/${idEmpresa}`)
  return data
}
