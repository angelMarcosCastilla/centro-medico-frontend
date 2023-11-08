import axios from 'axios'

export const createAgreement = async (companyId, agreementData) => {
  const { data } = await axios.post(`/convenios/${companyId}`, agreementData)
  return data
}

export const removeAgreement = async (agreementId) => {
  const { data } = await axios.delete(`/convenios/${agreementId}`)
  return data
}
