import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAutocompleteContext } from './AutocompleteProvider'

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function Autocomplete({ data }) {
  const [items, setItems] = useState([])
  const [itemMatch, setItemMatch] = useState([])
  const [value, setValue] = useState('')
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const inputRef = useRef(null)

  const { handleSelectItem } = useAutocompleteContext()

  const searchItems = (text) => {
    if (!text) {
      setItemMatch([])
      setSelectedItemIndex(-1)
    } else {
      const normalizedText = removeAccents(text).toLowerCase()
      const matches = items.filter((item) => {
        const servicioNombre = removeAccents(item.servicio.nombre).toLowerCase()
        const categoriaNombre = removeAccents(
          item.categoria.nombre
        ).toLowerCase()

        return (
          servicioNombre.includes(normalizedText) ||
          categoriaNombre.includes(normalizedText)
        )
      })

      setItemMatch(matches)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (selectedItemIndex < itemMatch.length - 1) {
        setSelectedItemIndex(selectedItemIndex + 1)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (selectedItemIndex > 0) {
        setSelectedItemIndex(selectedItemIndex - 1)
      }
    } else if (e.key === 'Tab') {
      setItemMatch([])
    }
  }

  const handleMouseEnter = (index) => {
    setSelectedItemIndex(index)
  }

  const handleMouseLeave = () => {
    setSelectedItemIndex(-1)
  }

  const resetAutocomplete = () => {
    setValue('')
    setItemMatch([])
  }

  const handleItemClick = (item) => {
    handleSelectItem(item)
    resetAutocomplete()
  }

  useEffect(() => {
    const mappedData = []

    data.forEach((area) => {
      area.categorias.forEach((category) => {
        category.servicios.forEach((service) => {
          const mappedObject = {
            servicio: {
              nombre: service.nombre,
              id: service.idservicio,
              observacion: service.observacion,
              triaje: service.triaje,
              ordenmedica: service.orden_medica,
              precio: service.precio
            },
            categoria: {
              nombre: category.nombre,
              id: category.idcategoria
            },
            area: {
              nombre: area.nombre,
              id: area.idarea
            }
          }
          mappedData.push(mappedObject)
        })
      })
    })

    mappedData.sort((a, b) =>
      a.servicio.nombre.localeCompare(b.servicio.nombre)
    )

    setItems(mappedData)
  }, [])

  return (
    <div className='relative'>
      <span className='absolute top-4 left-4'>
        <Search size={20} />
      </span>
      <input
        className={`
          p-4 mb-1.5 text-[15px] bg-gray-100 rounded-xl w-full pl-12
          outline-0 outline-offset-2 focus:outline-2 focus:outline-primary-500
        `}
        type='text'
        placeholder='Buscar servicio o categoría o área'
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          searchItems(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        onFocus={(e) => searchItems(e.target.value)}
        ref={inputRef}
      />
      {value && (
        <button
          className='absolute top-4 right-4'
          onClick={resetAutocomplete}
          tabIndex={-1}
        >
          <X size={20} />
        </button>
      )}
      {itemMatch.length > 0 && (
        <ul
          className={`
            absolute z-20 p-2 w-full bg-white border rounded-xl shadow-sm max-h-60 overflow-y-auto
          `}
          onMouseLeave={handleMouseLeave}
        >
          {itemMatch.map((item, index) => (
            <li
              key={item.servicio.id}
              className={`text-[15px] px-2 py-[5px] rounded-lg cursor-pointer ${
                index === selectedItemIndex ? 'bg-gray-300' : ''
              }`}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              {item.servicio.nombre} | {item.categoria.nombre} |{' '}
              {item.area.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
