import  axios  from 'axios'

export const getAllUsuarios = async () => {
  const {data} = await axios.get('/usuarios');
  return data
}

export const removeUsuario = async (idUsuario) => {
  const {data} = await axios.delete(`/usuarios/${idUsuario}`);
  return data
}

export const activarUsuario = async (idUsuario) => {
  const {data} = await axios.post(`/usuarios/${idUsuario}/activar`);
  return data
}

export const SearchPersonNotUser = async (numDoc) => {
  const {data} = await axios.get(`/usuarios/persona/notUser/${numDoc}`);
  return data
}

export const createUser = async (data) => {
  const {data: response} = await axios.post('/usuarios', data);
  return response
}

export const editUser = async (idusuario, data) => {
  const {data: response} = await axios.put(`usuarios/${idusuario}`, data);
  return response
}