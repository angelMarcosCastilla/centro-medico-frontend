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
  Tooltip
} from '@nextui-org/react'
import { Plus, Trash2 } from 'lucide-react'

export default function Plantillas() {
  const [template, setTemplate] = useState(tableBaseTemplate)

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

  return (
    <>
      <CardBody>
        <Table aria-label='Example table with custom cells' shadow='none'>
          <TableHeader columns={template.columns}>
            {(column) => (
              <TableColumn key={column.uid}>{column.title}</TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {template.rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type='text'
                    maxLength={100}
                    value={row.analisis}
                    onChange={(e) => handleInputChange(e, index, 'analisis')}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type='text'
                    maxLength={100}
                    value={row.resultado}
                    onChange={(e) => handleInputChange(e, index, 'resultado')}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type='text'
                    maxLength={100}
                    value={row.unidad}
                    onChange={(e) => handleInputChange(e, index, 'unidad')}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type='text'
                    maxLength={100}
                    value={row.rangoReferencial}
                    onChange={(e) =>
                      handleInputChange(e, index, 'rangoReferencial')
                    }
                  />
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex justify-center px-3'>
          <Button
            className='w-full'
            color='primary'
            radius='full'
            size='lg'
            variant='light'
            startContent={<Plus />}
            onPress={handleAddRow}
          >
            Agregar nueva fila
          </Button>
        </div>
      </CardBody>
      <CardFooter className='flex justify-end gap-4'>
        <Button color='danger' size='lg' variant='light'>
          Cancelar
        </Button>
        <Button color='primary' size='lg'>
          Guardar
        </Button>
      </CardFooter>
    </>
  )
}
