import React, { useEffect, useRef } from 'react'
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  CardHeader,
  RadioGroup,
  Tabs,
  Tab,
  Button,
  Divider,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Select,
  SelectItem,
  Tooltip
} from '@nextui-org/react'
import CustonRadio from '../../components/CustonRadio'
import {
  CircleDollarSign,
  Newspaper,
  Plus,
  ScrollText,
  Search,
  Trash2
} from 'lucide-react'
import DateTimeClock from '../../components/DateTimeClock'
import { getAllServices } from '../../services/servicios'
import { ModalServicios } from './components/ModalServicios'

function ModalNewPerson({ isOpen, onOpenChange, isPatient = false }) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Registrar {isPatient ? 'Paciente' : 'Cliente'}
              </ModalHeader>
              <ModalBody>
                <div className='flex flex-row gap-x-4'>
                  <Select size='lg' label='Tipo Documento'>
                    <SelectItem value='D'>DNI</SelectItem>
                    <SelectItem value='C'>Carnet de extranjeria</SelectItem>
                  </Select>
                  <Input className='mb-2' label='Numero Docuemento' size='lg' />
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input className='mb-2' label='Nombres' size='lg' />
                  <Input className='mb-2' label='Apellidos' size='lg' />
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input
                    type='date'
                    className='mb-2'
                    label='Fecha Nacimiento'
                    placeholder='fecha nacimiento'
                    size='lg'
                  />
                  <Input className='mb-2' label='Dirección' size='lg' />
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input className='mb-2' label='Correo' size='lg' />
                  <Input
                    className='mb-2'
                    label='Celular'
                    placeholder='Celular'
                    labelPlacement='outside'
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={onClose}>
                  Registrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

function ModalNewCompany({ isOpen, onOpenChange }) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Registrar Empresa
              </ModalHeader>
              <ModalBody>
                <div className='flex flex-col gap-y-4'>
                  <Input
                    className='mb-2'
                    label='Ruc'
                    placeholder='ruc'
                    labelPlacement='outside'
                  />
                  <Input
                    className='mb-2'
                    label='Razon Social'
                    labelPlacement='outside'
                    placeholder='Razon Social'
                  />

                  <Input
                    className='mb-2'
                    label='Dirección'
                    placeholder='dirección'
                    labelPlacement='outside'
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={onClose}>
                  Registrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default function Admision() {
  const [services, setServices] = React.useState([])
  const [tipoBoleta, setTipoBoleta] = React.useState('B')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isOpenPerson,
    onOpen: onOpenPerson,
    onOpenChange: onOpenChangePerson
  } = useDisclosure()
  const {
    isOpen: isOpenCompany,
    onOpen: onOpenCompany,
    onOpenChange: onOpenChangeCompany
  } = useDisclosure()

  const isPatient = useRef(false)

  const handleOpenModalNewClient = () => {
    if (tipoBoleta === 'B') {
      isPatient.current = false
      onOpenPerson()
    } else {
      onOpenCompany()
    }
  }

  useEffect(() => {
    getAllServices().then(setServices)
  }, [])

  return (
    <div className='flex flex-row h-full'>
      <Card className='w-full' shadow='none'>
        <CardHeader className='flex justify-between'>
          <span className='text-lg'>Admisión</span>
          <DateTimeClock />
        </CardHeader>
        <CardBody>
          <div>
            <Tabs aria-label='Options' variant='underlined' color='primary'>
              <Tab key='cliente' title='Datos Clientes'>
                <div className='flex flex-col gap-y-4'>
                  <RadioGroup value={tipoBoleta} onValueChange={setTipoBoleta}>
                    <div className='flex gap-6'>
                      <CustonRadio value='B'>
                        <ScrollText />
                        Boleta
                      </CustonRadio>
                      <CustonRadio value='F'>
                        <Newspaper />
                        Factura
                      </CustonRadio>
                    </div>
                  </RadioGroup>
                  <div className='flex flex-row gap-x-4'>
                    <Input
                      className='mb-2'
                      label='Numero documento'
                      labelPlacement='outside'
                      startContent={<Search />}
                      placeholder='Enter para buscar'
                      endContent={
                        <Button
                          isIconOnly
                          color='primary'
                          size='sm'
                          onClick={handleOpenModalNewClient}
                        >
                          <Plus />
                        </Button>
                      }
                    />
                    <Input
                      className='mb-2'
                      label='Cliente'
                      placeholder='Cliente'
                      labelPlacement='outside'
                    />
                  </div>
                </div>
              </Tab>
              <Tab key='paciente' title='Datos Paciente'>
                <div>
                  <div className='flex flex-row gap-x-4'>
                    <Input
                      className='mb-2'
                      label='Numero documento'
                      labelPlacement='outside'
                      startContent={<Search />}
                      placeholder='Enter para buscar'
                      endContent={
                        <Button
                          isIconOnly
                          color='primary'
                          size='sm'
                          onPress={() => {
                            isPatient.current = true
                            onOpenPerson()
                          }}
                        >
                          <Plus />
                        </Button>
                      }
                    />
                    <Input
                      className='mb-2'
                      label='Nombre Paciente'
                      placeholder='Nombre'
                      labelPlacement='outside'
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
          <Divider className='my-4' />
          <section className='flex gap-4 justify-between'>
            <article className='lg:flex-1'>
              <Button
                variant='light'
                startContent={<Plus />}
                color='primary'
                className='mb-4'
                onPress={onOpen}
              >
                Añadir Servicio
              </Button>
              <Table aria-label='Example static collection table' removeWrapper>
                <TableHeader>
                  <TableColumn>Servicio</TableColumn>
                  <TableColumn>Descripción</TableColumn>
                  <TableColumn>Precio</TableColumn>
                  <TableColumn>Descuento</TableColumn>
                  <TableColumn>Subtotal</TableColumn>
                  <TableColumn>Acción</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key='1'>
                    <TableCell>Tomografia </TableCell>
                    <TableCell>Lorem ipsum dolor sit amet.</TableCell>
                    <TableCell>20.00</TableCell>
                    <TableCell>
                      <Input />
                    </TableCell>
                    <TableCell>20.00</TableCell>
                    <TableCell>
                      <div className='relative flex items-center gap-2'>
                        <Tooltip color='danger' content='Eliminar Fila'>
                          <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                            <Trash2 className='w-5 h-5' />
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className='flex justify-between mt-4'>
                <Button variant='shadow' color='primary'>
                  Registrar Servicios
                </Button>
                <div className='bg-green-50 rounded text-green-950 py-5 w-[220px] flex flex-col items-center justify-center'>
                  <CircleDollarSign className='h-7 w-7' />
                  <span className='text-xl mt-4'>s/. 500</span>
                </div>
              </div>
            </article>
          </section>
        </CardBody>
      </Card>

      <ModalServicios
        data={services.data}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onChange={console.log}
      />

      <ModalNewPerson
        isPatient={isPatient.current}
        isOpen={isOpenPerson}
        onOpenChange={onOpenChangePerson}
      />
      <ModalNewCompany
        isOpen={isOpenCompany}
        onOpenChange={onOpenChangeCompany}
      />
    </div>
  )
}
