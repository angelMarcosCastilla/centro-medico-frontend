import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@nextui-org/react'
import { ChevronDownIcon, Eye, FileEdit, SearchIcon } from 'lucide-react'
import { useFetcher } from '../../hook/useFetcher'
import { usePagination } from '../../hook/usePagination'
import { listState, statusColorMap } from '../../constants/state'
import { capitalize } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { getInProcessReportAttentionsByArea } from '../../services/admission'
import { LABORATORIO_ID } from '../../constants/areas'
import { redirectToResult } from '../../config'
import DateTimeClock from '../../components/DateTimeClock'

const columns = [
  { name: 'ID', uid: 'iddetatencion', sortable: true },
  { name: 'PACIENTE', uid: 'paciente', sortable: true },
  { name: 'CATEGORIA', uid: 'nombre_categoria', sortable: true },
  { name: 'TIPO DE SERVICIO', uid: 'nombre_servicio', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_VISIBLE_COLUMNS = [
  'paciente',
  'nombre_categoria',
  'nombre_servicio',
  'estado',
  'acciones'
]

export default function InformesLaboratorio() {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'ascending'
  })

  const { data, loading } = useFetcher(() =>
    getInProcessReportAttentionsByArea(LABORATORIO_ID)
  )

  const hasSearchFilter = Boolean(filterValue)

  const navigate = useNavigate()

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
          <Chip className={`capitalize ${classChip}`} variant='flat'>
            {capitalize(estadoTexto)}
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            <Tooltip
              content={detail.estado === 'PI' ? 'Redactar' : 'Editar'}
              color='primary'
              closeDelay={0}
            >
              <Button
                isIconOnly
                color='primary'
                variant='light'
                size='sm'
                onPress={() =>
                  handleOpenEditor(
                    detail.idservicio,
                    detail.iddetatencion,
                    detail.estado === 'PI' ? 'new' : 'edit'
                  )
                }
              >
                <FileEdit size={20} />
              </Button>
            </Tooltip>
            {detail.estado === 'PE' && (
              <Tooltip content='Ver' color='primary' closeDelay={0}>
                <Button
                  isIconOnly
                  href={redirectToResult(detail.iddetatencion)}
                  target='_blank'
                  rel='noreferrer'
                  as={Link}
                  color='primary'
                  variant='light'
                  size='sm'
                >
                  <Eye size={20} />
                </Button>
              </Tooltip>
            )}
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const handleOpenEditor = (idService, idDetAttention, operation) => {
    navigate(`/informes-laboratorio/${idService}`, {
      state: { idService, idDetAttention, operation }
    })
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
            placeholder='Buscar por nombre del paciente...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
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
            Total: {data.length} pacientes
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
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Gestión de Informes de Laboratorio</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          isHeaderSticky
          isStriped
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla de informes pendientes de redacción y de entrega'
          bottomContent={bottomContent}
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'max-h-[600px]'
          }}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement='outside'
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn key={column.uid} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent='No se encontraron pacientes'
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
    </>
  )
}
