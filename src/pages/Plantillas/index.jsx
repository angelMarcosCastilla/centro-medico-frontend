import { useState } from 'react'
import { columnTemplate } from '../../constants/template'
import {
  Button,
  Input,
  CardBody,
  CardFooter,
  Select,
  SelectItem
} from '@nextui-org/react'
import { ListPlus } from 'lucide-react'
import ColumnTemplate from './components/ColumnTemplate'
// import { addTemplate } from '../../services/template'
// import { toast } from 'sonner'

export default function Plantillas() {
  const [template, setTemplate] = useState(columnTemplate)
  const [sections, setSections] = useState(template.sections)

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
      if (section.uid === sectionUid) {
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

  const handleAddSection = () => {
    const newSection = {
      uid: Date.now().toString(),
      title: 'Nombre de la sección',
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
      rows: []
    }

    setSections([...sections, newSection])
  }

  const handleRemoveSection = (sectionUid) => {
    const updatedSections = sections.filter(
      (section) => section.uid !== sectionUid
    )

    setSections(updatedSections)
  }

  const handleAddTemplate = async () => {
    // Testing
    /* const example = {
      idServicio: 96,
      numVersion: 1,
      formato: template
    }
    const result = await addTemplate(example)

    if (result.isSuccess) toast.success(result.message)
    else toast.error(result.message) */
    console.log(template)
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
            className='col-span-1'
            defaultSelectedKeys={['twh']}
          >
            <SelectItem key='twh'>Columnas</SelectItem>
            <SelectItem key='twoh'>Clave y valor</SelectItem>
          </Select>
        </div>
        {sections.map((section) => (
          <ColumnTemplate
            key={section.uid}
            section={section}
            onInputChange={handleInputChange}
            onSectionChange={handleSectionChange}
            onAddRow={handleAddRow}
            onRemoveRow={handleRemoveRow}
            onRemoveSection={handleRemoveSection}
          />
        ))}
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
