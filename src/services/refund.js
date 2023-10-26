import axios from 'axios'

export const listPaymentsForRefunds = async () => {
  const {
    data: { data }
  } = await axios.get('/reembolsos')
  return data
}

export const createRefund = async (refundData) => {
  const { data } = await axios.post('/reembolsos', refundData)
  return data
}
