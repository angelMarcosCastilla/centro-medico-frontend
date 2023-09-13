import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(()=>{
    const data = localStorage.getItem('userInfo')
    if(data){
      return JSON.parse(data)
    }
    return null
  })

  const setLoginData = useCallback(async (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    setUserInfo(userInfo)
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem('userInfo')
    setUserInfo(null)
  }, [])

  const value = useMemo(() => {
    return {
      isAuthenticated:  userInfo !== null,
      userInfo, 
      setLoginData,
      logout
    }
  }, [ userInfo, setLoginData, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
