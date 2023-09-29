import { Button, Input, Tooltip } from '@nextui-org/react'
import { ListX, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import './style.css'

const useDebaunce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function InputTable({ value, onChange }) {
  const [newValue, setNewValue] = useState(value)
  const debouncedValue = useDebaunce(newValue)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue])

  return (
    <Input
      type='text'
      value={newValue}
      onChange={(e) => setNewValue(e.target.value)}
    />
  )
}

export default function ColumnTemplate({
  section,
  onInputChange,
  onSectionChange,
  onAddRow,
  onRemoveRow,
  onRemoveSection
}) {
  return (
    <>
      <div className='grid grid-cols-4 px-4 gap-4 items-end'>
        <Input
          type='text'
          label='Título de la Sección'
          color='primary'
          variant='underlined'
          value={section.title}
          onChange={(e) => onSectionChange(section.uid, e.target.value)}
        />
        <Tooltip
          content='Eliminar sección'
          color='danger'
          placement='right'
          closeDelay={0}
        >
          <Button
            isIconOnly
            color='danger'
            variant='light'
            onPress={() => onRemoveSection(section.uid)}
          >
            <ListX size={20} />
          </Button>
        </Tooltip>
      </div>

      <div className='relative px-4 mt-3'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-500 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              {section.columns.map((col, index) => (
                <th key={index} className='py-3 px-4'>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, index) => (
              <tr key={index} className='bg-white dark:bg-gray-800'>
                {section.columns.map((column) => (
                  <td
                    key={section.uid + '_' + column.uid + '_' + index}
                    className='p-3 text-slate-700'
                  >
                    {column.uid !== 'acciones' ? (
                      <InputTable
                        value={row[column.uid]}
                        onChange={(value) =>
                          onInputChange(section.uid, index, column.uid, value)
                        }
                      />
                    ) : (
                      <div className='flex justify-center gap-2'>
                        <Tooltip
                          content='Eliminar fila'
                          color='danger'
                          closeDelay={0}
                        >
                          <span
                            className='text-danger cursor-pointer active:opacity-50'
                            onClick={() => onRemoveRow(section.uid, index)}
                          >
                            <Trash2 size={20} />
                          </span>
                        </Tooltip>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-center px-4 mb-4'>
        <Button
          className='w-full'
          color='primary'
          radius='full'
          variant='light'
          startContent={<Plus size={20} />}
          onPress={() => onAddRow(section.uid)}
        >
          Agregar nueva fila
        </Button>
      </div>
    </>
  )
}
