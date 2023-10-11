import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure
} from '@nextui-org/react'
import {
  ChevronDownIcon,
  SearchIcon,
  FileDown,
  FileCheck,
  FileX
} from 'lucide-react'
import { toast } from 'sonner'
import { useFetcher } from '../hook/useFetcher'
import { usePagination } from '../hook/usePagination'
import { capitalize } from '../utils'
import { listState, statusColorMap } from '../constants/state'
import { changeStatus } from '../services/admission'
import ModalCorrection from '../pages/Admision/Reportes/components/ModalCorrection'

const columns = [
  { name: 'ID', uid: 'iddetatencion', sortable: true },
  { name: 'PACIENTE', uid: 'paciente', sortable: true },
  { name: 'ÁREA', uid: 'nombre_area', sortable: true },
  { name: 'CATEGORÍA', uid: 'nombre_categoria', sortable: true },
  { name: 'SERVICIO', uid: 'nombre_servicio', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_VISIBLE_COLUMNS = [
  'paciente',
  'nombre_area',
  'nombre_categoria',
  'nombre_servicio',
  'estado',
  'acciones'
]

export default function ReportSendTable({ useFecherFunction }) {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [areasFilter, setAreasFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'ascending'
  })
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedDetAttentionId, setSelectedDetAttentionId] = useState(null)
  const { data, loading, refresh } = useFetcher(useFecherFunction)

  const areasOptions = data
    .reduce((result, current) => {
      const areaName = current.nombre_area
      if (!result.some((area) => area.name === areaName)) {
        result.push({ name: areaName, uid: areaName })
      }
      return result
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name))

  const statusOptions = data
    .reduce((result, current) => {
      const statusName = current.estado
      if (!result.some((status) => status.name === statusName)) {
        result.push({ name: statusName, uid: statusName })
      }
      return result
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name))

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
        detail.paciente.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      areasFilter !== 'all' &&
      Array.from(areasFilter).length !== areasOptions.length
    ) {
      filteredPatients = filteredPatients.filter((detail) =>
        Array.from(areasFilter).includes(detail.nombre_area)
      )
    }

    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredPatients = filteredPatients.filter((detail) =>
        Array.from(statusFilter).includes(detail.estado)
      )
    }

    return filteredPatients
  }, [data, filterValue, areasFilter, statusFilter])

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

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

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
      case 'acciones':
        return (
          <div className='relative flex items-center gap-2'>
            {detail.estado === 'PE' && (
              <Tooltip content='Entregar' color='success' closeDelay={0}>
                <span
                  className='text-lg text-success-400 cursor-pointer active:opacity-50'
                  onClick={() =>
                    handleChangeStatus(detail.iddetatencion, detail.estado)
                  }
                >
                  <FileCheck size={20} />
                </span>
              </Tooltip>
            )}
            {detail.nombre_area !== 'Laboratorio' && detail.estado === 'F' && (
              <Tooltip content='Corregir' color='warning' closeDelay={0}>
                <span
                  className='text-lg text-warning-400 cursor-pointer active:opacity-50'
                  onClick={() => onOpenModal(detail.iddetatencion)}
                >
                  <FileX size={20} />
                </span>
              </Tooltip>
            )}
            <Tooltip content='Descargar' color='primary' closeDelay={0}>
              <a
                className='text-lg text-primary-400 cursor-pointer active:opacity-50'
                href={`http://localhost:3000/api/resultados/${detail.iddetatencion}/report`}
                target='_blank'
                rel='noreferrer'
              >
                {<FileDown size={20} />}
              </a>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const handleChangeStatus = async (idDetAttention, status) => {
    const newStatus = status === 'PE' ? 'F' : 'PE' // Cambiar el estado a 'F' si es 'PE', y viceversa
    const result = await changeStatus(idDetAttention, newStatus)

    if (result) {
      refresh()
    } else {
      toast.error('Error al cambiar el estado')
    }
  }

  const onOpenModal = (idDetAttention) => {
    setSelectedDetAttentionId(idDetAttention)
    onOpen()
  }

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[44%]'
            placeholder='Buscar por nombre...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className='flex gap-3'>
            <Dropdown>
              <DropdownTrigger
                className='hidden sm:flex'
                isDisabled={!areasOptions.length}
              >
                <Button
                  endContent={<ChevronDownIcon className='text-small' />}
                  variant='flat'
                >
                  Áreas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={areasFilter}
                selectionMode='multiple'
                onSelectionChange={setAreasFilter}
              >
                {areasOptions.map((area) => (
                  <DropdownItem key={area.uid} className='capitalaze'>
                    {capitalize(area.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger
                className='hidden sm:flex'
                isDisabled={!statusOptions.length}
              >
                <Button
                  endContent={<ChevronDownIcon className='text-small' />}
                  variant='flat'
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode='multiple'
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className='capitalaze'>
                    {capitalize(listState[status.name])}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {data.length} informes
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
    filterValue,
    areasFilter,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
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
    <>
      <CardBody>
        <Table
          isHeaderSticky
          isStriped
          aria-label='Example table with custom cells, pagination and sorting'
          bottomContent={bottomContent}
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'max-h-[600px]'
          }}
          sortDescriptor={sortDescriptor}
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
            emptyContent={'No se encontraron informes'}
            isLoading={loading}
            loadingContent={<Spinner />}
            items={sortedItems}
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
      </CardBody>

      <ModalCorrection
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        idDetAttention={selectedDetAttentionId}
        refreshTable={refresh}
      />
    </>
  )
}
