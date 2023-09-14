export const getAllServices = async () => {
    const response = await fetch('http://localhost:3000/api/servicios');
    const data = await response.json();
    return data;
};