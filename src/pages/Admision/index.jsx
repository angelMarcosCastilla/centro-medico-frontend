import React, { useEffect, useRef, useState } from 'react'
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
  SelectItem
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
import { addPersonService } from '../../services/person'
import { addCompanyService } from '../../services/company'

function ModalNewPerson({ isOpen, onOpenChange, isPatient = false }) {
  const [loading, setLoading] = useState(false)
  const handleAddPerson = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    setLoading(true)
    await addPersonService(Object.fromEntries(formData))
    setLoading(false)
  }
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <form onSubmit={handleAddPerson} autoComplete='off'>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Registrar {isPatient ? 'Paciente' : 'Cliente'}
                </ModalHeader>
                <ModalBody>
                  <div className='flex flex-row gap-x-4'>
                    <Select
                      size='lg'
                      label='Tipo Documento'
                      defaultSelectedKeys={['D']}
                      isRequired
                      name='tipoDocumento'
                    >
                      <SelectItem value='D' key={'D'}>
                        DNI
                      </SelectItem>
                      <SelectItem value='C' key={'C'}>
                        Carnet de extranjeria
                      </SelectItem>
                    </Select>
                    <Input
                      className='mb-2'
                      label='Numero Docuemento'
                      size='lg'
                      isRequired
                      name='numDocumento'
                    />
                  </div>
                  <div className='flex flex-row gap-x-4'>
                    <Input
                      className='mb-2'
                      label='Nombres'
                      size='lg'
                      isRequired
                      name='nombres'
                    />
                    <Input
                      className='mb-2'
                      label='Apellidos'
                      size='lg'
                      isRequired
                      name='apellidos'
                    />
                  </div>
                  <div className='flex flex-row gap-x-4'>
                    <Input
                      name='fechaNacimiento'
                      type='date'
                      className='mb-2'
                      label='Fecha Nacimiento'
                      placeholder='fecha nacimiento'
                      size='lg'
                      isRequired
                    />
                    <Input
                      className='mb-2'
                      label='Dirección'
                      size='lg'
                      name='direccion'
                    />
                  </div>
                  <div className='flex flex-row gap-x-4'>
                    <Input
                      className='mb-2'
                      label='Correo'
                      size='lg'
                      name='correo'
                    />
                    <Input
                      name='celular'
                      className='mb-2'
                      label='Celular'
                      placeholder='Celular'
                      size='lg'
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color='danger'
                    type='button'
                    variant='light'
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button color='primary' type='submit' isLoading={loading}>
                    Registrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

function ModalNewCompany({ isOpen, onOpenChange }) {
  const handleAddCompany = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    await addCompanyService(Object.fromEntries(formData))
  }
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <form onSubmit={handleAddCompany} autoComplete='off'>
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
                      name='ruc'
                    />
                    <Input
                      className='mb-2'
                      label='Razon Social'
                      labelPlacement='outside'
                      placeholder='Razon Social'
                      name='razonSocial'
                    />

                    <Input
                      className='mb-2'
                      label='Dirección'
                      placeholder='dirección'
                      labelPlacement='outside'
                      name='direccion'
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='light' onPress={onClose}>
                    Close
                  </Button>
                  <Button color='primary'type='submit'  onPress={onClose}>
                    Registrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

export default function Admision() {
  const [services, setServices] = React.useState([])
  const [tipoBoleta, setTipoBoleta] = React.useState('B')
  const [detService, setDetService] = React.useState([])
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

  const handleAddServices = (data) => {
    setDetService([...detService, data])
  }

  const montoTotal = () => {
    let monto = 0
    detService.forEach((item) => {
      monto += parseFloat(item.precio)
    })
    return monto
  }

  const handleRemoveServices = (idservice) => {
    setDetService((prevalue) =>
      prevalue.filter((item) => item.idservicio !== idservice)
    )
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
                  {detService.map((service) => (
                    <TableRow key={service.idservicio}>
                      <TableCell>{service.nombre} </TableCell>
                      <TableCell>{service.observacion}</TableCell>
                      <TableCell>{service.precio}</TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          min={0}
                          value={service.descuento}
                          onChange={(e) => {
                            const descuento = e.target.value
                            setDetService((prevService) => {
                              return prevService.map((prevService) => {
                                return prevService.idservicio ===
                                  service.idservicio
                                  ? { ...service, descuento }
                                  : prevService
                              })
                            })
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {service.precio - service.descuento}
                      </TableCell>
                      <TableCell>
                        <div className='relative flex items-center gap-2'>
                          <Button
                            isIconOnly
                            variant='light'
                            color='danger'
                            onClick={() =>
                              handleRemoveServices(service.idservicio)
                            }
                          >
                            <Trash2 size={20} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className='flex justify-between mt-4'>
                <Button variant='shadow' color='primary'>
                  Registrar Servicios
                </Button>
                <div className='bg-green-50 rounded text-green-950 py-5 w-[220px] flex flex-col items-center justify-center'>
                  <CircleDollarSign className='h-7 w-7' />
                  <span className='text-xl mt-4'>{montoTotal()}</span>
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
        onChange={handleAddServices}
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
