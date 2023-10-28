import React, { useCallback, useMemo, useRef, useState } from 'react'
import { deletePerson, getPerson } from '../../../services/person'
import { useFetcher } from '../../../hook/useFetcher'
import {
  Button,
  Chip,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import PersonModal from './PersonModal'
import { usePagination } from '../../../hook/usePagination'
import { Edit, Search, Trash } from 'lucide-react'
import { QuestionModal } from '../../../components/QuestionModal'

export default function Personas() {
  const { data, loading, mutate, refresh } = useFetcher(getPerson)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [isOpen, setIsOpen] = useState(null)
  const dataToEdit = useRef()

  const dataFilter = useMemo(() => {
    if (search === '') return data.toSorted((a, b) => b.estado - a.estado)
    return data
      .filter(
        (person) =>
          person.nombres.toLowerCase().includes(search.toLowerCase()) ||
          person.apellidos.toLowerCase().includes(search.toLowerCase()) ||
          person.num_documento.includes(search)
      )
      .toSorted((a, b) => b.estado - a.estado)
  }, [data, search])

  const { items, page, pages, setPage } = usePagination(dataFilter, 10)


  const renderCell = useCallback((keycell, item) => {
    if (keycell === 'fecha_nacimiento')
      return new Date(item[keycell]).toLocaleDateString()

    if (keycell === 'nombres') return `${item.nombres} ${item.apellidos}`

    if (keycell === 'estado')
      return item.estado ? (
        <Chip color='success' variant='flat'>Activo</Chip>
      ) : (
        <Chip color='danger'  variant='flat'>Inactivo</Chip>
      )

    if (keycell === 'action') {
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
      )
    }
    return item[keycell]
  }, [])

  const handleDelete = () => {
    mutate((prevPersons) => {
      return prevPersons.map((el) => {
        if (el.idpersona === deleteId) return { ...el, estado: 0 }
        return el
      })
    })
    deletePerson(deleteId)
  }


  if (loading) return <Spinner />

  return (
    <div className='h-full overflow-auto '>
      <Table
        isStriped
        shadow='none'
        className='h-full'
        aria-label='Tabla de personas'
        topContent={
          <div className='flex flex-col '>
            <h1 className='mb-2'>Personas</h1>
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
        bottomContent={
          <div className='mb-2'>
            <Pagination
              isCompact
              showControls
              showShadow
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: 'min-h-[222px]'
        }}
      >
        <TableHeader>
          <TableColumn key='nombres'>Nombres y Apellidos</TableColumn>
          <TableColumn key='direccion'>Dirección</TableColumn>
          <TableColumn key='fecha_nacimiento'>Fecha Nacimiento</TableColumn>
          <TableColumn key='tipo_documento'>Tipo Documento</TableColumn>
          <TableColumn key='num_documento'>N° Documento</TableColumn>
          <TableColumn key='estado'>Estado</TableColumn>
          <TableColumn key='action'></TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.idpersona}>
              {(columnKey) => (
                <TableCell key={`${item.idpersona} - ${columnKey}`}>{renderCell(columnKey, item)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PersonModal
        key={dataToEdit.current?.idpersona}
        isOpen={isOpen}
        refresh={refresh}
        onOpenChange={(open) => {
          if(!open) dataToEdit.current = null
          setIsOpen(open)
        }}
        mutate={mutate}
        dataToEdit={dataToEdit.current}
      />
      <QuestionModal
        textContent='¿Seguro de eliminar?'
        isOpen={deleteId}
        onOpenChange={setDeleteId}
        onConfirm={handleDelete}
      />
    </div>
  )
}
