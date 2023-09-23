import { useState } from 'react'
import { tableBaseTemplate } from '../../constants/template'
import {
  TableBody,
  Table,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Input,
  CardBody,
  CardFooter,
  Tooltip,
  Select,
  SelectItem
} from '@nextui-org/react'
import { ListPlus, ListX, Plus, Trash2 } from 'lucide-react'
import { addTemplate } from '../../services/template'
import { toast } from 'sonner'

export default function Plantillas() {
  const [services, setServices] = useState([])
  const [template, setTemplate] = useState(tableBaseTemplate)
  const [sections, setSections] = useState([])

  const handleInputChange = (e, rowIndex, field) => {
    const updatedRows = [...template.rows]
    updatedRows[rowIndex][field] = e.target.value

    setTemplate({
      ...template,
      rows: updatedRows
    })
  }

  const handleAddRow = () => {
    const newRow = {
      analisis: 'Hola Mundo',
      resultado: 'Aqui estoy',
      unidad: 'Probando',
      rangoReferencial: 'Esto'
    }

    setTemplate({
      ...template,
      rows: [...template.rows, newRow]
    })
  }

  const handleRemoveRow = (indexToRemove) => {
    const updatedRows = template.rows.filter(
      (_, index) => index !== indexToRemove
    )

    setTemplate({
      ...template,
      rows: updatedRows
    })
  }

  const handleAddTemplate = async () => {
    // Testing
    const example = {
      idServicio: 96,
      numVersion: 1,
      formato: template
    }
    const result = await addTemplate(example)

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
          />
          <Select
            label='Servicio'
            color='primary'
            variant='underlined'
            className='col-span-1'
          >
            {services.map((service) => (
              <SelectItem key={service.idservicio}>
                {service.nombre_servicio}
              </SelectItem>
            ))}
          </Select>
          <Select
            label='Formato'
            color='primary'
            variant='underlined'
            className='col-span-1'
            defaultSelectedKeys={['twh']}
          >
            <SelectItem key='twh'>Tabla con encabezado</SelectItem>
            <SelectItem key='twoh'>Tabla sin encabezado</SelectItem>
          </Select>
        </div>
        <div className='grid grid-cols-4 px-4 gap-4'>
          <Input label='Nombre de la sección' color='primary' variant='underlined' />
        </div>
        <Table aria-label='Example table with custom cells' shadow='none'>
          <TableHeader columns={template.columns}>
            {(column) => (
              <TableColumn key={column.uid}>{column.title}</TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {template.rows.map((row, index) => (
              <TableRow key={index}>
                {template.columns.map((column) => (
                  <TableCell key={column.uid + '_' + index}>
                    {column.uid !== 'acciones' ? (
                      <Input
                        type='text'
                        maxLength={100}
                        value={row[column.uid]}
                        onChange={(e) =>
                          handleInputChange(e, index, column.uid)
                        }
                      />
                    ) : (
                      <div className='flex justify-center gap-2'>
                        <Tooltip content='Eliminar fila' color='danger'>
                          <span
                            className='text-danger cursor-pointer active:opacity-50'
                            onClick={() => handleRemoveRow(index)}
                          >
                            <Trash2 size={20} />
                          </span>
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex justify-center px-4 mb-4'>
          <Button
            className='w-full'
            color='primary'
            radius='full'
            variant='light'
            startContent={<Plus size={20} />}
            onPress={handleAddRow}
          >
            Agregar nueva fila
          </Button>
        </div>
        <div className='flex px-4'>
          <Button
            color='primary'
            variant='light'
            radius='full'
            startContent={<ListPlus size={20} />}
          >
            Añadir sección
          </Button>
          <Button
            color='danger'
            variant='light'
            radius='full'
            startContent={<ListX size={20} />}
          >
            Eliminar sección
          </Button>
        </div>
        {}
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
