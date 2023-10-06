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
  const [userInfo, setUserInfo] = useState(() => {
    const data = localStorage.getItem('userInfo')
    if (data) {
      return JSON.parse(data)
    }
    return null
  })
  const [isValidateAuth, setIsValidateAuth] = useState(false)

  const setLoginData = useCallback(async (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    setUserInfo(userInfo)
    setIsValidateAuth(true)
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem('userInfo')
    setUserInfo(null)
  }, [])

  const value = useMemo(() => {
    return {
      isAuthenticated: userInfo !== null,
      userInfo,
      setLoginData,
      logout,
      isValidateAuth
    }
  }, [userInfo, setLoginData, logout, isValidateAuth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
