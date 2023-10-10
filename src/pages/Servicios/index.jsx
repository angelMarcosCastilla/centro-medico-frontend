import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
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
  PencilLine,
  Plus,
  SearchIcon,
  Trash2
} from 'lucide-react'
import { getAllServices } from '../../services/service'
import { usePagination } from '../../hook/usePagination'
import { useFetcher } from '../../hook/useFetcher'
import { capitalize } from '../../utils'
import ModalFormService from './components/ModalFormService'

const columns = [
  { name: 'ÁREA', uid: 'area', sortable: true },
  { name: 'CATEGORÍA', uid: 'categoria', sortable: true },
  { name: 'SERVICIO', uid: 'servicio', sortable: true },
  { name: 'OBSERVACION', uid: 'observacion', sortable: true },
  { name: 'PRECIO', uid: 'precio', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_VISIBLE_COLUMNS = [
  'area',
  'categoria',
  'servicio',
  'precio',
  'acciones'
]

export default function Servicios() {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [areasFilter, setAreasFilter] = useState('all')
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'idservicio',
    direction: 'descending'
  })
  const [editService, setEditService] = useState(null)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { data, refresh } = useFetcher(getAllServices)

  const transformedData = data
    .reduce((result, area) => {
      area.categorias.forEach((categoria) => {
        categoria.servicios.forEach((servicio) => {
          result.push({
            idservicio: servicio.idservicio,
            area: area.nombre,
            categoria: categoria.nombre,
            servicio: servicio.nombre,
            observacion: servicio.observacion || '',
            precio: servicio.precio
          })
        })
      })
      return result
    }, [])
    .sort((a, b) => b.idservicio - a.idservicio)

  const areasOptions = data.map((area) => ({
    name: area.nombre,
    uid: area.nombre
  }))

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredServices = [...transformedData]

    if (hasSearchFilter) {
      filteredServices = filteredServices.filter((service) =>
        service.servicio.toLowerCase().includes(filterValue.toLocaleLowerCase())
      )
    }
    if (
      areasFilter !== 'all' &&
      Array.from(areasFilter).length !== areasOptions.length
    ) {
      filteredServices = filteredServices.filter((service) =>
        Array.from(areasFilter).includes(service.area)
      )
    }

    return filteredServices
  }, [transformedData, filterValue, areasFilter])

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

  const handleEditClick = (service) => {
    setEditService(service)
    onOpen()
  }

  const renderCell = useCallback((service, columnKey) => {
    const cellValue = service[columnKey]

    switch (columnKey) {
      case 'acciones':
        return (
          <div className='relative flex items-center gap-2'>
            <Tooltip content='Editar' color='primary' closeDelay={0}>
              <span
                className='text-lg text-primary-400 cursor-pointer active:opacity-50'
                onClick={() => handleEditClick(service.idservicio)}
              >
                <PencilLine size={20} />
              </span>
            </Tooltip>
            <Tooltip color='danger' content='Eliminar' closeDelay={0}>
              <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                <Trash2 size={20} />
              </span>
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
            placeholder='Buscar por nombre...'
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
                  Áreas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Colummns'
                closeOnSelect={false}
                selectedKeys={areasFilter}
                selectionMode='multiple'
                onSelectionChange={setAreasFilter}
              >
                {areasOptions.map((area) => (
                  <DropdownItem key={area.uid} className='capitalize'>
                    {capitalize(area.name)}
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
            <Button
              color='primary'
              endContent={<Plus size={20} />}
              onPress={() => {
                setEditService(null)
                onOpen()
              }}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {transformedData.length} servicios
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
    visibleColumns,
    onRowsPerPageChange,
    transformedData.length,
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
      <Card shadow='none'>
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
              emptyContent={'No se encontraron servicios'}
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
      </Card>

      <ModalFormService
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        operation={editService ? 'edit' : 'new'}
        serviceToEdit={editService}
        refreshTable={refresh}
      />
    </>
  )
}