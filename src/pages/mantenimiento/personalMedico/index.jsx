import {
  Button,
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@nextui-org/react'
import React, { useCallback, useMemo, useState, useRef } from 'react'
import { useFetcher } from '../../../hook/useFetcher'
import {
  activarPersonalMedico,
  deletePersonalMedico,
  getPersonalMedico
} from '../../../services/personalMedico'
import { Edit, Search, Trash , CheckSquare } from 'lucide-react'
import PersonalMedicoModal from './modal'
import { getAllEspecialidad } from '../../../services/especialidad'
import { QuestionModal } from '../../../components/QuestionModal'

export default function PersonalMedico() {
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [activarId, setActivarId] = useState(null)
  const [isOpen, setIsOpen] = useState(null)
  const dataToEdit = useRef()

  const { data, refresh } = useFetcher(getPersonalMedico)
  const { data: dataEspecialidad } = useFetcher(getAllEspecialidad)

  const renderCell = useCallback((columnKey, item) => {
    if (columnKey === 'action')
      return (
        <>
          {item.estado_personal ? (
            <div className='flex gap-x-2'>
              <Button
                size='sm'
                isIconOnly
                color='warning'
                variant='flat'
                onClick={() => {
                  dataToEdit.current = item
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
                  setDeleteId(item.idpersona)
                }}
              >
                <Trash size={20} />
              </Button>
            </div>
          ) : (
            <Tooltip content="Activar" color='primary'>
              <Button
                size='sm'
                isIconOnly
                color='primary'
                variant='light'
                onClick={() => {
                  setActivarId(item.idpersona)
                }}
              >
                <CheckSquare  size={20} />
              </Button>
            </Tooltip>
          )}
        </>
      )

    if (columnKey === 'especialidades') {
      return item.especialidades
        .filter((el) => el.estado === 1)
        .map((el) => el.nombre_especialidad)
        .join(', ')
    }

    if (columnKey === 'estado_personal') {
      if (item.estado_personal === 1) {
        return (
          <Chip color='success' variant='flat'>
            Activo
          </Chip>
        )
      } else {
        return (
          <Chip color='danger' variant='flat'>
            Inactivo
          </Chip>
        )
      }
    }
    return item[columnKey]
  }, [])

  const items = useMemo(() => {
    return data.filter((el) => {
      return el.personal.toLowerCase().includes(search.toLowerCase())
    })
  }, [data, search])

  const handleDelete = async () => {
    await deletePersonalMedico(deleteId)
    refresh()
  }

  const handleActivar = async () => {
    await activarPersonalMedico(activarId)
    refresh()
  }
  return (
    <div>
      <Table
        topContent={
          <div className='flex flex-col '>
            <h1 className='mb-2'>Personal Medico</h1>
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
          </div>
        }
        isStriped
        shadow='none'
        className='h-full'
        aria-label='Tabla de personas'
      >
        <TableHeader>
          <TableColumn key='personal'>Nombres y Apellidos</TableColumn>
          <TableColumn key='especialidades'>Especialidad</TableColumn>
          <TableColumn key='estado_personal'>estado</TableColumn>
          <TableColumn key='action'></TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.idpersonal}>
              {(columnKey) => (
                <TableCell>{renderCell(columnKey, item)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PersonalMedicoModal
        dataEspecialidad={dataEspecialidad}
        key={dataToEdit.current?.idpersonal}
        isOpen={isOpen}
        refresh={refresh}
        onOpenChange={(open) => {
          if (!open) dataToEdit.current = null
          setIsOpen(open)
        }}
        dataToEdit={dataToEdit.current}
      />
      <QuestionModal
        textContent='¿Seguro de eliminar?'
        isOpen={deleteId}
        onOpenChange={setDeleteId}
        onConfirm={handleDelete}
      />

      <QuestionModal
        textContent='¿Estás Seguro de Activar al personal médico?'
        isOpen={activarId}
        onOpenChange={setActivarId}
        onConfirm={handleActivar}
      />
    </div>
  )
}
