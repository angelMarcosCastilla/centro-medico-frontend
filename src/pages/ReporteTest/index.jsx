import {
  Button,
  CardBody,
  Input,
  Link,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue
} from '@nextui-org/react'
import { getAttentionsByAreaAndDateRange } from '../../services/report'
import { useFetcher } from '../../hook/useFetcher'
import { getAllAreas } from '../../services/area'
import { Search, SearchX, Share } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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

  const [page, setPage] = useState(1)
  const rowsPerPage = 15

  const pages = Math.ceil(dataTable.length / rowsPerPage) || 1

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return dataTable.slice(start, end)
  }, [page, dataTable])

  const handleSearch = async () => {
    const result = await getAttentionsByAreaAndDateRange(
      selectedArea.currentKey,
      startDate,
      endDate
    )

    if (result.length) {
      setDataTable(result)
    } else {
      setDataTable([])
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
      <div className='grid grid-cols-5 items-center gap-4 mb-4'>
        <Select
          disallowEmptySelection
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
        <div className='flex justify-center gap-4 col-span-2'>
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
          <Button
            href={`http://localhost:3000/api/reportes/exportar/area/${selectedArea.currentKey}/intervalo/${startDate}/${endDate}`}
            target='_blank'
            rel='noreferrer'
            as={Link}
            isDisabled={!dataTable.length}
            color='primary'
            startContent={<Share size={20} />}
          >
            Exportar
          </Button>
        </div>
      </div>

      <Table
        isStriped
        removeWrapper
        aria-label='Tabla de atención realizadas de un área en un intervalo de fechas'
        bottomContent={
          <div className='flex w-full justify-center'>
            <Pagination
              isCompact
              showControls
              showShadow
              color='primary'
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: 'min-h-[222px]'
        }}
      >
        <TableHeader>
          <TableColumn key='num_documento'>N° DOCUMENTO</TableColumn>
          <TableColumn key='paciente'>PACIENTE</TableColumn>
          <TableColumn key='nombre_area'>ÁREA</TableColumn>
          <TableColumn key='nombre_categoria'>CATEGORÍA</TableColumn>
          <TableColumn key='nombre_servicio'>SERVICIO</TableColumn>
          <TableColumn key='create_at'>FECHA Y HORA</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='Realiza una búsqueda para ver los resultados'
          items={items}
        >
          {(item) => (
            <TableRow key={item?.iddetatencion}>
              {(columnKey) => {
                let columnValue

                switch (columnKey) {
                  case 'create_at':
                    columnValue = getKeyValue(item, columnKey)
                      .replace('T', ' ')
                      .substring(0, 16)
                    break
                  default:
                    columnValue = getKeyValue(item, columnKey)
                }

                return <TableCell>{columnValue}</TableCell>
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardBody>
  )
}
