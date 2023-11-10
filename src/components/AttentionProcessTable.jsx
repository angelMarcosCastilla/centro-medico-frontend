import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Avatar,
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
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure
} from '@nextui-org/react'
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Eye,
  MonitorCheck,
  MonitorPlay
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
import PatientDetailsModal from './PatientDetailsModal'

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
  const [idpago, setIdPago] = useState(null)

  const { userInfo } = useAuth()
  const [medicoId, setMedicoId] = useState(new Set([]))
  const { data, mutate, loading, refresh } = useFetcher(useFecherFunction)
  const { data: doctorData } = useFetcher(getDoctorByAreaFunction)
  const [detAttention, setDetAttention] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

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

  const doctors = useMemo(() => {
    return doctorData.map((doctor) => ({
      ...doctor,
      medico: doctor.nombres + ' ' + doctor.apellidos,
      avatar: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${
        doctor.nombres + ' ' + doctor.apellidos
      }`
    }))
  }, [doctorData])

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
            <Chip className={classChip} variant='flat'>
              {estadoTexto}
            </Chip>
          )
        case 'acciones':
          return (
            <div className='relative flex items-center gap-x-1'>
              {detail.triaje && (
                <Tooltip content='Detalles' color='primary' closeDelay={0}>
                  <Button
                    isIconOnly
                    color='primary'
                    size='sm'
                    variant='light'
                    onPress={() => {
                      setDetAttention(detail)
                      onOpen()
                    }}
                  >
                    <Eye size={20} />
                  </Button>
                </Tooltip>
              )}
              {index === 1 && !isposponer && (
                <>
                  <Tooltip
                    content={detail.estado === 'P' ? 'Atender' : 'Confirmar'}
                    color='primary'
                    closeDelay={0}
                  >
                    <Button
                      isIconOnly
                      color='primary'
                      size='sm'
                      variant='light'
                      onPress={() => {
                        if (detail.estado === 'P') {
                          handleChangeStatus(
                            detail.iddetatencion,
                            detail.idpago
                          )
                        } else {
                          setIdDetAttention(detail.iddetatencion)
                          setIdPago(detail.idpago)
                        }
                      }}
                    >
                      {detail.estado === 'P' ? (
                        <MonitorPlay size={20} />
                      ) : (
                        <MonitorCheck size={20} />
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
                        onPress={() =>
                          handleReorder(detail.iddetatencion, 'PP')
                        }
                      >
                        <ArrowDownNarrowWide size={20} />
                      </Button>
                    </Tooltip>
                  )}
                </>
              )}
              {isposponer && (
                <Tooltip content='Reanudar' color='primary' closeDelay={0}>
                  <Button
                    isIconOnly
                    size='sm'
                    isDisabled={verify}
                    color='primary'
                    variant='light'
                    onPress={() => handleReorder(detail.iddetatencion, 'P')}
                  >
                    <ArrowUpNarrowWide size={20} />
                  </Button>
                </Tooltip>
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

  const handleChangeStatus = async (idDetAttention, idpago) => {
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
      socket.emit('client:newAction', { action: 'Change Atenciones', idpago })
    } else {
      toast.error('Error al cambiar el estado')
    }
  }

  const handleSuccess = async (onClose) => {
    try {
      setIsSaving(true)

      const data = {
        idmedicoatendiente: userInfo.idpersonalmedico,
        idmedicoinformante: parseInt(selectMedico)
      }

      mutate((prevData) => {
        return prevData.filter((item) => item.iddetatencion !== idDetAttention)
      })

      handleCancel()
      await updateMedicoByDetatencion(data, idDetAttention)
      onClose()
      socket.emit('client:newAction', { action: 'Change Atenciones', idpago })
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setIsSaving(false)
    }
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
          <TableBody
            isLoading={loading}
            loadingContent={<Spinner />}
            emptyContent='No hay atenciones en espera'
            items={dataToAtencion}
          >
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
            isLoading={loading}
            loadingContent={<Spinner />}
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

      <PatientDetailsModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        detail={detAttention}
      />

      <Modal
        isOpen={Boolean(idDetAttention)}
        onOpenChange={() => setIdDetAttention(null)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Seleccione el Médico para el Informe</ModalHeader>
              <ModalBody>
                <Select
                  items={doctors}
                  label='Asignar a'
                  placeholder='Selecciona un doctor'
                  selectedKeys={medicoId}
                  onSelectionChange={setMedicoId}
                >
                  {(doctor) => (
                    <SelectItem
                      key={doctor.idpersonalmedico}
                      textValue={doctor.medico}
                    >
                      <div className='flex gap-2 items-center'>
                        <Avatar
                          alt={doctor.medico}
                          className='flex-shrink-0'
                          size='sm'
                          src={doctor.avatar}
                        />
                        <div className='flex flex-col'>
                          <span className='text-small'>{doctor.medico}</span>
                          <span className='text-tiny text-default-400'>
                            {doctor.correo}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
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
                  isLoading={isSaving}
                  color='primary'
                  onPress={() => {
                    handleSuccess(onClose)
                  }}
                  isDisabled={!selectMedico}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
