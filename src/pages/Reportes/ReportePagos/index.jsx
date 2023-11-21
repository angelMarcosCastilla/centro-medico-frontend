import {
  Button,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue
} from '@nextui-org/react'

import { Search, SearchX, Share } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { formatDate } from '../../../utils/date'
import { getPaymentsByDateRange } from '../../../services/report'
import DateTimeClock from '../../../components/DateTimeClock'
import { TIPO_COMPROBANTE } from '../../../constants/state'
import { BASE_URL_WS } from '../../../config'

export default function ReportePagos() {
  const currentDate = new Date()
    .toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .split('/')
    .reverse()
    .join('-')

  const [documentNumber, setDocumentNumber] = useState('')
  const [startDate, setStartDate] = useState(currentDate)
  const [endDate, setEndDate] = useState(currentDate)
  const [dataTable, setDataTable] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  const [isSearchEnabled, setIsSearchEnabled] = useState(false)
  const [searchData, setSearchData] = useState({
    documentNumber: null,
    startDate: null,
    endDate: null
  })

  const baseURL = `${BASE_URL_WS}/api/reportes/exportar/pagos/intervalo`
  const [URL, setURL] = useState(`${baseURL}/${startDate}/${endDate}`)

  const [page, setPage] = useState(1)
  const rowsPerPage = 15

  const pages = Math.ceil(dataTable.length / rowsPerPage) || 1

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return dataTable.slice(start, end)
  }, [page, dataTable])

  const saveSearchData = () => {
    setSearchData({
      documentNumber,
      startDate,
      endDate
    })
  }

  const handleSearch = async () => {
    try {
      setLoadingSearch(true)

      const result = await getPaymentsByDateRange(
        startDate,
        endDate,
        documentNumber || null
      )

      if (result.length) {
        setDataTable(result)
        saveSearchData()
      } else {
        setDataTable([])
        toast.error('No se encontraron resultados.')
      }
    } catch (err) {
      toast.err('Problemas al buscar')
    } finally {
      setLoadingSearch(false)
    }
  }

  const handleReset = () => setDataTable([])

  useEffect(() => {
    if (!startDate || !endDate) {
      setIsSearchEnabled(false)
    } else {
      setIsSearchEnabled(true)
    }
  }, [startDate, endDate])

  useEffect(() => {
    setURL(() => {
      if (documentNumber.trim() !== '') {
        return `${baseURL}/${searchData.startDate}/${searchData.endDate}?documento=${searchData.documentNumber}`
      } else {
        return `${baseURL}/${searchData.startDate}/${searchData.endDate}`
      }
    })
  }, [searchData])

  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Reporte de pagos</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='grid grid-cols-5 items-center gap-4 mb-4'>
          <Input
            isClearable
            type='text'
            label='Número de documento'
            placeholder='Enter para buscar'
            maxLength={20}
            value={documentNumber}
            onValueChange={setDocumentNumber}
            onKeyDown={(e) => {
              if (e.keyCode === 13 && documentNumber.trim() !== '') {
                handleSearch()
              }
            }}
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
          <div className='flex justify-center gap-4 col-span-2'>
            <Button
              isLoading={loadingSearch}
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
              href={URL}
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
          aria-label='Tabla de pagos totales realizados o de un cliente en un intervalo de fechas'
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
            <TableColumn key='cliente'>CLIENTE</TableColumn>
            <TableColumn key='tipo_comprobante'>COMPROBANTE</TableColumn>
            <TableColumn key='num_documento'>DOCUMENTO</TableColumn>
            <TableColumn key='fecha_hora_emision'>
              FECHA Y HORA EMISIÓN
            </TableColumn>
            <TableColumn key='fecha_hora_pago'>FECHA Y HORA PAGO</TableColumn>
            <TableColumn key='monto_total'>MONTO TOTAL</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent='Realiza una búsqueda para ver los resultados'
            items={items}
          >
            {(item) => (
              <TableRow key={item?.idpago}>
                {(columnKey) => {
                  let columnValue

                  switch (columnKey) {
                    case 'tipo_comprobante':
                      columnValue =
                        TIPO_COMPROBANTE[getKeyValue(item, columnKey)]
                      break
                    case 'num_documento':
                      columnValue =
                        getKeyValue(item, 'tipo_comprobante') === 'B' ||
                        getKeyValue(item, 'tipo_comprobante') === 'S'
                          ? getKeyValue(item, columnKey)
                          : getKeyValue(item, 'ruc')
                      break
                    case 'fecha_hora_emision':
                      columnValue = formatDate(
                        getKeyValue(item, columnKey),
                        true
                      )
                      break
                    case 'fecha_hora_pago':
                      columnValue = formatDate(
                        getKeyValue(item, columnKey),
                        true
                      )
                      break
                    default:
                      columnValue = getKeyValue(item, columnKey)
                      break
                  }
                  return <TableCell>{columnValue}</TableCell>
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </>
  )
}
