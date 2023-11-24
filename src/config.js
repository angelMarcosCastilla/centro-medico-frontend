export const BASE_URL_WS =
  import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'

export const redirectToResult = (id) => {
  return `${BASE_URL_WS}/api/resultados/${id}/report`
}
