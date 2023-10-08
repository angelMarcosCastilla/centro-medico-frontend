import React, { useState } from 'react'
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
  Tooltip
} from '@nextui-org/react'
import Editor from '../../components/Editor'
import { useAuth } from '../../context/AuthContext'
import { useFetcher } from '../../hook/useFetcher'
import { changeStatus, getServiciesByDoctor } from '../../services/admission'
import { listState, statusColorMap } from '../../constants/state'
import { addResult, updateResult } from '../../services/result'
import { toast } from 'sonner'
import { AlertCircle, Eye, FileEdit } from 'lucide-react'
import { redirectToResult } from '../../config'
import Header from '../../components/Header'

export default function ExternalModule() {
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

  const ref = React.useRef()
  const refTitulo = React.useRef()
  const idDet = React.useRef()
  const resultId = React.useRef()
  const detailCurrent = React.useRef()

  const [json, setjson] = React.useState({ titulo: '', contenido: '' })
  const [information, setInformation] = React.useState('')

  const { userInfo, logout } = useAuth()

  const { data, loading, mutate } = useFetcher(() =>
    getServiciesByDoctor(userInfo.idpersona)
  )

  const handleSubmit = async () => {
    const template = {
      titulo: refTitulo.current,
      contenido: ref.current.getHtml()
    }

    const data = {
      idDetAtencion: idDet.current,
      diagnostico: JSON.stringify(template)
    }

    if (!resultId.current) {
      const result = await addResult(data)
      const idresultado = result.data

      if (result.isSuccess) {
        await changeStatus(idDet.current, 'PE')
        mutate((prev) =>
          prev.map((el) =>
            el.iddetatencion === idDet.current
              ? {
                  ...el,
                  estado: 'PE',
                  idresultado,
                  diagnostico: data.diagnostico
                }
              : el
          )
        )
        onClose()
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } else {
      const result = await updateResult(data)
      if (result.isSuccess) {
        mutate((prev) =>
          prev.map((el) =>
            el.iddetatencion === idDet.current
              ? {
                  ...el,
                  diagnostico: data.diagnostico
                }
              : el
          )
        )
        onClose()
        toast.success(result.message)
      }
      console.log(result)
    }
  }

  return (
    <>
      <div className='px-3 py-4 bg-slate-100 h-screen flex flex-col gap-y-4'>
        <Header />
        <section className='px-4 py-3 bg-[white] shadow h-full'>
          <div className='mb-3'>filtros</div>
          <div>
            <Table aria-label='Example static collection table' shadow='none'>
              <TableHeader>
                <TableColumn>N°</TableColumn>
                <TableColumn>DNI</TableColumn>
                <TableColumn>PACIENTE</TableColumn>
                <TableColumn>ÁREA</TableColumn>
                <TableColumn>CATEGORÍA</TableColumn>
                <TableColumn>SERVICIO</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody isLoading={loading} loadingContent='cargando'>
                {data?.map((el, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{el.num_documento}</TableCell>
                    <TableCell>
                      {el.nombres} {el.apellidos}
                    </TableCell>
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
                      <div className='relative flex items-center gap-2'>
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
                          <span
                            className='text-lg text-primary-400 cursor-pointer active:opacity-50'
                            onClick={() => {
                              if (el.idresultado) {
                                setjson(JSON.parse(el.diagnostico))
                              } else {
                                setjson({ titulo: '', contenido: '' })
                              }
                              idDet.current = el.iddetatencion
                              resultId.current = el.idresultado
                              detailCurrent.current = el
                              onOpenEditor()
                            }}
                          >
                            <FileEdit size={20} />
                          </span>
                        </Tooltip>
                        {el.idresultado && (
                          <Tooltip content='Ver' color='primary' closeDelay={0}>
                            <a
                              className='text-lg text-primary-400 cursor-pointer active:opacity-50'
                              href={redirectToResult(el.iddetatencion)}
                              target='_blank'
                              rel='noreferrer'
                            >
                              <Eye size={20} />
                            </a>
                          </Tooltip>
                        )}
                        {el.estado === 'PC' && (
                          <Tooltip
                            content='Información'
                            color='warning'
                            closeDelay={0}
                          >
                            <span
                              className='text-lg text-warning-400 cursor-pointer active:opacity-50'
                              onClick={() => {
                                setInformation(el.observacion)
                                onOpenInfo()
                              }}
                            >
                              <AlertCircle size={20} />
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
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
              <ModalHeader className='flex  gap-1 justify-between'>
                <h2>Redactar Informe</h2>
                <div className='pr-7 font-normal'>
                  <p className='text-sm'>
                    <b>Paciente</b> {detailCurrent.current?.nombres}{' '}
                    {detailCurrent.current?.apellidos}
                  </p>
                  <p className='text-sm'>
                    <b>servicio:</b> {detailCurrent.current?.nombre_servicio}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Input
                  label='Título del informe'
                  className='mb-2'
                  labelPlacement='inside'
                  defaultValue={json.titulo}
                  onChange={(e) => {
                    refTitulo.current = e.target.value
                  }}
                />
                <Editor ref={ref} content={json.contenido} />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancelar
                </Button>
                <Button color='primary' onPress={() => handleSubmit(onClose)}>
                  {resultId.current ? 'Actualizar informe' : 'Redactar informe'}
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
