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
import { searchPersonByNumDoc } from '../../services/person'
import { searchCompanyByRUC } from '../../services/company'
import { useDataContext } from './components/DataContext'
import { getPaymentTypes } from '../../services/pay'
import { addAdmissionAndData } from '../../services/admission'
import { toast } from 'sonner'
import ModalNewPerson from './components/ModaNewPerson'
import ModalNewCompany from './components/ModalNewCompany'
import PaymentDetails from './components/PaymentDetails'
import { validateFieldsFormAdmision } from './utils'

export default function Admision() {
  const [services, setServices] = useState([])
  const [tipoPagos, setTipoPagos] = useState([])
  const [tipoBoleta, setTipoBoleta] = useState('B')
  const [detService, setDetService] = useState([])
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selected, setSelected] = useState('informacion-paciente')
  const [resetTable, setResetTable] = useState(crypto.randomUUID())

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
    setDataToSend,
    resetDataToSend
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
      monto += parseFloat(item.precio) - parseFloat(item.descuento)
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
      toast.error('No he encontrado ningún resultado')
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
        toast.error('No he encontrado ningún resultado')
        setDataPaciente({})
        return
      }

      const { idpersona, apellidos, nombres, direccion } = result.data

      setDataCliente({
        nombres: apellidos + ' ' + nombres,
        direccion,
        estado: 0
      })
      setDataToSend({
        ...dataToSend,
        idcliente: [idpersona, 0]
      })
    } else {
      const result = await searchCompanyByRUC(numDocumentoOrRUC)

      if (!result.data) {
        toast.error('No he encontrado ningún resultado')
        setDataPaciente({})
        return
      }

      const {
        idempresa,
        razon_social: razonSocial,
        direccion,
        estado
      } = result.data

      setDataCliente({
        nombres: razonSocial,
        direccion,
        estado: Number(!!estado)
      })

      setDataToSend({
        ...dataToSend,
        idcliente: [0, idempresa]
      })
    }
  }

  const handleAddAdmissionAndData = async () => {
    const updatedDataToSend = {
      ...dataToSend,
      pagoData: {
        ...dataToSend.pagoData,
        saldo: 0,
        convenio: dataCliente.estado
      }
    }

    const result = await addAdmissionAndData(updatedDataToSend)

    if (result.isSuccess) {
      toast.success(result.message)
      setDataPaciente({})
      setDataCliente({})
      setDetService([])
      setIsSamePatient(false)
      setSelected('informacion-paciente')
      setResetTable(crypto.randomUUID())
      resetDataToSend()
    } else {
      toast.error(result.message)
    }
  }

  useEffect(() => {
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
        montoTotal: montoTotal()
      },
      detalleAtencion
    })
  }, [detService])

  const handlePayment = (detPago) => {
    const detallePago = detPago.map((pago) => ({
      tipoPago: pago.idtipopago,
      montoPagado: pago.cantidad
    }))

    setDataToSend({
      ...dataToSend,
      detallePago
    })
  }


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
  }, [])

  useEffect(() => {
    // Cada ves que se cambie de boleta a factura o viceversa se debe limpiar los datos del cliente
    setDataCliente({})
    setIsSamePatient(false)
  }, [tipoBoleta])

  const isDisableButton = validateFieldsFormAdmision(dataToSend, false)
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
            selectedKey={selected}
            onSelectionChange={setSelected}
            aria-label='Options'
            variant='underlined'
            color='primary'
            size='lg'
          >
            <Tab key='informacion-paciente' title='Información del paciente'>
              <div className='flex gap-x-4 mb-6'>
                <Input
                  placeholder='Enter para buscar'
                  size='lg'
                  radius='none'
                  className='rounded-lg w-[300px] flex-shrink-0'
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
              </div>

              <div className='flex flex-row gap-x-5'>
                <Input
                  className='flex-1'
                  label='Apellidos y nombres'
                  size='lg'
                  value={dataPaciente.nombres || ''}
                  readOnly
                />
                <Input
                  className='flex-1'
                  label='Fecha nacimiento'
                  size='lg'
                  value={dataPaciente.fechaNacimiento || ''}
                  readOnly
                />
                <Input
                  className='flex-1'
                  label='Dirección'
                  size='lg'
                  value={dataPaciente.direccion || ''}
                  readOnly
                />
              </div>
              <Divider className='my-5' />
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
              <Table
                aria-label='Tabla de servicios elegidos'
                removeWrapper
                color='secondary'
              >
                <TableHeader>
                  <TableColumn className='bg-blue-50'>SERVICIO</TableColumn>
                  <TableColumn className='bg-blue-50'>DESCRIPCIÓN</TableColumn>
                  <TableColumn className='bg-blue-50'>PRECIO</TableColumn>
                  <TableColumn className='bg-blue-50'>DESCUENTO</TableColumn>
                  <TableColumn className='bg-blue-50'>SUBTOTAL</TableColumn>
                  <TableColumn className='bg-blue-50'>ACCIÓN</TableColumn>
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
              <div className='grid grid-cols-[1fr_350px] gap-x-10'>
                <div className='flex flex-col gap-y-5'>
                  <div className='flex justify-between gap-x-8'>
                    <div className='flex items-end gap-x-2'>
                      <Input
                        label={
                          tipoBoleta === 'B' ? 'Número documento' : 'Número RUC'
                        }
                        labelPlacement='outside'
                        placeholder='Enter para buscar'
                        size='lg'
                        radius='none'
                        className='rounded-lg w-[300px] flex-shrink-0'
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
                    </div>

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
                  <div className='flex gap-x-5'>
                    <Input
                      className='col-start-1 col-end-3'
                      label={
                        tipoBoleta === 'B'
                          ? 'Apellidos y nombres'
                          : 'Razón social'
                      }
                      size='lg'
                      value={dataCliente.nombres || ''}
                      readOnly
                    />
                    <Input
                      className='col-start-3 col-end-6'
                      label='Dirección'
                      size='lg'
                      value={dataCliente.direccion || ''}
                      readOnly
                    />
                  </div>
                  {tipoBoleta === 'B' && (
                    <div className='justify-items-start'>
                      <Checkbox
                        isSelected={isSamePatient}
                        onValueChange={setIsSamePatient}
                      >
                        El paciente es el mismo cliente
                      </Checkbox>
                    </div>
                  )}
                  <Divider className='col-span-5 my-4' />
                  <PaymentDetails
                    key={resetTable}
                    tipoPagos={tipoPagos}
                    onChange={handlePayment}
                    totalPayment={montoTotal()}
                  />
                </div>
                <article className='bg-slate-100 h-full px-3 py-3'>
                  <h2 className='mb-7 px-5'>Detalles servicios</h2>
                  <div className='mb-2 px-5 font-bold grid grid-cols-2 gap-x-5 border-b border-gray-300 py-1'>
                    <span>Servicio</span>
                    <span className='text-right'>Precio</span>
                  </div>
                  {detService.map((service, index) => (
                    <div
                      key={index}
                      className='mb-2 px-5 text-sm grid grid-cols-2 gap-x-5 border-b py-2'
                    >
                      <span>{service.nombre}</span>
                      <span className='text-right'>s/. {service.precio - service.descuento}</span>
                    </div>
                  ))}

                  <div className='text-xl mt-12 rounded py-5 bg-blue-100 flex-col text-blue-700 flex justify-start items-center gap-y-2'>
                    <CircleDollarSign size={50} />
                    S/. {montoTotal()}
                  </div>
                </article>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
        <CardFooter className='flex justify-end'>
          <Button
            color='primary'
            size='lg'
            onClick={handleAddAdmissionAndData}
            isDisabled={!isDisableButton}
          >
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
