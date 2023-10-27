import axios from 'axios'

export const createPayment = async (paymentData) => {
  const { data } = await axios.post('/pagos', paymentData)
  return data
}

export const createPaymentDetail = async (paymentDetailData) => {
  const { data } = await axios.post('/pagos/detalles', paymentDetailData)
  return data
}

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

export const getPaymentMonth = async () => {
  const {
    data: { data: response }
  } = await axios.post(`/pagos/mensual`)
  return response
}
