import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  disablePerson,
  enablePerson,
  getAllPersons
} from '../../../services/person'
import { useFetcher } from '../../../hook/useFetcher'
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
import { usePagination } from '../../../hook/usePagination'
import {
  ChevronDownIcon,
  Edit,
  Plus,
  RotateCcw,
  SearchIcon,
  Trash
} from 'lucide-react'
import { QuestionModal } from '../../../components/QuestionModal'
import DateTimeClock from '../../../components/DateTimeClock'
import { capitalize } from '../../../utils'
import { toast } from 'sonner'
import ModalFormPerson from './components/ModalFormPerson'
import { formatDate } from '../../../utils/date'

const columns = [
  { name: 'APELLIDOS Y NOMBRES', uid: 'nombres_completos', sortable: true },
  { name: 'TIPO DOCUMENTO', uid: 'tipo_documento', sortable: true },
  { name: 'NÚMERO DOCUMENTO', uid: 'num_documento', sortable: true },
  { name: 'FECHA NACIMIENTO', uid: 'fecha_nacimiento', sortable: true },
  { name: 'DIRECCIÓN', uid: 'direccion', sortable: true },
  { name: 'CORREO', uid: 'correo', sortable: true },
  { name: 'CELULAR', uid: 'celular', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_VISIBLE_COLUMNS = [
  'nombres_completos',
  'num_documento',
  'fecha_nacimiento',
  'direccion',
  'estado',
  'acciones'
]

export default function Personas() {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })

  const { data, loading, mutate, refresh } = useFetcher(getAllPersons)
  const [disableOrEnableId, setDisableOrEnableId] = useState(null)
  const operation = useRef('')
  const [isOpen, setIsOpen] = useState(null)
  const dataToEdit = useRef()

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredPersons = [...data]

    if (hasSearchFilter) {
      filteredPersons = filteredPersons.filter(
        (person) =>
          person.nombres
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          person.apellidos
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          person.num_documento
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase())
      )
    }

    return filteredPersons
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

  const toogleState = async () => {
    const result =
      operation.current === 'disable'
        ? await disablePerson(disableOrEnableId)
        : await enablePerson(disableOrEnableId)

    if (result.isSuccess) {
      toast.success(result.message)

      mutate((prevPersons) => {
        const updatedPersons = prevPersons.map((person) => {
          if (person.idpersona === disableOrEnableId) {
            return {
              ...person,
              estado: operation.current === 'disable' ? 0 : 1
            }
          }
          return person
        })

        return updatedPersons
      })
    }
  }

  const renderCell = useCallback((person, columnKey) => {
    const cellValue = person[columnKey]

    const personDateInfo = (
      <div>
        <div>Creación: {formatDate(person.create_at, true, false)}</div>
        {person.update_at && (
          <div>
            Últ. actu:{' '}
            {person.update_at
              ? formatDate(person.update_at, true, false)
              : ' ---'}
          </div>
        )}
      </div>
    )

    switch (columnKey) {
      case 'nombres_completos':
        return person.apellidos + ', ' + person.nombres
      case 'tipo_documento':
        return cellValue === 'D' ? 'DNI' : 'Carnet de Extranjería'
      case 'fecha_nacimiento':
        return new Date(cellValue).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      case 'direccion':
        return cellValue || '---'
      case 'correo':
        return cellValue || '---'
      case 'celular':
        return cellValue
          ? String(cellValue).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          : '---'
      case 'estado':
        return person.estado ? (
          <Tooltip
            content={personDateInfo}
            color='success'
            className='text-white'
            closeDelay={0}
          >
            <Chip color='success' variant='flat'>
              Activo
            </Chip>
          </Tooltip>
        ) : (
          <Chip color='danger' variant='flat'>
            Inactivo
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            {person.estado === 1 && (
              <Tooltip content='Editar' color='primary' closeDelay={0}>
                <Button
                  isIconOnly
                  color='primary'
                  variant='light'
                  size='sm'
                  onPress={() => {
                    dataToEdit.current = person
                    setIsOpen(true)
                  }}
                >
                  <Edit size={20} />
                </Button>
              </Tooltip>
            )}
            <Tooltip
              content={person.estado === 1 ? 'Eliminar' : 'Activar'}
              color={person.estado === 1 ? 'danger' : 'success'}
              className='text-white'
              closeDelay={0}
            >
              <Button
                isIconOnly
                size='sm'
                color={person.estado === 1 ? 'danger' : 'success'}
                variant='light'
                onPress={() => {
                  setDisableOrEnableId(person.idpersona)
                  operation.current = person.estado === 1 ? 'disable' : 'enable'
                }}
              >
                {person.estado === 1 ? (
                  <Trash size={20} />
                ) : (
                  <RotateCcw size={20} />
                )}
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
                setIsOpen(true)
              }}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {data.length} personas
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
    items.length,
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
        <h2 className='text-2xl'>Mantenimiento Personas</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          isStriped
          isHeaderSticky
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla CRUD de personas'
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
            emptyContent='No se encontraron personas'
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

      <ModalFormPerson
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) dataToEdit.current = null
          setIsOpen(open)
        }}
        personToEdit={dataToEdit.current}
        refresh={refresh}
      />

      <QuestionModal
        title={
          operation.current === 'disable'
            ? 'Eliminar persona'
            : 'Activar persona'
        }
        textContent={`¿Está seguro de ${
          operation.current === 'disable' ? 'eliminar' : 'activar'
        } esta persona?`}
        isOpen={disableOrEnableId}
        onOpenChange={setDisableOrEnableId}
        confirmConfig={{
          text: operation.current === 'disable' ? 'Eliminar' : 'Activar',
          color: operation.current === 'disable' ? 'danger' : 'success',
          action: toogleState
        }}
      />
    </>
  )
}
