import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  CardBody,
  CardFooter,
  Chip,
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
import { ChevronDownIcon } from 'lucide-react'
import { useFetcher } from '../hook/useFetcher'
import { usePagination } from '../hook/usePagination'
import { capitalize } from '../utils'
import { listState, statusColorMap } from '../constants/state'
import { getCompanyAgreement } from '../services/service'

const columns = [
  { name: 'ID', uid: 'idpago', sortable: true },
  { name: 'Empresa', uid: 'razon_social', sortable: true },
  { name: 'Paciente', uid: 'paciente', sortable: true },
  { name: 'Emision', uid: 'fecha_hora_emision', sortable: true },
  { name: 'Saldo', uid: 'saldo', sortable: true }
]

const INITIAL_VISIBLE_COLUMNS = [
  'razon_social',
  'paciente',
  'fecha_hora_emision',
  'saldo'
]

export default function PaymentsAgreementTable({ useFecherFunction }) {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'ascending'
  })
  const { data } = useFetcher(useFecherFunction)
  const [selectedCompany, setSelectedCompany] = useState(new Set([]))
  const { data: companyData } = useFetcher(getCompanyAgreement)

  const paymeentbyCompany = useMemo(() => {
    const idcompany = Array.from(selectedCompany)[0]
    if (!idcompany) return []
    return data.filter((item) => item.idempresa === parseInt(idcompany))
  }, [selectedCompany, data])

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredPatients = [...data]

    if (hasSearchFilter) {
      filteredPatients = filteredPatients.filter((detail) =>
        detail.razon_social.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    return filteredPatients
  }, [data, filterValue])

  const {
    items,
    page,
    pages,
    rowsPerPage,
    onNextPage,
    onPreviousPage,
    onRowsPerPageChange,
    setPage
  } = usePagination(filteredItems)

  const renderCell = useCallback((detail, columnKey) => {
    const cellValue = detail[columnKey]
    const estadoTexto = listState[cellValue]
    const classChip = statusColorMap[cellValue]

    switch (columnKey) {
      case 'estado':
        return (
          <Chip className={`capitalize ${classChip}`} size='sm' variant='flat'>
            {capitalize(estadoTexto)}
          </Chip>
        )

      default:
        return cellValue
    }
  }, [])

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value)
    } else {
      setFilterValue('')
    }
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Select
            label='Empresas'
            className='max-w-xs'
            value={selectedCompany}
            onSelectionChange={(value) => setSelectedCompany(value)}
          >
            {companyData.map((company) => (
              <SelectItem key={company.idempresa} value={company.idempresa}>
                {company.razon_social}
              </SelectItem>
            ))}
          </Select>
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
              {columns.map((column) => {
                if (column.uid === 'estado') return null
                return (
                  <DropdownItem key={column.uid} className='capitalize'>
                    {capitalize(column.name)}
                  </DropdownItem>
                )
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {data.length} Empresas
          </span>
          <label className='flex items-center text-default-400 text-small'>
            Filas por página:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              value={rowsPerPage}
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
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    companyData,
    selectedCompany,
    data.length,
    onSearchChange,
    hasSearchFilter
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
  }, [items.length, page, pages, hasSearchFilter])

  return (
    <CardBody>
      <Table
        aria-label='Example table with custom cells, pagination and sorting'
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement='outside'
        classNames={{
          wrapper: 'max-h-[600px]'
        }}
        sortDescriptor={sortDescriptor}
        selectionMode='multiple'
        topContent={topContent}
        topContentPlacement='outside'
        shadow='none'
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={'No se encontraron pacientes'}
          items={paymeentbyCompany}
        >
          {(item) => (
            <TableRow key={crypto.randomUUID().toString()}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className='flex justify-end'>
        <CardFooter>
          <Button style={{ marginLeft: 'auto' }} color='primary'>
            Cancelar pagos
          </Button>
        </CardFooter>
      </div>
    </CardBody>
  )
}
