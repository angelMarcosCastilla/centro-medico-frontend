import { createContext, useContext, useState } from 'react'

const SearcherContext = createContext()

export function SearcherProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState({})

  const handleSelectItem = (item) => {
    setSelectedItem(item)
  }

  return (
    <SearcherContext.Provider value={{ selectedItem, handleSelectItem }}>
      {children}
    </SearcherContext.Provider>
  )
}

export const useSearcherContext = () => {
  return useContext(SearcherContext)
}
