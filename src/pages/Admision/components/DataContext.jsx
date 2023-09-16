import { createContext, useContext, useState } from 'react'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [dataPaciente, setDataPaciente] = useState({})
  const [dataToSend, setDataToSend] = useState({})

  return (
    <DataContext.Provider
      value={{ dataPaciente, setDataPaciente, dataToSend, setDataToSend }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useDataContext = () => {
  return useContext(DataContext)
}
