import { createContext, useContext, useState } from 'react'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [dataPaciente, setDataPaciente] = useState({})
  const [dataCliente, setDataCliente] = useState({})
  const [dataToSend, setDataToSend] = useState({})

  return (
    <DataContext.Provider
      value={{
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
