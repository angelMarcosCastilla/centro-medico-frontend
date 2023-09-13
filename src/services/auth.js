export const loginServices = async (claveAcceso, usuario ) => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ claveAcceso, usuario }),
  });
  const data = await response.json();
  return data;
}