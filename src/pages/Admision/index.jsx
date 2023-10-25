import { useEffect, useRef, useState } from 'react'
import {
  CardBody,
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
import { Newspaper, Plus, ScrollText, Search, Ticket } from 'lucide-react'
import DateTimeClock from '../../components/DateTimeClock'
import { getAllServices } from '../../services/service'
import { ModalServicios } from './components/ModalServicios'
import { searchPersonByNumDoc } from '../../services/person'
import { searchCompanyByRUC } from '../../services/company'
import { useDataContext } from './components/DataContext'
import { getPaymentTypes } from '../../services/pay'
import { addAdmissionAndData } from '../../services/admission'
import { toast } from 'sonner'
import ModalNewPerson from './components/ModalNewPerson'
import ModalNewCompany from './components/ModalNewCompany'
import PaymentTable from './components/PaymentTable'
import { validateFieldsFormAdmision } from './utils'
import { calculatePersonAge } from '../../utils/date'
import ServiceTable from './components/ServiceTable'
import { useFetcher } from '../../hook/useFetcher'
import MedicalServicesSummary from './components/MedicalServicesSummary'
import { AutocompleteProvider } from '../../components/AutocompleteProvider'
import { socket } from '../../components/Socket'

export default function Admision() {
  const [serviceDetails, setServiceDetails] = useState([])
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selected, setSelected] = useState('informacion-paciente')
  const [resetTable, setResetTable] = useState(crypto.randomUUID())
  const { data: services } = useFetcher(getAllServices)
  const { data: paymentTypes } = useFetcher(getPaymentTypes)
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
    if (dataToSend.pagoData.tipoComprobante === 'B') {
      isPatient.current = false
      onOpenPerson()
    } else {
      onOpenCompany()
    }
  }

  const handleAddServices = (data) => {
    setServiceDetails([...serviceDetails, data])
  }

  const totalAmount = serviceDetails.reduce(
    (acc, curr) =>
      acc + parseFloat(curr.precio) - parseFloat(curr.descuento || 0),
    0
  )

  const handleSearchPerson = async (e) => {
    if (e.key !== 'Enter') return

    const docNumber = e.target.value
    if (!docNumber || docNumber.length < 8) return

    const result = await searchPersonByNumDoc(docNumber)

    if (!result.data) {
      setDataPaciente({})
      return toast.error('No he encontrado ningún resultado')
    }

    const {
      idpersona: idpaciente,
      apellidos,
      nombres,
      num_documento: numeroDocumento,
      fecha_nacimiento: fechaNacimiento,
      direccion
    } = result.data

    setDataPaciente({
      nombres: apellidos + ' ' + nombres,
      numeroDocumento,
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
    if (e.key !== 'Enter' || !Object.keys(dataPaciente).length) return

    setIsSamePatient(false)
    const docNumberOrRUC = e.target.value
    if (!docNumberOrRUC || docNumberOrRUC.length < 8) return

    const allowedTypesReceiptsForIndividuals = ['S', 'B']

    if (
      allowedTypesReceiptsForIndividuals.includes(
        dataToSend.pagoData.tipoComprobante
      )
    ) {
      const result = await searchPersonByNumDoc(docNumberOrRUC)

      if (!result.data) {
        setDataCliente({})
        return toast.error('No he encontrado ningún resultado')
      }

      const {
        idpersona,
        apellidos,
        nombres,
        num_documento: numDocumento,
        fecha_nacimiento: fechaNacimiento,
        direccion
      } = result.data
      const fechaFormateada = fechaNacimiento.split('T')[0]

      if (!calculatePersonAge(fechaFormateada)) {
        return toast.error('El cliente debe ser mayor de edad.')
      }

      if (numDocumento === dataPaciente.numeroDocumento) {
        setDataCliente({
          nombres: dataPaciente.nombres,
          direccion: dataPaciente.direccion,
          estado: 0
        })
        setIsSamePatient(true)
      } else {
        setDataCliente({
          nombres: apellidos + ' ' + nombres,
          direccion,
          estado: 0
        })
      }

      setDataToSend({
        ...dataToSend,
        idcliente: [idpersona, 0]
      })
    } else {
      const result = await searchCompanyByRUC(docNumberOrRUC)

      if (!result.data) {
        setDataCliente({})
        return toast.error('No he encontrado ningún resultado.')
      }

      const {
        idempresa,
        razon_social: razonSocial,
        direccion,
        convenio
      } = result.data

      setDataCliente({
        nombres: razonSocial,
        direccion,
        convenio: Number(!!convenio)
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
        convenio: dataCliente.convenio
      }
    }
    const result = await addAdmissionAndData(updatedDataToSend)

    if (result.isSuccess) {
      const action =
        dataToSend.detalleAtencion[0].estado === 'PT'
          ? 'New Triaje'
          : 'New Admision'
      socket.emit('client:newAction', { action })
      toast.success(result.message)
      setDataPaciente({})
      setDataCliente({})
      setServiceDetails([])
      setIsSamePatient(false)
      setSelected('informacion-paciente')
      setResetTable(crypto.randomUUID())
      resetDataToSend()
    } else {
      toast.error(result.message)
    }
  }

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

  const isSaveButtonDisabled = validateFieldsFormAdmision(
    dataToSend,
    dataCliente.convenio
  )

  const isPaymentValid =
    dataToSend.detallePago?.reduce((acc, curr) => acc + curr.montoPagado, 0) ===
      parseFloat(totalAmount) || Boolean(dataCliente.convenio)

  useEffect(() => {
    const hasTriage = serviceDetails.some((el) => Boolean(el.triaje))

    const detalleAtencion = serviceDetails.map(
      ({ idservicio, precio, descuento, idpersonalMedico }) => ({
        idServicio: idservicio,
        precioPagado: precio - descuento,
        descuento,
        idpersonalMedico,
        estado: hasTriage ? 'PT' : 'P'
      })
    )
    setDataToSend({
      ...dataToSend,
      pagoData: {
        ...dataToSend.pagoData,
        montoTotal: totalAmount
      },
      detalleAtencion
    })
  }, [serviceDetails])

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
    setDataCliente({})
    setIsSamePatient(false)
  }, [dataToSend.pagoData.tipoComprobante])

  useEffect(() => {
    setResetTable(crypto.randomUUID())
  }, [dataCliente])

  useEffect(() => {
    if (selected === 'informacion-paciente') {
      setDataToSend({
        ...dataToSend,
        detallePago: []
      })
    }
  }, [selected])

  useEffect(() => {
    return () => {
      setDataPaciente({})
      setDataCliente({})
      setServiceDetails([])
      setIsSamePatient(false)
      setResetTable(crypto.randomUUID())
      resetDataToSend()
    }
  }, [])

  return (
    <>
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
        >
          <Tab key='informacion-paciente' title='Información del paciente'>
            <div className='flex gap-x-4 mt-5 mb-6 items-end'>
              <Input
                autoFocus
                placeholder='Enter para buscar'
                label='Número documento'
                labelPlacement='outside'
                className='rounded-lg w-[300px] flex-shrink-0'
                maxLength={20}
                onKeyDown={handleSearchPerson}
                startContent={<Search />}
              />
              <Button
                isIconOnly
                color='primary'
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
                value={dataPaciente.nombres || ''}
                readOnly
              />
              <Input
                className='flex-1'
                label='Fecha nacimiento'
                value={dataPaciente.fechaNacimiento || ''}
                readOnly
              />
              <Input
                className='flex-1'
                label='Dirección'
                value={dataPaciente.direccion || ''}
                readOnly
              />
            </div>
            <Divider className='my-6' />
            <Button
              variant='light'
              startContent={<Plus />}
              color='primary'
              className='mb-4'
              onPress={onOpen}
            >
              Agregar servicio
            </Button>
            <ServiceTable
              detService={serviceDetails}
              setDetService={setServiceDetails}
            />
          </Tab>
          <Tab key='metodo-pago' title='Método de pago'>
            <div className='grid grid-cols-[1fr_350px] gap-x-10'>
              <div className='flex flex-col gap-y-6'>
                <div className='flex justify-between gap-x-8'>
                  <div className='flex items-end gap-x-4'>
                    <Input
                      label={
                        dataToSend.pagoData.tipoComprobante !== 'F'
                          ? 'Número documento'
                          : 'Número RUC'
                      }
                      labelPlacement='outside'
                      placeholder='Enter para buscar'
                      className='rounded-lg w-[300px] flex-shrink-0'
                      maxLength={20}
                      onKeyDown={handleSearchClient}
                      startContent={<Search />}
                    />
                    <Button
                      isIconOnly
                      color='primary'
                      onClick={handleOpenModalNewClient}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <RadioGroup
                    value={dataToSend.pagoData.tipoComprobante}
                    onValueChange={(e) => {
                      setDataToSend({
                        ...dataToSend,
                        pagoData: {
                          ...dataToSend.pagoData,
                          tipoComprobante: e
                        }
                      })
                    }}
                  >
                    <div className='flex gap-4'>
                      <CustomRadio value='S'>
                        <Ticket />
                        Simple
                      </CustomRadio>
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
                      dataToSend.pagoData.tipoComprobante !== 'F'
                        ? 'Apellidos y nombres'
                        : 'Razón social'
                    }
                    value={dataCliente.nombres || ''}
                    readOnly
                  />
                  <Input
                    className='col-start-3 col-end-6'
                    label='Dirección'
                    value={dataCliente.direccion || ''}
                    readOnly
                  />
                </div>
                {dataToSend.pagoData.tipoComprobante !== 'F' &&
                  calculatePersonAge(dataPaciente.fechaNacimiento) && (
                    <div className='justify-items-start'>
                      <Checkbox
                        size='sm'
                        isSelected={isSamePatient}
                        onValueChange={setIsSamePatient}
                      >
                        El paciente es el mismo cliente
                      </Checkbox>
                    </div>
                  )}
                <Divider className='col-span-5 mb-5' />
                <PaymentTable
                  key={resetTable}
                  paymentTypes={paymentTypes}
                  onChange={handlePayment}
                  totalPayment={totalAmount}
                />
              </div>
              <MedicalServicesSummary
                detService={serviceDetails}
                totalAmount={totalAmount}
              />
            </div>
          </Tab>
        </Tabs>
      </CardBody>
      <CardFooter className='flex justify-end'>
        <Button
          color='primary'
          onClick={handleAddAdmissionAndData}
          isDisabled={!isSaveButtonDisabled || !isPaymentValid}
        >
          Guardar
        </Button>
      </CardFooter>

      <AutocompleteProvider>
        <ModalServicios
          data={services}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onChange={handleAddServices}
        />
      </AutocompleteProvider>

      <ModalNewPerson
        isPatient={isPatient.current}
        isOpen={isOpenPerson}
        onOpenChange={onOpenChangePerson}
      />
      <ModalNewCompany
        isOpen={isOpenCompany}
        onOpenChange={onOpenChangeCompany}
      />
    </>
  )
}
