import axios from 'axios'

export const getAllCompany = async () => {
  const {
    data: { data }
  } = await axios.get('/empresas')
  return data
}

export const getCompany = async (idCompany) => {
  const { data } = await axios.get(`empresas/${idCompany}`)
  return data.data
}

export const getCompanyAgreement = async () => {
  const {
    data: { data }
  } = await axios.get('/empresas/convenios')
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

export const createCompany = async (companyData) => {
  const { data } = await axios.post('/empresas', companyData)
  return data
}

export const updateCompany = async (companyId, companyData) => {
  const { data } = await axios.put(`/empresas/${companyId}`, companyData)
  return data
}

export const disableCompany = async (companyId) => {
  const { data } = await axios.delete(`/empresas/${companyId}`)
  return data
}

export const enableCompany = async (companyId) => {
  const { data } = await axios.patch(`/empresas/${companyId}`)
  return data
}
