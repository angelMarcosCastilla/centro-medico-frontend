import { createContext, useCallback, useContext, useState } from 'react'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [dataPaciente, setDataPaciente] = useState({})
  const [dataCliente, setDataCliente] = useState({})
  const [dataToSend, setDataToSend] = useState({
    pagoData: {
      idUsuario: userInfo.idusuario,
      tipoComprobante: 'B'
    }
  })

  const resetDataToSend = useCallback(() => {
    if (userInfo) {
      setDataToSend({
        pagoData: {
          idUsuario: userInfo.idusuario,
          tipoComprobante: 'B'
        }
      })
    }
  }, [])

  return (
    <DataContext.Provider
      value={{
        resetDataToSend,
        dataPaciente,
        setDataPaciente,
        dataCliente,
        setDataCliente,
        dataToSend,
        setDataToSend
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useDataContext = () => {
  return useContext(DataContext)
}
