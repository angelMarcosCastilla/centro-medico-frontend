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
import {
  addPersonService,
  searchPersonById,
  searchPersonByNumDoc
} from '../../services/person'
import {
  addCompanyService,
  searchCompanyByRUC,
  searchCompanyById
} from '../../services/company'
import { useDataContext } from './components/DataContext'
import { getPaymentTypes } from '../../services/pay'

function ModalNewPerson({ isOpen, onOpenChange, isPatient = false }) {
  const [loading, setLoading] = useState(false)
  const { setDataPaciente, setDataCliente, dataToSend, setDataToSend } =
    useDataContext()

  const handleAddPerson = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    setLoading(true)
    const result = await addPersonService(Object.fromEntries(formData))
    setLoading(false)

    if (!result.isSuccess) {
      alert(result.message)
    } else {
      const dataPersona = await searchPersonById(result.data)

      const {
        idpersona,
        apellidos,
        nombres,
        fecha_nacimiento: fechaNacimiento,
        direccion
      } = dataPersona.data

      if (isPatient) {
        setDataPaciente({
          nombres: apellidos + ' ' + nombres,
          fechaNacimiento: new Date(fechaNacimiento).toLocaleDateString('es', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          direccion
        })
        setDataToSend({ ...dataToSend, idpaciente: idpersona })
      } else {
        setDataCliente({
          nombres: apellidos + ' ' + nombres,
          direccion
        })
        setDataToSend({ ...dataToSend, idcliente: [idpersona, 0] })
      }

      alert(result.message)
    }
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
  const [loading, setLoading] = useState(false)
  const { setDataCliente, dataToSend, setDataToSend } = useDataContext()

  const handleAddCompany = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    setLoading(true)
    const result = await addCompanyService(Object.fromEntries(formData))
    setLoading(false)

    if (!result.isSuccess) {
      alert(result.message)
    } else {
      const dataEmpresa = await searchCompanyById(result.data)

      const {
        idempresa,
        razon_social: razonSocial,
        direccion
      } = dataEmpresa.data

      setDataCliente({
        nombres: razonSocial,
        direccion
      })
      setDataToSend({ ...dataToSend, idcliente: [0, idempresa] })

      alert(result.message)
    }
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
                  <Button
                    color='primary'
                    type='submit'
                    size='lg'
                    isLoading={loading}
                    onPress={onClose}
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

export default function Admision() {
  const [services, setServices] = useState([])
  const [tipoPagos, setTipoPagos] = useState([])
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

  const [isSamePatient, setIsSamePatient] = useState(false)
  const isPatient = useRef(false)

  const {
    dataPaciente,
    setDataPaciente,
    dataCliente,
    setDataCliente,
    dataToSend,
    setDataToSend
  } = useDataContext()

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

  const handleSearchPerson = async (e) => {
    if (e.key !== 'Enter') return

    const numDocumento = e.target.value
    if (!numDocumento || numDocumento.length < 8) return

    const result = await searchPersonByNumDoc(numDocumento)

    if (!result.data) {
      alert('No he encontrado ningún resultado')
      setDataPaciente({})
      return
    }

    const {
      idpersona: idpaciente,
      apellidos,
      nombres,
      fecha_nacimiento: fechaNacimiento,
      direccion
    } = result.data

    setDataPaciente({
      nombres: apellidos + ' ' + nombres,
      fechaNacimiento: new Date(fechaNacimiento).toLocaleDateString('es', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      direccion
    })
    setDataToSend({
      ...dataToSend,
      idpaciente
    })
  }

  const handleSearchClient = async (e) => {
    if (e.key !== 'Enter') return

    setIsSamePatient(false)
    const numDocumentoOrRUC = e.target.value
    if (!numDocumentoOrRUC || numDocumentoOrRUC.length < 8) return

    if (tipoBoleta === 'B') {
      const result = await searchPersonByNumDoc(numDocumentoOrRUC)

      if (!result.data) {
        alert('No he encontrado ningún resultado')
        setDataPaciente({})
        return
      }

      const { idpersona, apellidos, nombres, direccion } = result.data

      setDataCliente({
        nombres: apellidos + ' ' + nombres,
        direccion
      })
      setDataToSend({
        ...dataToSend,
        idcliente: [idpersona, 0]
      })
    } else {
      const result = await searchCompanyByRUC(numDocumentoOrRUC)

      if (!result.data) {
        alert('No he encontrado ningún resultado')
        setDataPaciente({})
        return
      }

      const { idempresa, razon_social: razonSocial, direccion } = result.data

      setDataCliente({
        nombres: razonSocial,
        direccion
      })

      setDataToSend({
        ...dataToSend,
        idcliente: [0, idempresa]
      })
    }
  }

  useEffect(() => {
    if (!detService.length) return

    const montoTotal = detService.reduce(
      (acumulador, item) =>
        acumulador + parseFloat(item.precio) - parseFloat(item.descuento),
      0
    )

    const detalleAtencion = detService.map(
      ({ idservicio, precio, descuento }) => ({
        idServicio: idservicio,
        precioPagado: precio - descuento,
        descuento
      })
    )

    setDataToSend({
      ...dataToSend,
      pagoData: {
        ...dataToSend.pagoData,
        montoTotal
      },
      detalleAtencion
    })
  }, [detService])

  useEffect(() => {
    if (isSamePatient) {
      const { nombres, direccion } = dataPaciente
      const { idpaciente: idpersona } = dataToSend

      setDataCliente({ nombres, direccion })
      setDataToSend({
        ...dataToSend,
        idcliente: [idpersona, 0]
      })
    } else {
      setDataCliente({})
      setDataToSend({
        ...dataToSend,
        idcliente: []
      })
    }
  }, [isSamePatient])

  useEffect(() => {
    getAllServices().then(setServices)
    getPaymentTypes().then(setTipoPagos)
    setDataToSend({
      ...dataToSend,
      pagoData: {
        idUsuario: JSON.parse(localStorage.getItem('userInfo')).idusuario,
        tipoComprobante: tipoBoleta
      }
    })
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
                      maxLength={20}
                      onKeyDown={handleSearchPerson}
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
                  value={dataPaciente.nombres || ''}
                  readOnly
                />
                <Input
                  className='col-start-3 col-end-5'
                  label='Fecha nacimiento'
                  labelPlacement='outside'
                  size='lg'
                  value={dataPaciente.fechaNacimiento || ''}
                  readOnly
                />
                <Input
                  className='col-start-5 col-end-8'
                  label='Dirección'
                  labelPlacement='outside'
                  size='lg'
                  value={dataPaciente.direccion || ''}
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
                Agregar servicio
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
              <div className='grid grid-cols-7 gap-4 px-4'>
                <div className='col-start-1 col-end-3 mb-7'>
                  <ButtonGroup className='w-full items-end'>
                    <Input
                      label={
                        tipoBoleta === 'B' ? 'Número documento' : 'Número RUC'
                      }
                      labelPlacement='outside'
                      placeholder='Enter para buscar'
                      size='lg'
                      radius='none'
                      variant='underlined'
                      maxLength={20}
                      onKeyDown={handleSearchClient}
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
                <div className='grid col-start-4 col-end-6 justify-items-end'>
                  <RadioGroup
                    value={tipoBoleta}
                    onValueChange={setTipoBoleta}
                    onChange={(e) => {
                      setDataToSend({
                        ...dataToSend,
                        pagoData: {
                          ...dataToSend.pagoData,
                          tipoComprobante: e.target.value
                        }
                      })
                    }}
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
                <div className='col-start-6 col-end-8 row-span-4'>
                  <div className='bg-slate-100 h-full'>
                    <h2>RESUMEN</h2>
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
                <Input
                  className='col-start-1 col-end-3'
                  label={
                    tipoBoleta === 'B' ? 'Apellidos y nombres' : 'Razón social'
                  }
                  labelPlacement='outside'
                  size='lg'
                  value={dataCliente.nombres || ''}
                  readOnly
                />
                <Input
                  className='col-start-3 col-end-6'
                  label='Dirección'
                  labelPlacement='outside'
                  size='lg'
                  value={dataCliente.direccion || ''}
                  readOnly
                />
                {tipoBoleta === 'B' && (
                  <div className='grid col-start-3 col-end-6 justify-items-end'>
                    <Checkbox
                      isSelected={isSamePatient}
                      onValueChange={setIsSamePatient}
                    >
                      El paciente es el mismo cliente
                    </Checkbox>
                  </div>
                )}
                <Divider className='col-span-5 my-4' />
                <Select
                  label='Método de pago'
                  className='col-span-2 mt-3'
                  labelPlacement='outside'
                  variant='flat'
                  size='lg'
                >
                  {tipoPagos.data &&
                    tipoPagos.data.map((tipoPago) => (
                      <SelectItem
                        key={tipoPago.idtipopago}
                        value={tipoPago.idtipopago}
                      >
                        {tipoPago.tipo_pago}
                      </SelectItem>
                    ))}
                </Select>
                <div className='flex w-[200px] items-end'>
                  <Button
                    className=''
                    color='primary'
                    size='lg'
                    variant='light'
                    startContent={<Plus />}
                  >
                    Agregar pago
                  </Button>
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
