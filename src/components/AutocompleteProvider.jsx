import { createContext, useContext, useState } from 'react'

const AutocompleteContext = createContext()

export function AutocompleteProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState({})

  const handleSelectItem = (item) => {
    setSelectedItem(item)
  }

  return (
    <AutocompleteContext.Provider value={{ selectedItem, handleSelectItem }}>
      {children}
    </AutocompleteContext.Provider>
  )
}

export const useAutocompleteContext = () => {
  return useContext(AutocompleteContext)
}
