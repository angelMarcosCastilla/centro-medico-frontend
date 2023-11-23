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

export const getListOfPaymentsbyAgreement = async () => {
  const {
    data: { data }
  } = await axios.get('/pagos/pendientes')
  return data
}

export const completePaymentsByConvention = async (data) => {
  const {
    data: { data: response }
  } = await axios.post(`/pagos/convenio`, { payments: data })
  return response
}

export const getPaymentSimple = async () => {
  const {
    data: { data }
  } = await axios.get('/pagos/recibo-simple')
  return data
}

export const addObservacion = async (text, id) => {
  const {
    data: { data }
  } = await axios.put(`/pagos/observacion/${id}`, {text} )
  return data
}