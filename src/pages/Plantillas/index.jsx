import { useState } from 'react'
import {
  columnTemplate,
  keyValueTemplate,
  templateFormats
} from '../../constants/template'
import {
  Button,
  Input,
  CardBody,
  CardFooter,
  Select,
  SelectItem
} from '@nextui-org/react'
import { ListPlus } from 'lucide-react'
// import ColumnTemplate from './components/ColumnTemplate'
import { addTemplate } from '../../services/template'
import { toast } from 'sonner'
import TypeTemplate from './components/TypeTemplate'

export default function Plantillas() {
  const [typesTemplate, setTypesTemplate] = useState(new Set([]))
  const [template, setTemplate] = useState({ templateName: '' })
  const [sections, setSections] = useState([])

  const handleFormatChange = (selectedFormat) => {
    let selectedTemplate

    switch (selectedFormat) {
      case 'fourColumns':
        selectedTemplate = columnTemplate
        break
      case 'keysValues':
        selectedTemplate = keyValueTemplate
        break
    }

    setTemplate(selectedTemplate)
    setSections(selectedTemplate.sections)
  }

  const handleInputChange = (sectionUid, rowIndex, field, newValue) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.uid === sectionUid) {
          const updatedRows = section.rows.map((row, index) => {
            if (index === rowIndex) {
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

  const handleInputChangeKeyValue = (
    sectionUid,
    itemIndex,
    field,
    newValue
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.uid === sectionUid) {
          const updatedItems = section.items.map((item, index) => {
            if (index === itemIndex) {
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
      analisis: 'Hola Mundo',
      resultado: 'Aqui estoy',
      unidad: 'Probando',
      rangoReferencial: 'Esto'
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

  const handleRemoveRow = (sectionUid, indexToRemove) => {
    const updatedSections = sections.map((section) => {
      if (section.uid === sectionUid && section.rows.length > 1) {
        const updatedRows = section.rows.filter(
          (_, index) => index !== indexToRemove
        )
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
      key: 'key 1',
      value: 'value 1'
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

  const handleRemoveItem = (sectionUid, indexToRemove) => {
    const updatedSections = sections.map((section) => {
      if (section.uid === sectionUid && section.items.length > 1) {
        const updatedItems = section.items.filter(
          (_, index) => index !== indexToRemove
        )

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
      title: 'Nombre de la sección'
    }

    switch (typesTemplate.currentKey) {
      case 'fourColumns':
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
            },
            {
              uid: 'acciones',
              title: 'ACCIONES',
              editable: false
            }
          ],
          rows: [
            {
              analisis: 'Hola Mundo',
              resultado: 'Aqui estoy',
              unidad: 'Probando',
              rangoReferencial: 'Esto'
            }
          ]
        }
        break
      case 'keysValues':
        newSection = {
          ...newSection,
          items: [
            {
              key: 'key 1',
              value: 'value 1'
            }
          ]
        }
        break
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
    // Testing
    const updatedTemplate = {
      ...template,
      sections
    }

    const data = {
      idServicio: 96,
      numVersion: 1,
      formato: updatedTemplate
    }
    const result = await addTemplate(data)

    if (result.isSuccess) toast.success(result.message)
    else toast.error(result.message)
  }

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
            value={template.templateName}
            onChange={(e) =>
              setTemplate({ ...template, templateName: e.target.value })
            }
          />
          <Select
            label='Servicio'
            color='primary'
            variant='underlined'
            className='col-span-1'
          >
            <SelectItem>Servicio 1</SelectItem>
            <SelectItem>Servicio 2</SelectItem>
            <SelectItem>Servicio 3</SelectItem>
            <SelectItem>Servicio 4</SelectItem>
            <SelectItem>Servicio 5</SelectItem>
          </Select>
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
        {
          <TypeTemplate
            typeTemplate={typesTemplate.currentKey}
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
        {template && (
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
        <Button color='danger' variant='light'>
          Cancelar
        </Button>
        <Button color='primary' onClick={handleAddTemplate}>
          Guardar
        </Button>
      </CardFooter>
    </>
  )
}
