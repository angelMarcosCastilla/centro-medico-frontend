import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@nextui-org/react'
import { ListX, Plus, Trash2 } from 'lucide-react'

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
          label='Nombre de la sección'
          color='primary'
          variant='underlined'
          value={section.title}
          onChange={(e) => onSectionChange(section.uid, e.target.value)}
        />
        <Button
          color='danger'
          variant='light'
          radius='full'
          startContent={<ListX size={20} />}
          onPress={() => onRemoveSection(section.uid)}
        >
          Eliminar sección
        </Button>
      </div>
      <Table aria-label='Example table with custom cells' shadow='none'>
        <TableHeader columns={section.columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.title}</TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {section.rows.map((row, index) => (
            <TableRow key={index}>
              {section.columns.map((column) => (
                <TableCell key={column.uid + '_' + index}>
                  {column.uid !== 'acciones' ? (
                    <Input
                      type='text'
                      maxLength={100}
                      value={row[column.uid]}
                      onChange={(e) =>
                        onInputChange(
                          section.uid,
                          index,
                          column.uid,
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div className='flex justify-center gap-2'>
                      <Tooltip content='Eliminar fila' color='danger'>
                        <span
                          className='text-danger cursor-pointer active:opacity-50'
                          onClick={() => onRemoveRow(section.uid, index)}
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
          onPress={() => onAddRow(section.uid)}
        >
          Agregar nueva fila
        </Button>
      </div>
    </>
  )
}
