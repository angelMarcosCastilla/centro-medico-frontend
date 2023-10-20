import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  CardBody,
  Chip,
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
import { ArrowDownWideNarrow, MonitorPause, UserCheck } from 'lucide-react'
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

const columns = [
  { name: '#', uid: 'index' },
  { name: 'PACIENTE', uid: 'paciente', sortable: true },
  { name: 'CATEGORIA', uid: 'nombre_categoria', sortable: true },
  { name: 'TIPO DE SERVICIO', uid: 'nombre_servicio', sortable: true },
  { name: 'ESTADO', uid: 'estado', sortable: true },
  { name: 'ACCIONES', uid: 'acciones' }
]

export default function AttentionProcessTable({
  useFecherFunction,
  getDoctorByAreaFunction
}) {
  const [idDetAttention, setIdDetAttention] = useState(null)

  const { userInfo } = useAuth()
  const [medicoId, setMedicoId] = useState(new Set([]))
  const { data, mutate, refresh } = useFetcher(useFecherFunction)
  const { data: doctorData } = useFetcher(getDoctorByAreaFunction)

  const renderCell = useCallback(
    (detail, columnKey) => {
      const cellValue = detail[columnKey]
      const estadoTexto = listState[cellValue]
      const classChip = statusColorMap[cellValue]
      const index = detail.index
      switch (columnKey) {
        case 'estado':
          return (
            <Chip
              className={`capitalize ${classChip}`}
              size='sm'
              variant='flat'
            >
              {estadoTexto}
            </Chip>
          )
        case 'acciones':
          return (
            <div className='relative flex items-center gap-x-2'>
              {index === 1 && (
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
                        onClick={handleReorder}
                      >
                        <ArrowDownWideNarrow size={20} />
                      </Button>
                    </Tooltip>
                  )}
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
  }

  const handleCancel = () => {
    setIdDetAttention(null)
    setMedicoId(new Set([]))
  }

  const items = useMemo(() => {
    return data.map((el, index) => ({ ...el, index: index + 1 }))
  }, [data])

  const handleReorder = async () => {
    if (data.length > 1) {
      const firstValue = data[0]
      const secondValue = data[1]

      mutate((prevValue) => {
        return prevValue.map((item, index) => {
          if (index === 0)
            return { ...secondValue, num_atencion: firstValue.num_atencion }
          if (index === 1)
            return { ...firstValue, num_atencion: secondValue.num_atencion }
          return item
        })
      })

      await changeOrder({
        firstDetAtencion: secondValue.iddetatencion,
        firstNumOrder: firstValue.num_atencion,
        secondDetAtencion: firstValue.iddetatencion,
        secondNumOrder: secondValue.num_atencion
      })
    }
  }

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
      <CardBody>
        <div>
          <h1 className='text-2xl'>Lista atenciones</h1>
        </div>
        <Table
          aria-label='Example table with custom cells, pagination and sorting'
          isHeaderSticky
          isStriped
          bottomContentPlacement='outside'
          classNames={{
            wrapper: 'max-h-[600px]'
          }}
          topContentPlacement='outside'
          shadow='none'
        >
          <TableHeader columns={columns}>
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
          <TableBody emptyContent={'No se encontraron pacientes'} items={items}>
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
