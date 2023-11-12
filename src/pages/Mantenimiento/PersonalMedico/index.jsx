import {
  Button,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Spinner,
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
  disableMedicalPersonnel,
  enableMedicalPersonnel,
  getMedicalStaff
} from '../../../services/medicalStaff'
import { Edit, Trash, SearchIcon, Plus, RotateCcw } from 'lucide-react'
import ModalFormMedicalPersonnel from './components/ModalFormMedicalPersonnel'
import { QuestionModal } from '../../../components/QuestionModal'
import DateTimeClock from '../../../components/DateTimeClock'
import { formatDate } from '../../../utils/date'
import { toast } from 'sonner'

const columns = [
  { name: 'APELLIDOS Y NOMBRES', uid: 'personal', sortable: true },
  { name: 'ESPECIALIDADES', uid: 'especialidades', sortable: true },
  { name: 'CODIGO CMP', uid: 'codigo_cmp', sortable: true },
  { name: 'ESTADO', uid: 'estado_personal', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

export default function PersonalMedico() {
  const [filterValue, setFilterValue] = useState('')
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending'
  })

  const hasSearchFilter = Boolean(filterValue)

  const { data, loading, refresh } = useFetcher(getMedicalStaff)

  const [disableOrEnableId, setDisableOrEnableId] = useState(null)
  const operation = useRef('')
  const [isOpen, setIsOpen] = useState(null)
  const dataToEdit = useRef()

  const filteredItems = useMemo(() => {
    let filteredMedicalStaff = [...data]

    if (hasSearchFilter) {
      filteredMedicalStaff = filteredMedicalStaff.filter((person) =>
        person.personal.toLowerCase().includes(filterValue.toLocaleLowerCase())
      )
    }

    return filteredMedicalStaff
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
        ? await disableMedicalPersonnel(disableOrEnableId)
        : await enableMedicalPersonnel(disableOrEnableId)

    if (result.isSuccess) {
      toast.success(result.message)
      refresh()
    }
  }

  const renderCell = useCallback((medWorker, columnKey) => {
    const cellValue = medWorker[columnKey]

    const medicalPersonnelInfo = (
      <div>
        <div>Creación: {formatDate(medWorker.create_at, true, false)}</div>
        {medWorker.update_at && (
          <div>
            Últ. actu:{' '}
            {medWorker.update_at &&
              formatDate(medWorker.update_at, true, false)}
          </div>
        )}
      </div>
    )

    switch (columnKey) {
      case 'especialidades':
        return medWorker.especialidades
          .filter((el) => el.estado === 1)
          .map((el) => el.nombre_especialidad)
          .join(', ')
      case 'estado_personal':
        return medWorker.estado_personal ? (
          <Tooltip
            content={medicalPersonnelInfo}
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
            {medWorker.estado_personal === 1 && (
              <Tooltip content='Editar' color='primary' closeDelay={0}>
                <Button
                  isIconOnly
                  color='primary'
                  variant='light'
                  size='sm'
                  onPress={() => {
                    dataToEdit.current = medWorker
                    setIsOpen(true)
                  }}
                >
                  <Edit size={20} />
                </Button>
              </Tooltip>
            )}
            <Tooltip
              content={medWorker.estado_personal === 1 ? 'Eliminar' : 'Activar'}
              color={medWorker.estado_personal === 1 ? 'danger' : 'success'}
              className='text-white'
              closeDelay={0}
            >
              <Button
                isIconOnly
                size='sm'
                color={medWorker.estado_personal === 1 ? 'danger' : 'success'}
                variant='light'
                onPress={() => {
                  setDisableOrEnableId(medWorker.idpersonal)
                  operation.current =
                    medWorker.estado_personal === 1 ? 'disable' : 'enable'
                }}
              >
                {medWorker.estado_personal === 1 ? (
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
            Total: {data.length} empleados
          </span>
        </div>
      </div>
    )
  })

  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Mantenimiento Personal Médico</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Table
          isStriped
          isHeaderSticky
          removeWrapper
          tabIndex={-1}
          aria-label='Tabla CRUD del personal médico'
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
            emptyContent='No se encontraron empleados'
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={item.idpersonal}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>

      <ModalFormMedicalPersonnel
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) dataToEdit.current = null
          setIsOpen(open)
        }}
        medicalPersonnelToEdit={dataToEdit.current}
        refresh={refresh}
      />

      <QuestionModal
        title={
          operation.current === 'disable'
            ? 'Eliminar empleado'
            : 'Activar empleado'
        }
        textContent={`¿Está seguro de ${
          operation.current === 'disable' ? 'eliminar' : 'activar'
        } este empleado? ${
          operation.current === 'disable'
            ? 'Incluye las especialidades si lo tiene'
            : ''
        }`}
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
