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
import { Navigate } from 'react-router-dom'
import { mapRoles } from '../../constants/auth.constant'
import { useFetcher } from '../../hook/useFetcher'
import { getServiciesByDoctor } from '../../services/admission'
import { capitalize } from '../../utils'
import { listState, statusColorMap } from '../../constants/state'

export default function ExternalModule() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const ref = React.useRef()
  const refTitulo = React.useRef()
  const [content, setContent] = React.useState('')
  const { isAuthenticated, userInfo, logout } = useAuth()
  const { data, loading } = useFetcher(() =>
    getServiciesByDoctor(userInfo.idpersona)
  )

  if (!isAuthenticated) return <Navigate to='/' />

  const handleSubmit = () => {
    const contentData = {
      titulo: refTitulo.current,
      contenido: ref.current.getHtml()
    }

    const data = {
      iddetatencion: 1,
      resultado_json: JSON.stringify(contentData),
      idpersonalmedico: userInfo.idpersona
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
                <TableColumn>Paciento</TableColumn>
                <TableColumn>Servicio</TableColumn>
                <TableColumn>Estado</TableColumn>
                <TableColumn>Acciones</TableColumn>
              </TableHeader>
              <TableBody isLoading={loading} loadingContent='cargando'>
                {data?.data?.map((el, index) => (
                  <TableRow key={index}>
                    <TableCell>{index}</TableCell>
                    <TableCell>{el.dni}</TableCell>
                    <TableCell>
                      {el.nombres} {el.apellidos}
                    </TableCell>
                    <TableCell>{el.nombre_servicio}</TableCell>
                    <TableCell>
                      <Chip
                        className={`capitalize ${statusColorMap[el.estado]}`}
                        size='sm'
                        variant='flat'
                      >
                        {capitalize(listState[el.estado])}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        onPress={() => {
                          setContent('item' + el.nombre_servicio)
                          onOpen()
                        }}
                      >
                        redactar
                      </Button>
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
              <ModalHeader className='flex flex-col gap-1'>
                <h2>Redactar Informe</h2>
              </ModalHeader>
              <ModalBody>
                <div className='flex items-center gap-x-6'>
                  <p className='text-sm'>servicio: aaswd</p>
                  <p className='text-sm'>paciente: asda</p>
                </div>
                <Input
                  label='Título del informe'
                  className='mb-2'
                  labelPlacement='inside'
                  onChange={(e) => {
                    refTitulo.current = e.target.value
                  }}
                />
                <Editor ref={ref} content={content} />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancelar
                </Button>
                <Button color='primary' onPress={() => handleSubmit(onClose)}>
                  Enviar Informe
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
