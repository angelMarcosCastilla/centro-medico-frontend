export const getallDetails = async ()=>{
    const response = await fetch('http://localhost:3000/api/detalleAtencion');
    const data = await response.json();
    return data;
}

 export const changeStatus = async (iddetatencion, nuevoEstado) => {    
    const response = await fetch(`http://localhost:3000/api/detalleAtencion/${iddetatencion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: nuevoEstado,          
        })
    });
    const result = await response.json()
    return result
}   