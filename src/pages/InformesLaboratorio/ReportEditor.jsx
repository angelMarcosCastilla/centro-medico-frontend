import { Button, CardBody, CardFooter, Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFetcher } from '../../hook/useFetcher'
import { getTemplateLatestVersionByService } from '../../services/template'
import { toast } from 'sonner'
import {
  addResult,
  searchResultByDetAttention,
  updateResult
} from '../../services/result'
import { changeStatus } from '../../services/admission'
import { ChevronsRight } from 'lucide-react'
import { socket } from '../../components/Socket'

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

function InputItem({ value, onChange }) {
  const [itemValue, setItemValue] = useState(value)

  const handleInputChange = (e) => {
    setItemValue(e.target.value)
    onChange(e.target.value)
  }

  return (
    <Input
      type='text'
      color='primary'
      variant='bordered'
      value={itemValue}
      onChange={handleInputChange}
    />
  )
}

export default function ReportEditor() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const { data: templateData } = useFetcher(() =>
    getTemplateLatestVersionByService(state.idService)
  )
  const { data: searchData } = useFetcher(() =>
    searchResultByDetAttention(state.idDetAttention)
  )

  const [template, setTemplate] = useState({})
  const [loading, setLoading] = useState(false)

  const onInputChange = (sectionUid, rowIndex, columnUid, value) => {
    setTemplate((prevTemplate) => {
      const newTemplate = { ...prevTemplate }
      newTemplate.sections = [...prevTemplate.sections]

      const sectionIndex = newTemplate.sections.findIndex(
        (section) => section.uid === sectionUid
      )

      if (sectionIndex !== -1) {
        const sectionCopy = { ...newTemplate.sections[sectionIndex] }
        const rowCopy = { ...sectionCopy.rows[rowIndex] }

        rowCopy[columnUid] = value

        sectionCopy.rows = [...sectionCopy.rows]
        sectionCopy.rows[rowIndex] = rowCopy

        newTemplate.sections[sectionIndex] = sectionCopy
      }
      return newTemplate
    })
  }

  const onItemInputChange = (sectionUid, itemIndex, field, newValue) => {
    setTemplate((prevTemplate) => {
      const newTemplate = { ...prevTemplate }
      newTemplate.sections = [...prevTemplate.sections]

      const sectionIndex = newTemplate.sections.findIndex(
        (section) => section.uid === sectionUid
      )

      if (sectionIndex !== -1) {
        const sectionCopy = { ...newTemplate.sections[sectionIndex] }
        const itemsCopy = [...sectionCopy.items]

        if (itemIndex >= 0 && itemIndex < itemsCopy.length) {
          const itemCopy = { ...itemsCopy[itemIndex] }
          itemCopy[field] = newValue

          itemsCopy[itemIndex] = itemCopy
          sectionCopy.items = itemsCopy
          newTemplate.sections[sectionIndex] = sectionCopy
        }
      }
      return newTemplate
    })
  }

  const handleAddResult = async () => {
    const data = {
      idDetAtencion: state.idDetAttention,
      diagnostico: JSON.stringify(template),
      idReferencia: 0
    }

    setLoading(true)
    const result = await addResult(data)
    setLoading(false)

    if (result.isSuccess) {
      await changeStatus(state.idDetAttention, 'PE')
      socket.emit('client:newAction', { action: 'New Informe' })

      toast.success(result.message)
      navigate('/informeslaboratorio')
    } else {
      toast.error(result.message)
    }
  }

  const handleUpdateResult = async () => {
    const data = {
      idDetAtencion: state.idDetAttention,
      diagnostico: JSON.stringify(template)
    }

    setLoading(true)
    const result = await updateResult(data)
    setLoading(false)

    if (result.isSuccess) {
      toast.success(result.message)
      socket.emit('client:newAction', { action: "New Informe" })
      navigate('/informeslaboratorio')
    } else {
      toast.error(result.message)
    }
  }

  useEffect(() => {
    if (templateData.isSuccess && templateData.data) {
      let loadedTemplate

      if (state.operation === 'new') {
        loadedTemplate = JSON.parse(templateData.data.formato)
      } else if (state.operation === 'edit') {
        loadedTemplate = JSON.parse(searchData.data.diagnostico)
      }

      setTemplate(loadedTemplate)
    } else if (templateData.isSuccess && !templateData.data) {
      toast.error('Sin plantilla para este servicio. Por favor, cree una.')
      navigate('/informeslaboratorio')
    }
  }, [searchData])

  return (
    <>
      <CardBody>
        <div className='grid grid-cols-4 px-4 mb-4 gap-4 items-end'>
          <Input
            label='Nombre de la plantilla'
            color='primary'
            size='lg'
            variant='underlined'
            className='col-span-2'
            value={template.templateName || ''}
            isReadOnly
          />
          <Input
            label='Categoría'
            color='primary'
            variant='underlined'
            value={templateData.data?.nombre_categoria || ''}
            isReadOnly
          />
          <Input
            label='Servicio'
            color='primary'
            variant='underlined'
            value={templateData.data?.nombre_servicio || ''}
            isReadOnly
          />
        </div>
        {template.sections &&
          template.sections.map((section) => (
            <div key={section.uid}>
              <div className='grid grid-cols-4 px-4 mb-4'>
                <Input
                  type='text'
                  label='Título de la Sección'
                  color='primary'
                  variant='underlined'
                  value={section.title}
                  isReadOnly
                />
              </div>
              {template.type === 'fourColumns' ? (
                <div className='relative px-4 mb-4'>
                  <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                    <thead className='text-xs text-gray-500 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                      <tr>
                        {section.columns.map((col) =>
                          col.uid !== 'acciones' ? (
                            <th key={col.uid} className='py-3 px-4'>
                              {col.title}
                            </th>
                          ) : null
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, index) => (
                        <tr key={index} className='bg-white dark:bg-gray-800'>
                          {section.columns.map((column) =>
                            column.uid !== 'acciones' ? (
                              <td
                                key={
                                  section.uid + '_' + column.uid + '_' + index
                                }
                                className='p-3 text-slate-700'
                              >
                                {column.editable ? (
                                  <InputTable
                                    value={row[column.uid]}
                                    onChange={(value) =>
                                      onInputChange(
                                        section.uid,
                                        index,
                                        column.uid,
                                        value
                                      )
                                    }
                                  />
                                ) : (
                                  row[column.uid]
                                )}
                              </td>
                            ) : null
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='grid grid-cols-2 px-4 gap-4 mb-4'>
                  {section.items.map((item, index) => (
                    <div className='flex col-span-1 gap-4' key={index}>
                      <Input
                        isReadOnly
                        radius='lg'
                        value={item.key}
                        color='primary'
                        variant='faded'
                      />
                      <Button
                        isIconOnly
                        color='primary'
                        variant='faded'
                        disableAnimation
                      >
                        <ChevronsRight size={20} />
                      </Button>
                      <InputItem
                        value={item.value}
                        onChange={(value) =>
                          onItemInputChange(section.uid, index, 'value', value)
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </CardBody>
      <CardFooter className='flex justify-end gap-4'>
        <Button
          color='danger'
          variant='light'
          onPress={() => navigate('/informeslaboratorio')}
        >
          Cancelar
        </Button>
        <Button
          color='primary'
          onPress={
            state.operation === 'new' ? handleAddResult : handleUpdateResult
          }
          isLoading={loading}
        >
          Guardar
        </Button>
      </CardFooter>
    </>
  )
}
