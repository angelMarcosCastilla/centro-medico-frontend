import axios from 'axios'

export const getPaymentTypes = async () => {
  const {
    data: { data }
  } = await axios.get(`/pagos/tipos`)
  return data
}
