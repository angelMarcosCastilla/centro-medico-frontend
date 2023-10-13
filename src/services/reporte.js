import axios from 'axios'

export const getAtencionesLast7day = async () => {
  const {
    data: { data }
  } = await axios.get('/reportes/atencion/last7days')
  return data
}


export const getAllGraficos =  async() =>{
  const {
    data: { data }
  } = await axios.get('/reportes/graficos')
  return data
}