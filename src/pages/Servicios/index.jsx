import { useCallback, useMemo, useRef, useState } from 'react'
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
  Tooltip,
  useDisclosure
} from '@nextui-org/react'
import { ChevronDownIcon, Edit, Plus, SearchIcon, Trash } from 'lucide-react'
import { getAllServices, removeService } from '../../services/service'
import { useFetcher } from '../../hook/useFetcher'
import { capitalize } from '../../utils'
import ModalFormService from './components/ModalFormService'
import { QuestionModal } from '../../components/QuestionModal'
import { toast } from 'sonner'
import { usePagination } from '../../hook/usePagination'
import DateTimeClock from '../../components/DateTimeClock'

const columns = [
  { name: 'ÁREA', uid: 'area', sortable: true },
  { name: 'CATEGORÍA', uid: 'categoria', sortable: true },
  { name: 'SERVICIO', uid: 'servicio', sortable: true },
  { name: 'OBSERVACIÓN', uid: 'observacion', sortable: true },
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
    column: 'id',
    direction: 'descending'
  })
  const [editService, setEditService] = useState(null)
  const serviceId = useRef(null)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isOpenQuestionDelete,
    onOpen: onOpenQuestionDelete,
    onOpenChange: onOpenChangeQuestionDelete
  } = useDisclosure()

  const { data, loading, refresh } = useFetcher(getAllServices)

  const transformedData = useMemo(() => {
    return data
      .reduce((result, area) => {
        area.categorias.forEach((categoria) => {
          categoria.servicios.forEach((servicio) => {
            result.push({
              idservicio: servicio.idservicio,
              idarea: area.idarea,
              area: area.nombre,
              idcategoria: categoria.idcategoria,
              categoria: categoria.nombre,
              servicio: servicio.nombre,
              observacion: servicio.observacion || '',
              precio: servicio.precio,
              idrequisito: servicio.idrequisito,
              ordenMedica: !!servicio.orden_medica,
              triaje: !!servicio.triaje
            })
          })
        })
        return result
      }, [])
      .sort((a, b) => b.idservicio - a.idservicio)
  }, [data])

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

  const confirmDelete = async () => {
    const result = await removeService(serviceId.current)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  const renderCell = useCallback((service, columnKey) => {
    const cellValue = service[columnKey]

    switch (columnKey) {
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            <Tooltip content='Editar' color='primary' closeDelay={0}>
              <Button
                isIconOnly
                color='primary'
                variant='light'
                size='sm'
                onPress={() => {
                  console.log(service)
                  handleEditClick(service.idservicio)
                }}
              >
                <Edit size={20} />
              </Button>
            </Tooltip>
            <Tooltip color='danger' content='Eliminar' closeDelay={0}>
              <Button
                isIconOnly
                color='danger'
                variant='light'
                size='sm'
                onPress={() => {
                  serviceId.current = service.idservicio
                  onOpenQuestionDelete()
                }}
              >
                <Trash size={20} />
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
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className='capitalize'>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
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
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Servicios médicos</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          isHeaderSticky
          isStriped
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla CRUD de servicios médicos'
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

      <ModalFormService
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        operation={editService ? 'edit' : 'new'}
        serviceToEdit={editService}
        refreshTable={refresh}
      />

      <QuestionModal
        title='Eliminar servicio'
        textContent='¿Está seguro que quiere eliminar el servicio? Esta acción es irreversible.'
        isOpen={isOpenQuestionDelete}
        onOpenChange={onOpenChangeQuestionDelete}
        confirmConfig={{
          text: 'Eliminar',
          color: 'danger',
          action: confirmDelete
        }}
      />
    </>
  )
}
