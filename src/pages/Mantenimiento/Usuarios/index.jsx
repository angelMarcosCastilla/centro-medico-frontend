import {
  Button,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
  Input,
  Spinner
} from '@nextui-org/react'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import DateTimeClock from '../../../components/DateTimeClock'
import { useFetcher } from '../../../hook/useFetcher'
import { disableUser, enableUser, getAllUsers } from '../../../services/user'
import { mapRoles } from '../../../constants/auth.constant'
import { Edit, Plus, RotateCcw, SearchIcon, Trash } from 'lucide-react'
import { formatDate } from '../../../utils/date'
import { toast } from 'sonner'
import ModalFormUser from './components/ModalFormUser'
import ModalUserAction from './components/ModalUserAction'

const columns = [
  { name: 'USUARIO', uid: 'usuario', sortable: true },
  { name: 'NIVEL ACCESO', uid: 'nivel_acceso', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

export default function Usuarios() {
  const [filterValue, setFilterValue] = useState('')
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })

  const hasSearchFilter = Boolean(filterValue)

  const { data, loading, refresh } = useFetcher(getAllUsers)

  const [disableOrEnableId, setDisableOrEnableId] = useState(null)
  const operation = useRef('')
  const [isOpen, setIsOpen] = useState(null)
  const dataToEdit = useRef()

  const transformedData = useMemo(() => {
    return data.map((el) => ({
      ...el,
      usuario: `${el.nombres} ${el.apellidos}`
    }))
  }, [data])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...transformedData]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.nombres
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          user.apellidos.toLowerCase().includes(filterValue.toLocaleLowerCase())
      )
    }

    return filteredUsers
  }, [data, filterValue])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, filteredItems])

  const toogleState = async () => {
    const result =
      operation.current === 'disable'
        ? await disableUser(disableOrEnableId)
        : await enableUser(disableOrEnableId)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    }
  }

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    const userInfo = (
      <div>
        <div>Creación: {formatDate(user.create_at, true, false)}</div>
        {user.update_at && (
          <div>
            Últ. actu:{' '}
            {user.update_at && formatDate(user.update_at, true, false)}
          </div>
        )}
      </div>
    )

    switch (columnKey) {
      case 'usuario':
        return (
          <User
            avatarProps={{
              radius: 'lg',
              src: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${cellValue}`
            }}
            description={user.correo}
            name={cellValue}
          >
            {user.correo}
          </User>
        )
      case 'nivel_acceso':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-small capitalize text-default-400'>
              {mapRoles[user.nivel_acceso]}
            </p>
          </div>
        )
      case 'estado':
        return user.estado ? (
          <Tooltip
            content={userInfo}
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
            {user.estado === 1 && (
              <Tooltip content='Editar' color='primary' closeDelay={0}>
                <Button
                  isIconOnly
                  color='primary'
                  variant='light'
                  size='sm'
                  onPress={() => {
                    dataToEdit.current = user
                    setIsOpen(true)
                  }}
                >
                  <Edit size={20} />
                </Button>
              </Tooltip>
            )}
            <Tooltip
              content={user.estado === 1 ? 'Eliminar' : 'Activar'}
              color={user.estado === 1 ? 'danger' : 'success'}
              className='text-white'
              closeDelay={0}
            >
              <Button
                isIconOnly
                size='sm'
                color={user.estado === 1 ? 'danger' : 'success'}
                variant='light'
                onPress={() => {
                  setDisableOrEnableId(user.idusuario)
                  operation.current = user.estado === 1 ? 'disable' : 'enable'
                }}
              >
                {user.estado === 1 ? (
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
        <div className='flex justify-between items-center'>
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
            Total: {data.length} usuarios
          </span>
        </div>
      </div>
    )
  }, [filterValue, data.length, onSearchChange, hasSearchFilter])

  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Mantenimiento Usuarios</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          isStriped
          isHeaderSticky
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla CRUD de usuarios'
          classNames={{
            wrapper: 'max-h-[600px]'
          }}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement='outside'
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={loading}
            loadingContent={<Spinner />}
            emptyContent='No se encontraron usuarios'
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={item.idusuario}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>

      <ModalFormUser
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) dataToEdit.current = null
          setIsOpen(open)
        }}
        userToEdit={dataToEdit.current}
        refresh={refresh}
      />

      <ModalUserAction
        title={
          operation.current === 'disable'
            ? 'Eliminar usuario'
            : 'Activar usuario'
        }
        isOpen={disableOrEnableId}
        onOpenChange={setDisableOrEnableId}
        operation={operation.current}
        action={toogleState}
        refresh={refresh}
      />
    </>
  )
}
