export const getPaymentTypes = async () => {
  const response = await fetch(`http://localhost:3000/api/pagos/tipos`)
  const { data } = await response.json()
  return data
}
