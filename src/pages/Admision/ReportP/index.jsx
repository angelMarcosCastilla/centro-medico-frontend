import {
  Button,
  CardBody,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'

import { Search, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { listClientforDate } from '../../../services/admission'

export default function ReportP() {
  const currentDate = new Date()
    .toLocaleDateString()
    .split('/')
    .reverse()
    .join('-')

  const [documentNumber, setDocumentNumber] = useState('')
  const [startDate, setStartDate] = useState(currentDate)
  const [endDate, setEndDate] = useState(currentDate)
  const [dataTable, setDataTable] = useState([])

  const [isSearchEnabled, setIsSearchEnabled] = useState(false)
  const handleSearch = async () => {
    if ( !startDate || !endDate) {
      toast.error('Por favor, complete todos los campos.')
      return
    }

    const result = await listClientforDate( startDate, endDate,documentNumber)

    if (result.length) {
      setDataTable(result)
    } else {
      setDataTable([])
      toast.error('No se encontraron resultados.')
    }
    console.log(result)
  }

  const handleReset = () => setDataTable([])

  useEffect(() => {
    if (!documentNumber || !startDate || !endDate) {
      setIsSearchEnabled(false)
    } else {
      setIsSearchEnabled(true)
    }
  }, [documentNumber, startDate, endDate])

  return (
    <CardBody>
      <div className='grid grid-cols-4 items-center gap-4 mb-4'>
        <Input
          type='text'
          label='Número de Documento'
          placeholder='Ingrese el número de documento'
          value={documentNumber}
          onValueChange={setDocumentNumber}
        />
        <Input
          type='date'
          label='Fecha de inicio'
          placeholder='dd/mm/aaaa'
          value={startDate}
          onValueChange={setStartDate}
          max={currentDate}
        />
        <Input
          type='date'
          label='Fecha de fin'
          placeholder='dd/mm/aaaa'
          value={endDate}
          onValueChange={setEndDate}
          max={currentDate}
        />
        <div className='flex justify-center gap-4'>
          <Button
           //  isDisabled={!isSearchEnabled}
            
            startContent={<Search size={20} />}
            onPress={handleSearch}
          >
            Buscar
          </Button>
          <Button
            isDisabled={!dataTable.length}
            
            startContent={<SearchX size={20} />}
            onPress={handleReset}
          >
            Limpiar
          </Button>
        </div>
      </div>

      <Table
        isStriped
        removeWrapper
        aria-label='Tabla de atención realizadas de un área en un intervalo de fechas'
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Cliente</TableColumn>
          <TableColumn>Comprobante</TableColumn>
          <TableColumn>Documento</TableColumn>
          <TableColumn>Fecha Emision</TableColumn>
          <TableColumn>Fecha Pago</TableColumn>
          <TableColumn>MONTO Total</TableColumn>
        </TableHeader>
        <TableBody emptyContent='Realiza una búsqueda para ver los resultados'>
          {dataTable.map((el, index) => (
            <TableRow key={el.idpago}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{el.cliente}</TableCell>
              <TableCell>
                {el.tipo_comprobante === 'F' ? 'Factura' : 'Boleta'}
              </TableCell>
              <TableCell>
                {el.tipo_comprobante === 'B'
                  ? el.num_documento
                  : el.ruc}
              </TableCell>
              <TableCell>
                {el.fecha_hora_emision
                  ? new Date(el.fecha_hora_emision).toLocaleDateString()
                  : ''}
              </TableCell>
              <TableCell>
                {el.fecha_hora_pago
                  ? new Date(el.fecha_hora_pago).toLocaleDateString()
                  : ''}
              </TableCell>
              <TableCell>{el.monto_total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardBody>
  )
}
