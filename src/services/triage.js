import axios from 'axios'

export const getTriageList = async () => {
  const {
    data: { data }
  } = await axios.get(`/triajes`)
  return data
}

export const getTriageFromPatient = async (personId) => {
  const {
    data: { data }
  } = await axios.get(`/triajes/${personId}`)
  return data
}

export const createTriage = async (data) => {
  const { data: result } = await axios.post(`/triajes`, data)
  return result
}
