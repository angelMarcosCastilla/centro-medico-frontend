export const getPaymentTypes = async () => {
  const response = await fetch(`http://localhost:3000/api/pagos/tipos`)
  const result = await response.json()
  return result
}
