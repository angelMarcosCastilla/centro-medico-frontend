import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  MonitorPause,
  UserCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { useFetcher } from '../hook/useFetcher'
import { listState, statusColorMap } from '../constants/state'
import {
  changeOrder,
  changeStatus,
  updateMedicoByDetatencion
} from '../services/admission'
import { useAuth } from '../context/AuthContext'
import { socket } from './Socket'
import { formatDate } from '../utils/date'
import DateTimeClock from './DateTimeClock'

const columns = [
  { name: '#', uid: 'index' },
  { name: 'PACIENTE', uid: 'paciente' },
  { name: 'CATEGORÍA', uid: 'nombre_categoria' },
  { name: 'SERVICIO', uid: 'nombre_servicio' },
  { name: 'FECHA Y HORA', uid: 'create_at' },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'ACCIONES', uid: 'acciones' }
]

export default function AttentionProcessTable({
  nameArea,
  useFecherFunction,
  getDoctorByAreaFunction
}) {
  const [idDetAttention, setIdDetAttention] = useState(null)

  const { userInfo } = useAuth()
  const [medicoId, setMedicoId] = useState(new Set([]))
  const { data, mutate, refresh } = useFetcher(useFecherFunction)
  const { data: doctorData } = useFetcher(getDoctorByAreaFunction)

  const dataToAtencion = useMemo(() => {
    return data
      .filter((d) => d.estado !== 'PP')
      .map((el, i) => ({
        ...el,
        index: i + 1
      }))
  }, [data])

  const dataToEspera = useMemo(() => {
    return data
      .filter((d) => d.estado === 'PP')
      .map((el, i) => ({
        ...el,
        index: i + 1
      }))
  }, [data])

  const renderCell = useCallback(
    (detail, columnKey, isposponer) => {
      const cellValue = detail[columnKey]
      const estadoTexto = listState[cellValue]
      const classChip = statusColorMap[cellValue]
      const index = detail.index

      switch (columnKey) {
        case 'create_at':
          return formatDate(cellValue, true)
        case 'estado':
          return (
            <Chip className={classChip} size='sm' variant='flat'>
              {estadoTexto}
            </Chip>
          )
        case 'acciones':
          return (
            <div className='relative flex items-center gap-x-2'>
              {index === 1 && !isposponer && (
                <div className='flex  items-center'>
                  <Tooltip
                    content={
                      detail.estado === 'P' ? 'Atender' : 'Confirmar Atencion'
                    }
                    color='primary'
                    closeDelay={0}
                  >
                    <Button
                      isIconOnly
                      color='primary'
                      size='sm'
                      variant='light'
                      onClick={() => {
                        if (detail.estado === 'P') {
                          handleChangeStatus(
                            detail.iddetatencion,
                            detail.estado
                          )
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
                    </Button>
                  </Tooltip>
                  {detail.estado === 'P' && (
                    <Tooltip content='Posponer' color='danger' closeDelay={0}>
                      <Button
                        size='sm'
                        isIconOnly
                        color='danger'
                        variant='light'
                        onClick={() =>
                          handleReorder(detail.iddetatencion, 'PP')
                        }
                      >
                        <ArrowDownNarrowWide size={20} />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              )}
              {isposponer && (
                <div>
                  <Tooltip content='Reanudar' color='primary' closeDelay={0}>
                    <Button
                      isIconOnly
                      size='sm'
                      isDisabled={verify}
                      color='primary'
                      variant='light'
                      onClick={() => handleReorder(detail.iddetatencion, 'P')}
                    >
                      <ArrowUpNarrowWide size={20} />
                    </Button>
                  </Tooltip>
                </div>
              )}
            </div>
          )
        default:
          return cellValue
      }
    },
    [data]
  )

  const selectMedico = Array.from(medicoId)[0]

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
      socket.emit('client:newAction', { action: "Change Atenciones" })
    } else {
      toast.error('Error al cambiar el estado')
    }
  }

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
    socket.emit('client:newAction', { action: "Change Atenciones" })
  }

  const handleCancel = () => {
    setIdDetAttention(null)
    setMedicoId(new Set([]))
  }

  const handleReorder = async (iddetatencion, estado) => {
    mutate((prevData) => {
      return prevData.map((item) => {
        if (item.iddetatencion === iddetatencion) {
          return {
            ...item,
            estado
          }
        } else {
          return item
        }
      })
    })
    await changeOrder({
      iddetatencion,
      estado
    })
  }

  const verify = data.some((el) => el.estado === 'A')

  useEffect(() => {
    socket.on('server:newAction', ({ action }) => {
      if (action === 'New Admision') {
        refresh()
      }
    })

    return () => socket.off('server:newAction')
  }, [])

  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>{nameArea}</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='mb-3'>
          <h1 className='text-xl'>En espera</h1>
        </div>
        <Table
          removeWrapper
          isStriped
          tabIndex={-1}
          aria-label='Lista de espera de pacientes'
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === 'actions' ? 'center' : 'start'}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent='No hay atenciones' items={dataToAtencion}>
            {(item) => (
              <TableRow key={crypto.randomUUID().toString()}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey, false)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Divider className='my-6' />

        <div className='mb-3'>
          <h1 className='text-xl'>Pospuestos</h1>
        </div>
        <Table
          removeWrapper
          isStriped
          tabIndex={-1}
          aria-label='Atenciones/Pacientes pospuestos'
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === 'actions' ? 'center' : 'start'}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent='No hay atenciones pospuestas'
            items={dataToEspera}
          >
            {(item) => (
              <TableRow key={crypto.randomUUID().toString()}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey, true)}</TableCell>
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
                <Select
                  placeholder='Médico a redactar el informe'
                  selectedKeys={medicoId}
                  onSelectionChange={setMedicoId}
                >
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
