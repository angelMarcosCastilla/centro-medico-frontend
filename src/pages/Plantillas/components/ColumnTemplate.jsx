import { Button, Input, Tooltip } from '@nextui-org/react'
import { ListX, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import './ColumnTemplate.css'

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

function InputTable({ value, onChange, isEditable }) {
  const [newValue, setNewValue] = useState(value)
  const debouncedValue = useDebaunce(newValue)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue])

  return (
    <Input
      isReadOnly={isEditable}
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
              {section.columns.map((col) => (
                <th key={col.uid} className='py-3 px-4'>
                  {col.title}
                </th>
              ))}
              <th className='py-3 px-4'>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={row.uid} className='bg-white dark:bg-gray-800'>
                {section.columns.map((column) => (
                  <td
                    key={section.uid + '_' + column.uid + '_' + row.uid}
                    className='p-3 text-slate-700'
                  >
                    <InputTable
                      isEditable={column.editable}
                      value={row[column.uid]}
                      onChange={(value) =>
                        onInputChange(section.uid, row.uid, column.uid, value)
                      }
                    />
                  </td>
                ))}
                <td>
                  <div className='flex justify-center gap-2'>
                    <Tooltip
                      content='Eliminar fila'
                      color='danger'
                      closeDelay={0}
                    >
                      <span
                        className='text-danger cursor-pointer active:opacity-50'
                        onClick={() => {
                          onRemoveRow(section.uid, row.uid)
                        }}
                      >
                        <Trash2 size={20} />
                      </span>
                    </Tooltip>
                  </div>
                </td>
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
