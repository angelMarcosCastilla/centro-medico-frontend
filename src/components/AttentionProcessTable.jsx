import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from '@nextui-org/react'
import {
  ChevronDownIcon,
  MonitorPause,
  SearchIcon,
  UserCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { useFetcher } from '../hook/useFetcher'
import { usePagination } from '../hook/usePagination'
import { capitalize } from '../utils'
import { listState, statusColorMap } from '../constants/state'
import { changeStatus, updateMedicoByDetatencion } from '../services/admission'
import { useAuth } from '../context/AuthContext'

const columns = [
  { name: 'ID', uid: 'iddetatencion', sortable: true },
  { name: 'PACIENTE', uid: 'paciente', sortable: true },
  { name: 'CATEGORIA', uid: 'nombre_categoria', sortable: true },
  { name: 'TIPO DE SERVICIO', uid: 'nombre_servicio', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

const INITIAL_VISIBLE_COLUMNS = [
  'paciente',
  'nombre_categoria',
  'nombre_servicio',
  'estado',
  'acciones'
]

export default function AttentionProcessTable({
  useFecherFunction,
  getDoctorByAreaFunction
}) {
  const [filterValue, setFilterValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'ascending'
  })
  const [idDetAttention, setIdDetAttention] = useState(null)
  const { userInfo } = useAuth()
  const [medicoId, setMedicoId] = useState(new Set([]))
  const { data, mutate } = useFetcher(useFecherFunction)
  const { data: doctorData } = useFetcher(getDoctorByAreaFunction)

  const hasSearchFilter = Boolean(filterValue)
  const selectMedico = Array.from(medicoId)[0]

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredPatients = [...data]

    if (hasSearchFilter) {
      filteredPatients = filteredPatients.filter((detail) =>
        detail.paciente.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    return filteredPatients
  }, [data, filterValue])

  const {
    items,
    page,
    pages,
    rowsPerPage,
    onNextPage,
    onPreviousPage,
    onRowsPerPageChange,
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

  const renderCell = useCallback((detail, columnKey) => {
    const cellValue = detail[columnKey]
    const estadoTexto = listState[cellValue]
    const classChip = statusColorMap[cellValue]

    switch (columnKey) {
      case 'estado':
        return (
          <Chip className={`capitalize ${classChip}`} size='sm' variant='flat'>
            {capitalize(estadoTexto)}
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-2'>
            <Tooltip
              content={detail.estado === 'P' ? 'Atender' : 'Confirmar Atencion'}
              color='primary'
              closeDelay={0}
            >
              <span
                className='text-lg text-primary-400 cursor-pointer active:opacity-50'
                onClick={() => {
                  if (detail.estado === 'P') {
                    handleChangeStatus(detail.iddetatencion, detail.estado)
                  } else {
                    setIdDetAttention(detail.iddetatencion)
                  }
                }}
              >
                {detail.estado === 'P' ? (
                  <MonitorPause size={20} />
                ) : (
                  <UserCheck size={20} />
                )}
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const handleChangeStatus = async (idDetAttention) => {
    const result = await changeStatus(idDetAttention, 'A')

    if (result) {
      mutate((prevData) => {
        return prevData.map((item) => {
          if (item.iddetatencion === idDetAttention) {
            return { ...item, estado: 'A' }
          }
          return item
        })
      })
    } else {
      toast.error('Error al cambiar el estado')
    }
  }

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

  const handleSuccess = async (onClose) => {
    const data = {
      idmedicoatendiente: userInfo.idpersonalmedico,
      idmedicoinformante: parseInt(selectMedico)
    }
    mutate((prevData) => {
      return prevData.filter((item) => item.iddetatencion !== idDetAttention)
    })

    handleCancel()
    onClose()

    await updateMedicoByDetatencion(data, idDetAttention)
  }

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
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total: {data.length} pacientes
          </span>
          <label className='flex items-center text-default-400 text-small'>
            Filas por página:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              value={rowsPerPage}
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
    data.length,
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

  const handleCancel = () => {
    setIdDetAttention(null)
    setMedicoId(new Set([]))
  }

  return (
    <>
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
            emptyContent={'No se encontraron pacientes'}
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
      <Modal
        isOpen={Boolean(idDetAttention)}
        onOpenChange={() => setIdDetAttention(null)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Asignar Médico
              </ModalHeader>
              <ModalBody>
                <Select  placeholder='Médico a redactar el informe' selectedKeys={medicoId} onSelectionChange={setMedicoId}>
                  {doctorData.map((doctor) => (
                    <SelectItem
                      key={doctor.idpersonalmedico}
                      value={doctor.iddoctor}
                    >
                      {doctor.medico}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={() => {
                    handleCancel()
                    onClose()
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    handleSuccess(onClose)
                  }}
                  isDisabled={!selectMedico}
                >
                  Asignar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
