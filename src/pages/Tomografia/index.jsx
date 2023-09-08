import React, { useCallback } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Card,
  CardBody
} from '@nextui-org/react'
import { ChevronDownIcon, SearchIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'PACIENTE', uid: 'paciente', sortable: true },
  { name: 'CATEGORIA', uid: 'categoria', sortable: true },
  { name: 'TIPO DE SERIVICIO', uid: 'tiposervicio', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const statusOptions = [
  { name: 'Activo', uid: 'activo' },
  { name: 'Cancelado', uid: 'cancelado' },
  { name: 'Pendiente', uid: 'pendiente' }
]

const users = [
  {
    id: 1,
    paciente: 'Tony Reichert',
    categoria: 'Con contraste',
    tiposervicio: 'Abdomen completo',
    estado: 'pendiente'
  },
  {
    id: 2,
    paciente: 'Susan Cartagena',
    categoria: 'Sin contraste',
    tiposervicio: 'Cerebral',
    estado: 'pendiente'
  },
  {
    id: 3,
    paciente: 'Carlos López',
    categoria: 'Con contraste',
    tiposervicio: 'Tórax',
    estado: 'pendiente'
  },
  {
    id: 4,
    paciente: 'Maria González',
    categoria: 'Sin contraste',
    tiposervicio: 'Pelvis',
    estado: 'pendiente'
  },
  {
    id: 5,
    paciente: 'Juan Rodríguez',
    categoria: 'Con contraste',
    tiposervicio: 'Extremidades',
    estado: 'pendiente'
  },
  {
    id: 6,
    paciente: 'Laura Martínez',
    categoria: 'Sin contraste',
    tiposervicio: 'Columna vertebral',
    estado: 'pendiente'
  },
  {
    id: 7,
    paciente: 'Miguel Sánchez',
    categoria: 'Con contraste',
    tiposervicio: 'Pélvico',
    estado: 'pendiente'
  },
  {
    id: 8,
    paciente: 'Ana Ramírez',
    categoria: 'Sin contraste',
    tiposervicio: 'Mama',
    estado: 'pendiente'
  },
  {
    id: 9,
    paciente: 'Pedro Fernández',
    categoria: 'Con contraste',
    tiposervicio: 'Articulaciones',
    estado: 'pendiente'
  },
  {
    id: 10,
    paciente: 'Elena Castillo',
    categoria: 'Sin contraste',
    tiposervicio: 'Cabeza y cuello',
    estado: 'pendiente'
  }
]

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const statusColorMap = {
  activo: 'success',
  cancelado: 'danger',
  pendiente: 'warning'
}

const INITIAL_VISIBLE_COLUMNS = [
  'paciente',
  'categoria',
  'tiposervicio',
  'estado',
  'acciones'
]

export default function Tomografia() {
  const [filterValue, setFilterValue] = React.useState('')
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'id',
    direction: 'ascending'
  })
  const [page, setPage] = React.useState(1)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.paciente.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      )
    }

    return filteredUsers
  }, [users, filterValue, statusFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'estado':
        return (
          <Chip
            className='capitalize'
            color={statusColorMap[user.estado]}
            size='sm'
            variant='flat'
          >
            {cellValue}
          </Chip>
        )
      case 'acciones':
        return (
          <div className=''>
            <Button color='primary'>
              <Link to='/triaje'>Hacer triaje</Link>
            </Button>
            {/* <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size='sm' variant='light'>
                  <MoreVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>
                  <Link to='/triaje'>Hacer triaje</Link>
                </DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const topContent = React.useMemo(() => {
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
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectionMode='multiple'
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className='capitalize'>
                    {capitalize(status.name)}
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
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {users.length} pacientes
          </span>
          <label className='flex items-center text-default-400 text-small'>
            Filas por página:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
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
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter
  ])

  const bottomContent = React.useMemo(() => {
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
            size='sm'
            variant='flat'
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    )
  }, [items.length, page, pages, hasSearchFilter])

  return (
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
          <TableBody emptyContent={'No users found'} items={sortedItems}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}
