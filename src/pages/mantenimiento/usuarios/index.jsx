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
  Input
} from '@nextui-org/react'
import React, { useMemo, useRef, useState } from 'react'
import DateTimeClock from '../../../components/DateTimeClock'
import { useFetcher } from '../../../hook/useFetcher'
import {
  activarUsuario,
  getAllUsuarios,
  removeUsuario
} from '../../../services/usuarios'
import { mapRoles } from '../../../constants/auth.constant'
import { CheckSquare, Edit, Search, Trash } from 'lucide-react'
import { QuestionModal } from '../../../components/QuestionModal'
import ModalFormUsuario from './components/ModalFormUsuario'

export default function Usuarios() {
  const { data, loading, refresh } = useFetcher(getAllUsuarios)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [activarId, setActivarId] = useState(null)
  const [isOpen, setIsOpen] = useState(null)
  const dataToEdit = useRef()

  const items = useMemo(() => {
    if (!data) return []
    return data.filter((el) => {
      return (
        el.nombres.toLowerCase().includes(search.toLowerCase()) ||
        el.apellidos.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [data, search])

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'nombres_apellidos':
        return (
          <User
            avatarProps={{
              src: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user.nombres}`
            }}
            description={user.nombre_usuario}
            name={`${user.nombres} ${user.apellidos}`}
          >
            {user.nombres}
          </User>
        )
      case 'nivel_acceso':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>
              {mapRoles[user.nivel_acceso]}
            </p>
          </div>
        )
      case 'estado':
        return (
          <Chip
            className='capitalize'
            size='sm'
            variant='flat'
            color={cellValue === 1 ? 'success' : 'danger'}
          >
            {cellValue === 1 ? 'Activo' : 'Inactivo'}
          </Chip>
        )
      case 'actions':
        return (
          <>
            {user.estado ? (
              <div className='flex gap-x-2'>
                <Button
                  size='sm'
                  isIconOnly
                  color='warning'
                  variant='flat'
                  onClick={() => {
                    dataToEdit.current = user
                    setIsOpen(true)
                  }}
                >
                  <Edit size={20} />
                </Button>
                <Button
                  size='sm'
                  isIconOnly
                  color='danger'
                  variant='light'
                  onClick={() => {
                    setDeleteId(user.idusuario)
                  }}
                >
                  <Trash size={20} />
                </Button>
              </div>
            ) : (
              <Tooltip content='Activar' color='primary'>
                <Button
                  size='sm'
                  isIconOnly
                  color='primary'
                  variant='light'
                  onClick={() => {
                    setActivarId(user.idusuario)
                  }}
                >
                  <CheckSquare size={20} />
                </Button>
              </Tooltip>
            )}
          </>
        )
      default:
        return cellValue
    }
  }, [])

  const handleDelete = async () => {
    await removeUsuario(deleteId)
    refresh()
  }

  const handleActivar = async () => {
    await activarUsuario(activarId)
    refresh()
  }

  if (loading) return <p>Cargando...</p>

  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Mantenimiento Personas</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          topContent={
            <div className='flex justify-between items-center'>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                endContent={<Search />}
                placeholder='Buscar'
                className='max-w-[300px]'
              />
              <Button
                color='primary'
                onClick={() => {
                  setIsOpen(true)
                }}
              >
                Agregar
              </Button>
            </div>
          }
        >
          <TableHeader>
            <TableColumn key='nombres_apellidos'>
              Nombres y Apellidos
            </TableColumn>
            <TableColumn key='nivel_acceso'>Role</TableColumn>
            <TableColumn key='estado'>Status</TableColumn>
            <TableColumn key='actions'>Status</TableColumn>
          </TableHeader>
          <TableBody items={items}>
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

      <QuestionModal
        textContent='¿Seguro de eliminar?'
        isOpen={deleteId}
        onOpenChange={setDeleteId}
        confirmConfig={{
          action: handleDelete,
          text: 'Aceptar',
          color: 'primary'
        }}
      />

      <QuestionModal
        textContent='¿Estás Seguro de Activar al usuario?'
        isOpen={activarId}
        onOpenChange={setActivarId}
        confirmConfig={{
          action: handleActivar,
          text: 'Activar',
          color: 'primary'
        }}
      />
      <ModalFormUsuario
        key={dataToEdit.current?.idusuario}
        isOpen={isOpen}
        dataToEdit={dataToEdit.current}
        refresh={refresh}
        onOpenChange={(open) => {
          if (!open) dataToEdit.current = null
          setIsOpen(open)
        }}
      ></ModalFormUsuario>
    </>
  )
}
