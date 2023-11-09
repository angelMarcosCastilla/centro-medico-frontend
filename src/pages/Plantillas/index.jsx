import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  CardBody,
  CardHeader,
  Divider,
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
  Tooltip
} from '@nextui-org/react'
import {
  ChevronDownIcon,
  FileEdit,
  FilePlus2,
  Plus,
  SearchIcon
} from 'lucide-react'
import { getServicesByArea } from '../../services/service'
import { usePagination } from '../../hook/usePagination'
import { useFetcher } from '../../hook/useFetcher'
import { capitalize } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { LABORATORIO_ID } from '../../constants/areas'
import DateTimeClock from '../../components/DateTimeClock'
import ModalNewTemplate from './components/ModalNewTemplate'

const columns = [
  { name: 'CATEGORIA', uid: 'categoria', sortable: true },
  { name: 'SERVICIO', uid: 'servicio', sortable: true },
  { name: 'OBSERVACION', uid: 'observacion', sortable: true },
  { name: 'PRECIO', uid: 'precio', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_VISIBLE_COLUMNS = [
  'categoria',
  'servicio',
  'observacion',
  'precio',
  'acciones'
]

export default function Plantillas() {
  const navigate = useNavigate()
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'ascending'
  })

  const { data, loading } = useFetcher(() => getServicesByArea(LABORATORIO_ID))
  const [isOpen, setIsOpen] = useState(null)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredServices = [...data]

    if (hasSearchFilter) {
      filteredServices = filteredServices.filter((service) =>
        service.servicio.toLowerCase().includes(filterValue.toLocaleLowerCase())
      )
    }
    return filteredServices
  }, [data, filterValue])

  const {
    items,
    onNextPage,
    onPreviousPage,
    rowsPerPage,
    onRowsPerPageChange,
    page,
    pages,
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

  const renderCell = useCallback((service, columnKey) => {
    const cellValue = service[columnKey]

    switch (columnKey) {
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            <Tooltip content='Nuevo' color='primary' closeDelay={0}>
              <Button
                isIconOnly
                color='primary'
                variant='light'
                size='sm'
                onPress={() =>
                  navigate(`/plantillas/${service.idservicio}`, {
                    state: {
                      service,
                      operation: 'new'
                    }
                  })
                }
              >
                <FilePlus2 size={20} />
              </Button>
            </Tooltip>
            <Tooltip content='Editar' color='primary' closeDelay={0}>
              <Button
                isIconOnly
                color='primary'
                variant='light'
                size='sm'
                onPress={() =>
                  navigate(`/plantillas/${service.idservicio}`, {
                    state: {
                      service,
                      operation: 'edit'
                    }
                  })
                }
              >
                <FileEdit size={20} />
              </Button>
            </Tooltip>
          </div>
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
            placeholder='Buscar por servicio...'
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
            <Button
              color='primary'
              endContent={<Plus size={20} />}
              onPress={() => {
                setIsOpen(true)
              }}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {data.length} servicios
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
        <h2 className='text-2xl'>Plantillas para Informes de Laboratorio</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          isHeaderSticky
          isStriped
          removeWrapper
          aria-label='Tabla de servicios de laboratorio para la creación o edición de plantillas personalizadas'
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
              <TableColumn
                key={column.uid}
                align={column.uid === 'acciones' ? 'center' : 'start'}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={loading}
            loadingContent={<Spinner />}
            emptyContent='No se encontraron servicios'
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

      <ModalNewTemplate
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        services={data}
      />
    </>
  )
}
