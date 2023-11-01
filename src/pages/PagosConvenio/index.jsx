import { useCallback, useMemo, useRef, useState } from 'react'
import { useFetcher } from '../../hook/useFetcher'
import { usePagination } from '../../hook/usePagination'
import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import { capitalize } from '../../utils'
import { ChevronDownIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  getListofPaymentsbyAgreement,
  paymentConvenios
} from '../../services/pay'
import DateTimeClock from '../../components/DateTimeClock'
import { formatDate } from '../../utils/date'
import { getCompanyAgreement } from '../../services/company'

const columns = [
  { name: 'EMPRESA', uid: 'razon_social', sortable: true },
  { name: 'PACIENTE', uid: 'paciente', sortable: true },
  { name: 'EMISIÓN', uid: 'fecha_hora_emision', sortable: true },
  { name: 'SALDO', uid: 'saldo', sortable: true }
]

const INITIAL_VISIBLE_COLUMNS = [
  'razon_social',
  'paciente',
  'fecha_hora_emision',
  'saldo'
]

export default function PagosConvenio() {
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const { data, refresh } = useFetcher(getListofPaymentsbyAgreement)
  const { data: companyData } = useFetcher(getCompanyAgreement)

  const [selectedCompany, setSelectedCompany] = useState(new Set([]))
  const selectedPayments = useRef([])

  const [loadingPayment, setLoadingPayment] = useState(false)

  const paymentsByCompany = useMemo(() => {
    const companyId = Array.from(selectedCompany)[0]

    if (!companyId) return []

    return data.filter((item) => item.idempresa === parseInt(companyId))
  }, [selectedCompany, data])

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const {
    items,
    onNextPage,
    onPreviousPage,
    rowsPerPage,
    onRowsPerPageChange,
    page,
    pages,
    setPage
  } = usePagination(paymentsByCompany)

  const renderCell = useCallback((detail, columnKey) => {
    const cellValue = detail[columnKey]

    switch (columnKey) {
      case 'fecha_hora_emision':
        return formatDate(cellValue, true)
      default:
        return cellValue
    }
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Select
            label='Empresas'
            className='max-w-xs'
            size='sm'
            value={selectedCompany}
            onSelectionChange={setSelectedCompany}
          >
            {companyData.map((company) => (
              <SelectItem key={company.idempresa} value={company.idempresa}>
                {company.razon_social}
              </SelectItem>
            ))}
          </Select>
          <div className='flex gap-3'>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button
                  endContent={<ChevronDownIcon className='text-small' />}
                  variant='flat'
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode='multiple'
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className='capitalize'>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {paymentsByCompany.length} pagos pendientes
          </span>
          <label className='flex items-center text-default-400 text-small'>
            Filas por página:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              defaultValue={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [
    visibleColumns,
    onRowsPerPageChange,
    companyData,
    selectedCompany,
    paymentsByCompany.length
  ])

  const bottomContent = useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-between items-center'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className='hidden sm:flex w-[30%] justify-end gap-2'>
          <Button
            isDisabled={pages === 1}
            variant='flat'
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button isDisabled={pages === 1} variant='flat' onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    )
  }, [items.length, page, pages])

  const handleCancelPayment = async () => {
    if (selectedPayments.current.length === 0) {
      return toast.error('Debe seleccionar al menos un pago')
    }

    try {
      setLoadingPayment(true)
      await paymentConvenios(selectedPayments.current)
      refresh()
      toast.success('Pagos completados correctamente')
    } catch (error) {
      toast.error('Ocurrió un error al completar los pagos')
    } finally {
      selectedCompany.current = []
      setLoadingPayment(false)
    }
  }

  const tableKey = useMemo(() => {
    selectedPayments.current = []
    return crypto.randomUUID()
  }, [selectedCompany])

  const emptyContentMessage =
    !data.length || (selectedCompany.size && !paymentsByCompany.length)
      ? 'No se encontraron pagos pendientes'
      : 'Seleccione una empresa para visualizar los pagos pendientes'

  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Pagos por Convenio</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='mb-2'>{topContent}</div>
        <Table
          key={tableKey}
          aria-label='Tabla que lista los pagos pendientes por convenios'
          isHeaderSticky
          removeWrapper
          bottomContent={bottomContent}
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'max-h-[600px]'
          }}
          selectionMode='multiple'
          onSelectionChange={(value) => {
            if (value === 'all') {
              selectedPayments.current = paymentsByCompany.map(
                (item) => item.idpago
              )
            } else {
              selectedPayments.current = Array.from(value)
            }
          }}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === 'actions' ? 'center' : 'start'}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={emptyContentMessage} items={items}>
            {(item) => (
              <TableRow key={item.idpago}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
      <CardFooter className='flex justify-end'>
        <Button
          isLoading={loadingPayment}
          color='primary'
          onClick={handleCancelPayment}
        >
          Completar pagos
        </Button>
      </CardFooter>
    </>
  )
}
