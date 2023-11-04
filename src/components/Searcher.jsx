import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearcherContext } from './SearcherProvider'
import { Chip } from '@nextui-org/react'

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const areasColor = {
  Laboratorio: 'primary',
  Tomografía: 'secondary',
  'Rayos X': 'success'
}

export default function Searcher({ data }) {
  const [items, setItems] = useState([])
  const [itemMatch, setItemMatch] = useState([])
  const [value, setValue] = useState('')
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const [resultsFound, setResultsFound] = useState(true)

  const { handleSelectItem } = useSearcherContext()

  const searchItems = (text) => {
    if (!text) {
      setItemMatch([])
      setSelectedItemIndex(-1)
      setResultsFound(true)
    } else {
      const normalizedText = removeAccents(text).toLowerCase()
      const matches = items.filter((item) => {
        const serviceName = removeAccents(item.servicio.nombre).toLowerCase()

        return serviceName.includes(normalizedText)
      })

      setItemMatch(matches.slice(0, 7))
      setResultsFound(matches.length > 0)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (selectedItemIndex < itemMatch.length - 1) {
        setSelectedItemIndex(selectedItemIndex + 1)
      } else {
        setSelectedItemIndex(0)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (selectedItemIndex > 0) {
        setSelectedItemIndex(selectedItemIndex - 1)
      } else {
        setSelectedItemIndex(itemMatch.length - 1)
      }
    } else if (e.key === 'Enter') {
      if (selectedItemIndex >= 0) {
        handleItemClick(itemMatch[selectedItemIndex])
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

  const resetSearcher = () => {
    setValue('')
    setItemMatch([])
  }

  const handleItemClick = (item) => {
    handleSelectItem(item)
    resetSearcher()
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
        autoFocus
        className={`
          p-4 mb-1.5 text-[15px] bg-gray-100 rounded-xl w-full pl-12
          outline-0 outline-offset-2 focus:outline-2 focus:outline-primary-500
        `}
        type='text'
        placeholder='Buscar un servicio...'
        maxLength={50}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          searchItems(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        onFocus={(e) => searchItems(e.target.value)}
        onBlur={() => {
          if (selectedItemIndex === -1 || !resultsFound) {
            setItemMatch([])
            setResultsFound(true)
          }
        }}
      />
      {value && (
        <button
          className='absolute top-4 right-4'
          onClick={resetSearcher}
          tabIndex={-1}
        >
          <X size={20} />
        </button>
      )}
      {itemMatch.length > 0 && (
        <ul
          className={`
            absolute z-20 p-2 w-full bg-white border rounded-xl shadow max-h-max
            overflow-hidden transition-all
          `}
          onMouseLeave={handleMouseLeave}
        >
          {itemMatch.map((item, index) => (
            <li
              key={item.servicio.id}
              className={`
                flex justify-between text-[15px] px-2 py-[5px] rounded-lg cursor-pointer select-none 
                ${index === selectedItemIndex ? 'bg-gray-300' : ''}
              `}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              <div>{item.servicio.nombre}</div>
              <div className='flex items-center gap-1'>
                <Chip
                  color={areasColor[item.area.nombre]}
                  size='sm'
                  variant='flat'
                  className='text-xs'
                >
                  {item.categoria.nombre}
                </Chip>
                <Chip
                  color={areasColor[item.area.nombre]}
                  size='sm'
                  variant='flat'
                  className='text-xs'
                >
                  {item.area.nombre}
                </Chip>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!resultsFound && (
        <div
          className={`
          absolute z-20 w-full px-4 py-[14px] text-[15px] 
          bg-white  border rounded-xl shadow max-h-max select-none 
        `}
        >
          No se encontraron resultados.
        </div>
      )}
    </div>
  )
}
