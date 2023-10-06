import axios from 'axios'

export const createTemplate = async (templateData) => {
  const { data } = await axios.post('/plantillas', templateData)
  return data
}

export const updateTemplate = async (templateData) => {
  const { data } = await axios.put('/plantillas', templateData)
  return data
}

export const getTemplateLatestVersionByService = async (idService) => {
  const { data } = await axios.get(`/plantillas/servicios/${idService}`)
  return data
}
