import axios from 'axios'

export const getAllCompany = async () => {
  const { data } = await axios.get('/empresas')
  return data
}

export const getCompany = async (idCompany) => {
  const {data} = await axios.get(`empresas/${idCompany}`)
  return data.data
}

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

export const removeCompany = async (idCompany) => {
  const { data } = await axios.delete(`/empresas/${idCompany}`)
  return data
}

export const updateCompany = async (idCompany, CompanyData) => {
  const { data } = await axios.put(`/empresas/${idCompany}`, CompanyData)
  return data
}
