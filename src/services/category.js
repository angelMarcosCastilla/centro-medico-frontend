export const listCategoriesByArea = async (idArea) => {
  const response = await fetch(`http://localhost:3000/api/categorias/${idArea}`)
  const { data } = await response.json()
  return data
}
