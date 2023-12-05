import { useEffect, useState } from 'react'
import {
  columnTemplate,
  keyValueTemplate,
  templateFormats
} from '../../../constants/template'
import {
  Button,
  Input,
  CardBody,
  CardFooter,
  Select,
  SelectItem
} from '@nextui-org/react'
import { ListPlus } from 'lucide-react'
import {
  createTemplate,
  updateTemplate,
  getTemplateLatestVersionByService
} from '../../../services/template'
import { toast } from 'sonner'
import TypeTemplate from './TypeTemplate'
import { useLocation, useNavigate } from 'react-router-dom'
import { validateColumnTemplate, validateKeyValueTemplate } from '../utils'

export default function TemplateEditor() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [typesTemplate, setTypesTemplate] = useState(new Set([]))
  const [template, setTemplate] = useState({})
  const [originalTemplate, setOriginalTemplate] = useState({})
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFormatChange = (newSelectedFormat) => {
    const currentTemplateName = template.templateName

    const formatTemplates = {
      fourColumns: columnTemplate,
      keysValues: keyValueTemplate
    }

    const selectedTemplate =
      state.operation === 'new'
        ? formatTemplates[newSelectedFormat]
        : originalTemplate.type === newSelectedFormat
        ? originalTemplate
        : formatTemplates[newSelectedFormat]

    selectedTemplate.templateName = currentTemplateName

    setTemplate(selectedTemplate)
    setSections(selectedTemplate.sections)
  }

  const handleInputChange = (sectionUid, rowUid, field, newValue) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.uid === sectionUid) {
          const updatedRows = section.rows.map((row) => {
            if (row.uid === rowUid) {
              return {
                ...row,
                [field]: newValue
              }
            } else {
              return row
            }
          })

          return {
            ...section,
            rows: updatedRows
          }
        } else {
          return section
        }
      })
    )
  }

  const handleInputChangeKeyValue = (sectionUid, itemUid, field, newValue) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.uid === sectionUid) {
          const updatedItems = section.items.map((item) => {
            if (item.uid === itemUid) {
              return {
                ...item,
                [field]: newValue
              }
            } else {
              return item
            }
          })

          return {
            ...section,
            items: updatedItems
          }
        } else {
          return section
        }
      })
    )
  }

  const handleSectionChange = (sectionUid, newName) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.uid === sectionUid) {
          return {
            ...section,
            title: newName
          }
        } else {
          return section
        }
      })
    )
  }

  const handleAddRow = (sectionUid) => {
    const newRow = {
      uid: Date.now().toString(),
      analisis: '',
      resultado: '',
      unidad: '',
      rangoReferencial: ''
    }

    const updatedSections = sections.map((section) => {
      if (section.uid === sectionUid) {
        return {
          ...section,
          rows: [...section.rows, newRow]
        }
      } else {
        return section
      }
    })

    setSections(updatedSections)
  }

  const handleRemoveRow = (sectionUid, rowUid) => {
    const updatedSections = sections.map((section) => {
      if (section.uid === sectionUid && section.rows.length > 1) {
        const updatedRows = section.rows.filter((row) => row.uid !== rowUid)
        return {
          ...section,
          rows: updatedRows
        }
      } else {
        return section
      }
    })

    setSections(updatedSections)
  }

  const handleAddItem = (sectionUid) => {
    const newItem = {
      uid: Date.now().toString(),
      key: '',
      value: ''
    }

    const updatedSections = sections.map((section) => {
      if (section.uid === sectionUid) {
        return {
          ...section,
          items: [...section.items, newItem]
        }
      } else {
        return section
      }
    })

    setSections(updatedSections)
  }

  const handleRemoveItem = (sectionUid, rowUid) => {
    const updatedSections = sections.map((section) => {
      if (section.uid === sectionUid && section.items.length > 1) {
        const updatedItems = section.items.filter((item) => item.uid !== rowUid)

        return {
          ...section,
          items: updatedItems
        }
      } else {
        return section
      }
    })

    setSections(updatedSections)
  }

  const handleAddSection = () => {
    let newSection = {
      uid: Date.now().toString(),
      title: ''
    }

    if (template.type === 'fourColumns') {
      newSection = {
        ...newSection,
        columns: [
          {
            uid: 'analisis',
            title: 'ANÁLISIS',
            editable: false
          },
          {
            uid: 'resultado',
            title: 'RESULTADO',
            editable: true
          },
          {
            uid: 'unidad',
            title: 'UNIDAD',
            editable: false
          },
          {
            uid: 'rangoReferencial',
            title: 'RANGO REFERENCIAL',
            editable: false
          }
        ],
        rows: [
          {
            uid: Date.now().toString(),
            analisis: '',
            resultado: '',
            unidad: '',
            rangoReferencial: ''
          }
        ]
      }
    } else {
      newSection = {
        ...newSection,
        items: [
          {
            uid: Date.now().toString(),
            key: '',
            value: ''
          }
        ]
      }
    }

    setSections([...sections, newSection])
  }

  const handleRemoveSection = (sectionUid) => {
    if (sections.length === 1) return

    const updatedSections = sections.filter(
      (section) => section.uid !== sectionUid
    )

    setSections(updatedSections)
  }

  const handleAddTemplate = async () => {
    setLoading(true)

    const updatedTemplate = {
      ...template,
      sections
    }

    const isValid =
      template.type === 'fourColumns'
        ? validateColumnTemplate(updatedTemplate)
        : validateKeyValueTemplate(updatedTemplate)
    if (!isValid) {
      setLoading(false)
      return toast.error('Complete todos los datos')
    }

    const data = {
      idServicio: state.service.idservicio,
      formato: JSON.stringify(updatedTemplate)
    }

    try {
      let result

      if (state.operation === 'new') {
        result = await createTemplate(data)
      } else {
        result = await updateTemplate(data)
      }

      if (result.isSuccess) {
        toast.success(result.message)
        navigate('/plantillas', { replace: true })
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar la plantilla')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (state.operation === 'new') {
      setTemplate({ templateName: '' })
    } else {
      getTemplateLatestVersionByService(state.service.idservicio).then(
        (result) => {
          if (result.data) {
            const formato = JSON.parse(result.data.formato)
            setTemplate(formato)
            setOriginalTemplate(formato)
            setTypesTemplate(new Set([formato.type]))
            setSections(formato.sections)
          } else {
            toast.error('No encontré una plantilla para editar')
            navigate('/plantillas', { replace: true })
          }
        }
      )
    }
  }, [])

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
            onChange={(e) =>
              setTemplate({ ...template, templateName: e.target.value })
            }
          />
          <Input
            isReadOnly
            label='Servicio'
            color='primary'
            variant='underlined'
            className='col-span-1'
            value={state.service.servicio}
          />
          <Select
            label='Formato'
            color='primary'
            variant='underlined'
            disallowEmptySelection={true}
            selectedKeys={typesTemplate}
            className='col-span-1'
            onSelectionChange={(selectedKeys) => {
              setTypesTemplate(selectedKeys)
              handleFormatChange(selectedKeys.currentKey)
            }}
          >
            {templateFormats.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        {!template.sections && (
          <div className='flex w-full h-full justify-center items-center'>
            <p className='text-gray-400'>
              Seleccione un formato para crear una plantilla
            </p>
          </div>
        )}
        {
          <TypeTemplate
            typeTemplate={template.type}
            sections={sections}
            onInputChange={handleInputChange}
            onInputChangeKeyValue={handleInputChangeKeyValue}
            onSectionChange={handleSectionChange}
            onAddRow={handleAddRow}
            onRemoveRow={handleRemoveRow}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onRemoveSection={handleRemoveSection}
          />
        }
        {template.sections && (
          <div className='flex px-4'>
            <Button
              color='primary'
              variant='light'
              radius='full'
              startContent={<ListPlus size={20} />}
              onPress={handleAddSection}
            >
              Nueva sección
            </Button>
          </div>
        )}
      </CardBody>
      <CardFooter className='flex justify-end gap-4'>
        <Button
          color='danger'
          variant='light'
          onClick={() => navigate('/plantillas', { replace: true })}
        >
          Cancelar
        </Button>
        <Button color='primary' onClick={handleAddTemplate} isLoading={loading}>
          Guardar
        </Button>
      </CardFooter>
    </>
  )
}
