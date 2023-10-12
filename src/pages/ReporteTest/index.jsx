import {
  Button,
  CardBody,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import { getAttentionsByAreaAndDateRange } from '../../services/report'
import { useFetcher } from '../../hook/useFetcher'
import { getAllAreas } from '../../services/area'
import { Search, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ReporteTest() {
  const { data: areasData } = useFetcher(getAllAreas)
  const currentDate = new Date()
    .toLocaleDateString()
    .split('/')
    .reverse()
    .join('-')
  const [selectedArea, setSelectedArea] = useState(new Set([]))
  const [startDate, setStartDate] = useState(currentDate)
  const [endDate, setEndDate] = useState(currentDate)
  const [dataTable, setDataTable] = useState([])

  const [isSearchEnabled, setIsSearchEnabled] = useState(false)

  const handleSearch = async () => {
    const result = await getAttentionsByAreaAndDateRange(
      selectedArea.currentKey,
      startDate,
      endDate
    )

    if (result.length) {
      setDataTable(result)
    } else {
      toast.error('No se encontraron resultados')
    }
  }

  const handleReset = () => setDataTable([])

  useEffect(() => {
    if (!selectedArea.currentKey || !startDate || !endDate) {
      setIsSearchEnabled(false)
    } else {
      setIsSearchEnabled(true)
    }
  }, [selectedArea, startDate, endDate])

  return (
    <CardBody>
      <div className='grid grid-cols-4 items-center gap-4 mb-4'>
        <Select
          label='Área'
          selectedKeys={selectedArea}
          onSelectionChange={setSelectedArea}
        >
          {areasData.map((area) => (
            <SelectItem key={area.idarea}>{area.nombre_area}</SelectItem>
          ))}
        </Select>
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
            isDisabled={!isSearchEnabled}
            color='primary'
            startContent={<Search size={20} />}
            onPress={handleSearch}
          >
            Buscar
          </Button>
          <Button
            isDisabled={!dataTable.length}
            color='danger'
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
          <TableColumn>PACIENTE</TableColumn>
          <TableColumn>ÁREA</TableColumn>
          <TableColumn>CATEGORÍA</TableColumn>
          <TableColumn>SERVICIO</TableColumn>
          <TableColumn>MONTO PAGADO</TableColumn>
          <TableColumn>DESCUENTO</TableColumn>
          <TableColumn>ESTADO</TableColumn>
        </TableHeader>
        <TableBody emptyContent='Realiza una búsqueda para ver los resultados'>
          {dataTable.map((el, index) => (
            <TableRow key={el.iddetatencion}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{el.paciente}</TableCell>
              <TableCell>{el.nombre_area}</TableCell>
              <TableCell>{el.nombre_categoria}</TableCell>
              <TableCell>{el.nombre_servicio}</TableCell>
              <TableCell>{el.precio_pagado}</TableCell>
              <TableCell>{el.descuento || '---'}</TableCell>
              <TableCell>{el.estado}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardBody>
  )
}
