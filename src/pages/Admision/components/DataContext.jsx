import { createContext, useCallback, useContext, useState } from 'react'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [dataPaciente, setDataPaciente] = useState({})
  const [dataCliente, setDataCliente] = useState({})
  const [dataToSend, setDataToSend] = useState({
    pagoData: {
      idUsuario: JSON.parse(localStorage.getItem('userInfo')).idusuario,
      tipoComprobante: 'B'
    }
  })

  const resetDataToSend = useCallback(() => {
    setDataToSend({
      pagoData: {
        idUsuario: JSON.parse(localStorage.getItem('userInfo')).idusuario,
        tipoComprobante: 'B'
      }
    })
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
