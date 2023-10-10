import axios from 'axios'

export const getPaymentTypes = async () => {
  const {
    data: { data }
  } = await axios.get(`/pagos/tipos`)
  return data
}

export const paymentConvenios = async (data) => {
  const {
    data: { data: response }
  } = await axios.post(`/pagos/convenio`, { payments: data })
  return response
}
