export const getToken = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const  { token } = JSON.parse(userInfo)
    return token
  }
  return null
}
