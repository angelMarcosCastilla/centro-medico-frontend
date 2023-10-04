export const getAllRequirement = async () => {
  const response = await fetch('http://localhost:3000/api/requisitos')
  const { data } = await response.json()
  return data
}
