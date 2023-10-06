import React from 'react'
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  Chip
} from '@nextui-org/react'
import Editor from '../../components/Editor'
import { useAuth } from '../../context/AuthContext'
import { mapRoles } from '../../constants/auth.constant'
import { useFetcher } from '../../hook/useFetcher'
import { changeStatus, getServiciesByDoctor } from '../../services/admission'
import { listState, statusColorMap } from '../../constants/state'
import { addResult, updateResult } from '../../services/result'
import { toast } from 'sonner'
import { Eye, FileEdit } from 'lucide-react'
import { redirectToResult } from '../../config'

export default function ExternalModule() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const ref = React.useRef()
  const refTitulo = React.useRef()
  const idDet = React.useRef()
  const resultId = React.useRef()
  const detailCurrent = React.useRef()

  const [json, setjson] = React.useState({ titulo: '', contenido: '' })

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
    }
  }
  return (
    <>
      <div className='px-3 py-4 bg-slate-100 h-screen flex flex-col gap-y-4'>
        <header className='shadow bg-[white] flex justify-between items-center sticky top-4 px-4 py-5 rounded-lg'>
          <h1>Informes</h1>
          <Dropdown placement='bottom-start'>
            <DropdownTrigger>
              <User
                as='button'
                avatarProps={{
                  className: 'ml-2',
                  isBordered: true,
                  src: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${userInfo.nombres}`
                }}
                description={mapRoles[userInfo.nivel_acceso]}
                classNames={{
                  base: 'flex-row-reverse',
                  wrapper: 'items-end'
                }}
                name={`${userInfo.nombres} ${userInfo.apellidos}`}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='User Actions' variant='flat'>
              <DropdownItem key='profile'>Perfil</DropdownItem>
              <DropdownItem key='profile'>Firma</DropdownItem>
              <DropdownItem
                key='logout'
                color='danger'
                onClick={() => {
                  localStorage.removeItem('sidebarExpanded')
                  logout()
                }}
              >
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>
        <section className='px-4 py-3 bg-[white] shadow h-full'>
          <div className='mb-3'>filtros</div>
          <div>
            <Table aria-label='Example static collection table' shadow='none'>
              <TableHeader>
                <TableColumn>n°</TableColumn>
                <TableColumn>Dni</TableColumn>
                <TableColumn>Paciente</TableColumn>
                <TableColumn>Categoria</TableColumn>
                <TableColumn>Servicio</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Acciones</TableColumn>
              </TableHeader>
              <TableBody isLoading={loading} loadingContent='cargando'>
                {data?.map((el, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{el.num_documento}</TableCell>
                    <TableCell>
                      {el.nombres} {el.apellidos}
                    </TableCell>
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
                      <div className='flex items-center gap-x-2'>
                        <Button
                          isIconOnly
                          variant='light'
                          color='primary'
                          onPress={() => {
                            if (el.idresultado) {
                              setjson(JSON.parse(el.diagnostico))
                            } else {
                              setjson({ titulo: '', contenido: '' })
                            }
                            idDet.current = el.iddetatencion
                            resultId.current = el.idresultado
                            detailCurrent.current = el
                            onOpen()
                          }}
                        >
                          <FileEdit size={20} />
                        </Button>
                        {el.idresultado && (
                          <a
                            target='_blank'
                            href={redirectToResult(el.iddetatencion)}
                            className='text-gray-400'
                            rel='noreferrer'
                          >
                            <Eye size={20} />
                          </a>
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
      <Modal backdrop='blur' size='5xl' isOpen={isOpen} onClose={onClose}>
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
    </>
  )
}
