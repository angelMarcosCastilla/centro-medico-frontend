export const getallDetails = async ()=>{
    const response = await fetch('http://localhost:3000/api/detalleAtencion');
    const data = await response.json();
    return data;
}