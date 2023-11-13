import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Chip,
  Tooltip,
  Card,
  CardBody,
  Link,
  Spinner
} from '@nextui-org/react'
import Editor from '../../components/Editor'
import { useAuth } from '../../context/AuthContext'
import { useFetcher } from '../../hook/useFetcher'
import {
  changeStatus,
  getInProcessReportAttentionsByExternalDoctor
} from '../../services/admission'
import { listState, statusColorMap } from '../../constants/state'
import { addResult, removeResult, updateResult } from '../../services/result'
import { toast } from 'sonner'
import { AlertCircle, Eye, FileEdit } from 'lucide-react'
import { redirectToResult } from '../../config'
import Header from '../../components/Header'
import { socket } from '../../components/Socket'
import { useCallback, useMemo, useRef, useState } from 'react'

const columns = [
  { name: '#', uid: 'index' },
  { name: 'DNI', uid: 'num_documento' },
  { name: 'PACIENTE', uid: 'paciente' },
  { name: 'ÁREA', uid: 'nombre_area' },
  { name: 'CATEGORÍA', uid: 'nombre_categoria' },
  { name: 'SERVICIO', uid: 'nombre_servicio' },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'ACCIONES', uid: 'acciones' }
]

export default function GestionInformes() {
  const {
    isOpen: isOpenEditor,
    onOpen: onOpenEditor,
    onClose: onCloseEditor
  } = useDisclosure()

  const {
    isOpen: isOpenInfo,
    onOpen: onOpenInfo,
    onClose: onCloseInfo
  } = useDisclosure()

  const [isSaving, setIsSaving] = useState(false)

  const ref = useRef()
  const refTitulo = useRef()
  const idDet = useRef()
  const resultId = useRef()
  const status = useRef()
  const detailCurrent = useRef()

  const [medicalReportContent, setMedicalReportContent] = useState({
    titulo: '',
    contenido: ''
  })
  const [information, setInformation] = useState('')

  const { userInfo } = useAuth()

  const { data, loading, refresh } = useFetcher(() =>
    getInProcessReportAttentionsByExternalDoctor(userInfo.idpersona)
  )

  const items = useMemo(() => {
    return data.map((el, index) => ({
      ...el,
      index: index + 1
    }))
  }, [data])

  const renderCell = useCallback((element, columnKey) => {
    const cellValue = element[columnKey]

    switch (columnKey) {
      case 'paciente':
        return element.apellidos + ', ' + element.nombres
      case 'estado':
        return (
          <Chip
            className={`capitalize ${statusColorMap[cellValue]}`}
            variant='flat'
          >
            {listState[cellValue]}
          </Chip>
        )
      case 'acciones':
        return (
          <div className='relative flex items-center gap-x-1'>
            <Tooltip
              content={
                element.estado === 'PI'
                  ? 'Redactar'
                  : element.estado === 'PE'
                  ? 'Editar'
                  : 'Corregir'
              }
              color='primary'
              closeDelay={0}
            >
              <Button
                isIconOnly
                color='primary'
                variant='light'
                size='sm'
                onPress={() => {
                  if (element.idresultado) {
                    setMedicalReportContent(JSON.parse(element.diagnostico))
                  } else {
                    setMedicalReportContent({
                      titulo: `INFORME ${
                        element.nombre_area === 'Tomografía'
                          ? 'TOMOGRÁFICO'
                          : 'RADIOLÓGICO'
                      }`,
                      contenido: ''
                    })
                  }
                  idDet.current = element.iddetatencion
                  resultId.current = element.idresultado
                  status.current = element.estado
                  detailCurrent.current = element
                  refTitulo.current = `INFORME ${
                    element.nombre_area === 'Tomografía'
                      ? 'TOMOGRÁFICO'
                      : 'RADIOLÓGICO'
                  }`
                  onOpenEditor()
                }}
              >
                <FileEdit size={20} />
              </Button>
            </Tooltip>
            {element.idresultado && (
              <Tooltip content='Ver' color='primary' closeDelay={0}>
                <Button
                  isIconOnly
                  as={Link}
                  href={redirectToResult(element.iddetatencion)}
                  target='_blank'
                  rel='noreferrer'
                  color='primary'
                  variant='light'
                  size='sm'
                >
                  <Eye size={20} />
                </Button>
              </Tooltip>
            )}
            {element.estado === 'PC' && (
              <Tooltip
                content='Información'
                color='warning'
                className='text-white'
                closeDelay={0}
              >
                <Button
                  isIconOnly
                  color='warning'
                  variant='light'
                  size='sm'
                  onPress={() => {
                    setInformation(element.observacion)
                    onOpenInfo()
                  }}
                >
                  <AlertCircle size={20} />
                </Button>
              </Tooltip>
            )}
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const handleSubmit = async (onClose) => {
    try {
      setIsSaving(true)

      const template = {
        titulo: refTitulo.current,
        contenido: ref.current.getHtml()
      }

      let data = {
        idDetAtencion: idDet.current,
        diagnostico: JSON.stringify(template),
        idReferencia: 0
      }

      if (status.current !== 'PC') {
        if (!resultId.current) {
          const result = await addResult(data)

          if (result.isSuccess) {
            await changeStatus(idDet.current, 'PE')
            refresh()
            socket.emit('client:newAction', { action: 'New Informe' })
            onClose()
            toast.success(result.message)
          } else {
            toast.error(result.message)
          }
        } else {
          const result = await updateResult(data)
          if (result.isSuccess) {
            refresh()
            onClose()
            toast.success(result.message)
          }
        }
      } else {
        data = { ...data, idReferencia: resultId.current }
        const result = await removeResult(idDet.current)

        if (result.isSuccess) {
          addResult(data)
          socket.emit('client:newAction', { action: 'New Informe' })
          changeStatus(idDet.current, 'PE')
          onClose()
          toast.success(result.message)
          refresh()
        }
      }
    } catch {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className='bg-slate-100 h-screen flex flex-col p-5 gap-y-4'>
        <Header title='Gestión de Informes Médicos' />
        <Card className='h-full shadow-small rounded-2xl'>
          <CardBody>
            <Table
              isStriped
              removeWrapper
              tabIndex={-1}
              aria-label='Tabla de informes pendientes de redacción y de entrega'
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>
              <TableBody
                isLoading={loading}
                loadingContent={<Spinner />}
                emptyContent='No hay informes médicos para redactar en este momento'
                items={items}
              >
                {(item) => (
                  <TableRow key={item.iddetatencion}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      <Modal
        backdrop='blur'
        size='5xl'
        isOpen={isOpenEditor}
        onClose={onCloseEditor}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex gap-1 justify-between'>
                <h2>
                  {detailCurrent.current.estado === 'PI'
                    ? 'Crear Informe Médico'
                    : detailCurrent.current.estado === 'PE'
                    ? 'Editar Informe Médico'
                    : 'Corregir Informe Médico'}
                </h2>
                <div className='me-7 font-normal'>
                  <p className='text-sm'>
                    <b>Paciente:</b> {detailCurrent.current?.apellidos}{' '}
                    {detailCurrent.current?.nombres}
                  </p>
                  <p className='text-sm'>
                    <b>Servicio:</b> {detailCurrent.current?.nombre_servicio}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Input
                  label='Título del informe'
                  className='mb-2'
                  labelPlacement='inside'
                  defaultValue={medicalReportContent.titulo}
                  onChange={(e) => {
                    refTitulo.current = e.target.value
                  }}
                  key={medicalReportContent.titulo}
                />
                <Editor ref={ref} content={medicalReportContent.contenido} />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  isLoading={isSaving}
                  color='primary'
                  onPress={() => handleSubmit(onClose)}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal size='md' isOpen={isOpenInfo} onClose={onCloseInfo}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Detalles de la correción
              </ModalHeader>
              <ModalBody>
                <p>{information}</p>
              </ModalBody>
              <ModalFooter>
                <Button color='warning' variant='light' onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
