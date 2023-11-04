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
import { changeStatus, getServiciesByDoctor } from '../../services/admission'
import { listState, statusColorMap } from '../../constants/state'
import { addResult, removeResult, updateResult } from '../../services/result'
import { toast } from 'sonner'
import { AlertCircle, Eye, FileEdit } from 'lucide-react'
import { redirectToResult } from '../../config'
import Header from '../../components/Header'
import { socket } from '../../components/Socket'
import { useRef, useState } from 'react'

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
    getServiciesByDoctor(userInfo.idpersona)
  )

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
          changeStatus(idDet.current, 'PE')
          onClose()
          toast.success(result.message)
          refresh()
        }
      }
    } catch {
      toast.error('Ocurrió un error al guardar')
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
              aria-label='Tabla de informes pendientes de entrega'
            >
              <TableHeader>
                <TableColumn>DNI</TableColumn>
                <TableColumn>PACIENTE</TableColumn>
                <TableColumn>ÁREA</TableColumn>
                <TableColumn>CATEGORÍA</TableColumn>
                <TableColumn>SERVICIO</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={loading}
                loadingContent={<Spinner />}
                emptyContent='No hay informes médicos para redactar en este momento'
              >
                {data?.map((el, index) => (
                  <TableRow key={index}>
                    <TableCell>{el.num_documento}</TableCell>
                    <TableCell>{el.apellidos + ', ' + el.nombres}</TableCell>
                    <TableCell>{el.nombre_area}</TableCell>
                    <TableCell>{el.nombre_categoria}</TableCell>
                    <TableCell>{el.nombre_servicio}</TableCell>
                    <TableCell>
                      <Chip
                        className={`capitalize ${statusColorMap[el.estado]}`}
                        size='sm'
                        variant='flat'
                      >
                        {listState[el.estado]}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className='relative flex items-center gap-x-1'>
                        <Tooltip
                          content={
                            el.estado === 'PI'
                              ? 'Redactar'
                              : el.estado === 'PE'
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
                              if (el.idresultado) {
                                setMedicalReportContent(
                                  JSON.parse(el.diagnostico)
                                )
                              } else {
                                setMedicalReportContent({
                                  titulo: `INFORME ${
                                    el.nombre_area === 'Tomografía'
                                      ? 'TOMOGRÁFICO'
                                      : 'RADIOLÓGICO'
                                  }`,
                                  contenido: ''
                                })
                              }
                              idDet.current = el.iddetatencion
                              resultId.current = el.idresultado
                              status.current = el.estado
                              detailCurrent.current = el
                              refTitulo.current = `INFORME ${
                                el.nombre_area === 'Tomografía'
                                  ? 'TOMOGRÁFICO'
                                  : 'RADIOLÓGICO'
                              }`
                              onOpenEditor()
                            }}
                          >
                            <FileEdit size={20} />
                          </Button>
                        </Tooltip>
                        {el.idresultado && (
                          <Tooltip content='Ver' color='primary' closeDelay={0}>
                            <Button
                              isIconOnly
                              as={Link}
                              href={redirectToResult(el.iddetatencion)}
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
                        {el.estado === 'PC' && (
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
                                setInformation(el.observacion)
                                onOpenInfo()
                              }}
                            >
                              <AlertCircle size={20} />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
                    <b>Paciente:</b> {detailCurrent.current?.nombres}{' '}
                    {detailCurrent.current?.apellidos}
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
                <Button onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
