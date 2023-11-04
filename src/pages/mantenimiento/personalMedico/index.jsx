import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import React, { useCallback, useMemo, useState, useRef } from 'react'
import { useFetcher } from '../../../hook/useFetcher'
import { getPersonalMedico } from '../../../services/personalMedico'
import { Edit, Search, Trash } from 'lucide-react'
import PersonalMedicoModal from './modal'
import { getAllEspecialidad } from '../../../services/especialidad'

export default function PersonalMedico() {
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [isOpen, setIsOpen] = useState(null)
  const dataToEdit = useRef()

  const { data, refresh } = useFetcher(getPersonalMedico)
  const { data: dataEspecialidad } = useFetcher(getAllEspecialidad)

  const renderCell = useCallback((columnKey, item) => {
    if (columnKey === 'action')
      return (
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
          {/* <Button
            size='sm'
            isIconOnly
            color='danger'
            variant='light'
            onClick={() => {
              setDeleteId(item.idpersona)
            }}
          >
            <Trash size={20} />
          </Button> */}
        </div>
    )

    if(columnKey === "especialidades"){
      return item.especialidades.filter(el => el.estado === 1)
      .map(el => el.nombre_especialidad).join(", ")
    }
    return item[columnKey]
  }, [])
  const items = useMemo(() => {
    return data.filter((el) => {
      return el.personal.toLowerCase().includes(search.toLowerCase())
    })
  }, [data, search])

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
    </div>
  )
}
