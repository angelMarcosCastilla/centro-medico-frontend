import { useEffect, useRef, useState } from 'react'
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
  ButtonGroup,
  Checkbox,
  CardFooter
} from '@nextui-org/react'
import CustomRadio from '../../components/CustomRadio'
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
                  <h2 className='text-xl'>
                    Registro de {isPatient ? 'paciente' : 'cliente'}
                  </h2>
                </ModalHeader>
                <ModalBody>
                  <div className='flex flex-row gap-x-4'>
                    <Select
                      size='lg'
                      label='Tipo documento'
                      defaultSelectedKeys={['D']}
                      name='tipoDocumento'
                      isRequired
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
                      label='Número documento'
                      size='lg'
                      name='numDocumento'
                      maxLength={20}
                      isRequired
                    />
                  </div>
                  <div className='flex flex-row gap-x-4'>
                    <Input
                      className='mb-2'
                      label='Nombres'
                      size='lg'
                      name='nombres'
                      maxLength={50}
                      isRequired
                    />
                    <Input
                      className='mb-2'
                      label='Apellidos'
                      size='lg'
                      name='apellidos'
                      maxLength={50}
                      isRequired
                    />
                  </div>
                  <div className='flex flex-row gap-x-4'>
                    <Input
                      name='fechaNacimiento'
                      type='date'
                      className='mb-2'
                      label='Fecha nacimiento'
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
                      size='lg'
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color='danger'
                    type='button'
                    variant='light'
                    size='lg'
                    onPress={onClose}
                  >
                    Cerrar
                  </Button>
                  <Button
                    color='primary'
                    type='submit'
                    size='lg'
                    isLoading={loading}
                  >
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
                <h2 className='text-xl'>Registro de empresa</h2>
              </ModalHeader>
              <ModalBody>
                <div className='flex flex-col gap-y-4'>
                  <Input
                    className='mb-2'
                    label='RUC'
                    size='lg'
                    maxLength={11}
                    isRequired
                     name='ruc'
                  />
                  <Input
                    className='mb-2'
                    label='Razon Social'
                    size='lg'
                    maxLength={50}
                    isRequired
                    name='razonSocial'
                  />

                  <Input
                    className='mb-2'
                    label='Dirección'
                    size='lg'
                    maxLength={150}
                    isRequired
                    name='direccion'
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  type='button'
                  variant='light'
                  size='lg'
                  onPress={onClose}
                >
                  Cerrar
                </Button>
                <Button color='primary' type="submit" size='lg' onPress={onClose}>
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
  const [services, setServices] = useState([])
  const [tipoBoleta, setTipoBoleta] = useState('B')
  const [detService, setDetService] = useState([])
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
    return monto.toFixed(2)
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
          <h2 className='text-2xl'>Recepción y admisión</h2>
          <DateTimeClock />
        </CardHeader>
        <Divider />
        <CardBody>
          <Tabs
            aria-label='Options'
            variant='underlined'
            color='primary'
            size='lg'
          >
            <Tab key='informacion-paciente' title='Información del paciente'>
              <div className='grid grid-cols-7 gap-4 px-4'>
                <div className='col-start-1 col-end-3 mb-7'>
                  <ButtonGroup className='w-full items-end'>
                    <Input
                      label='Número documento'
                      labelPlacement='outside'
                      placeholder='Enter para buscar'
                      size='lg'
                      radius='none'
                      variant='underlined'
                      maxLength={8}
                      startContent={<Search />}
                    />
                    <Button
                      isIconOnly
                      color='primary'
                      size='lg'
                      onPress={() => {
                        isPatient.current = true
                        onOpenPerson()
                      }}
                    >
                      <Plus />
                    </Button>
                  </ButtonGroup>
                </div>
                <Input
                  className='col-start-1 col-end-3'
                  label='Apellidos y nombres'
                  labelPlacement='outside'
                  size='lg'
                  readOnly
                />
                <Input
                  className='col-start-3 col-end-5'
                  label='Fecha nacimiento'
                  labelPlacement='outside'
                  size='lg'
                  readOnly
                />
                <Input
                  className='col-start-5 col-end-8'
                  label='Dirección'
                  labelPlacement='outside'
                  size='lg'
                  readOnly
                />
              </div>
              <Divider className='my-4' />
              <Button
                variant='light'
                startContent={<Plus />}
                color='primary'
                className='mb-4'
                size='lg'
                onPress={onOpen}
              >
                Agregar nuevo
              </Button>
              <Table aria-label='Tabla de servicios elegidos' removeWrapper>
                <TableHeader>
                  <TableColumn>SERVICIO</TableColumn>
                  <TableColumn>DESCRIPCIÓN</TableColumn>
                  <TableColumn>PRECIO</TableColumn>
                  <TableColumn>DESCUENTO</TableColumn>
                  <TableColumn>SUBTOTAL</TableColumn>
                  <TableColumn>ACCIÓN</TableColumn>
                </TableHeader>
                <TableBody emptyContent='Agrega algún servicio para visualizar'>
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
                        {(service.precio - service.descuento).toFixed(2)}
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
            </Tab>
            <Tab key='metodo-pago' title='Método de pago'>
              <div className='grid grid-cols-3 gap-6'>
                <div className='col-span-2'>
                  <div className='col-start-1 col-end-3 mb-7'>
                    <ButtonGroup className='w-full items-end'>
                      <Input
                        label='Número documento'
                        labelPlacement='outside'
                        placeholder='Enter para buscar'
                        size='lg'
                        radius='none'
                        variant='underlined'
                        maxLength={8}
                        startContent={<Search />}
                      />
                      <Button
                        isIconOnly
                        color='primary'
                        size='lg'
                        onClick={handleOpenModalNewClient}
                      >
                        <Plus />
                      </Button>
                    </ButtonGroup>
                  </div>
                  <div className='grid col-start-6 col-end-8 justify-items-end'>
                    <RadioGroup
                      value={tipoBoleta}
                      onValueChange={setTipoBoleta}
                    >
                      <div className='flex gap-6'>
                        <CustomRadio value='B'>
                          <ScrollText />
                          Boleta
                        </CustomRadio>
                        <CustomRadio value='F'>
                          <Newspaper />
                          Factura
                        </CustomRadio>
                      </div>
                    </RadioGroup>
                  </div>
                  <Input
                    className='col-start-1 col-end-4'
                    label={
                      tipoBoleta === 'B'
                        ? 'Apellidos y Nombres'
                        : 'Razón social'
                    }
                    labelPlacement='outside'
                    size='lg'
                    readOnly
                  />
                  <Input
                    className='col-start-4 col-end-8'
                    label='Dirección'
                    labelPlacement='outside'
                    size='lg'
                    readOnly
                  />
                  {tipoBoleta === 'B' && (
                    <div className='grid col-start-5 col-end-8 justify-items-end'>
                      <Checkbox defaultSelected>
                        El paciente es el mismo cliente
                      </Checkbox>
                    </div>
                  )}
                </div>
                <div className='bg-slate-100'>
                  <div className='flex gap-4 justify-between'>
                    <div className='lg:flex-1'>
                      <div className='flex justify-end mt-4'>
                        <div className='bg-green-200 rounded text-green-950 py-5 w-[220px] flex flex-col items-center justify-center'>
                          <CircleDollarSign size={30} />
                          <span className='text-xl mt-4'>
                            S/. {montoTotal()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
        <CardFooter className='flex justify-end'>
          <Button color='primary' size='lg'>
            Guardar
          </Button>
        </CardFooter>
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