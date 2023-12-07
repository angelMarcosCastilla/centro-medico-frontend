import { useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Spinner,
  Tab,
  Tabs,
  useDisclosure
} from '@nextui-org/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createTriage, getTriageFromPatient } from '../../services/triage'
import { toast } from 'sonner'
import Header from '../../components/Header'
import { socket } from '../../components/Socket'
import { useFetcher } from '../../hook/useFetcher'
import { calculatePersonAge } from '../../utils/date'
import { ArrowUpRight } from 'lucide-react'
import AllergiesModal from './components/AllergiesModal'

export default function FormTriaje() {
  const { state: personData } = useLocation()
  const navigate = useNavigate()
  const {
    data: [complicacionesMedicas, detalleComplicacionMedica],
    loading: loadingMedicalComplications
  } = useFetcher(() => getTriageFromPatient(personData.idpersona))

  const [triageData, setTriageData] = useState({
    triajeAtencion: {
      idPersonalMedico: JSON.parse(localStorage.getItem('userInfo'))
        .idpersonalmedico,
      temperatura: '',
      peso: '',
      talla: '',
      presion_arterial: '',
      frecuencia_cardiaca: '',
      frecuencia_respiratoria: '',
      danio_hepatico: false,
      embarazo: false,
      otros: ''
    },
    complicacionesMedicas: []
  })
  const [newAllergies, setNewAllergies] = useState([])

  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const isComplicacionMedicaPresent = (idcomplicacionmed) => {
    return detalleComplicacionMedica.some(
      (det) => det.idcomplicacionmed === idcomplicacionmed
    )
  }

  const calculateIsSelected = (
    isComplicacionPresent,
    complicacionesMedicas,
    el
  ) => {
    return (
      isComplicacionPresent ||
      complicacionesMedicas.some(
        (com) =>
          com.idcomplicacionmed === el.idcomplicacionmed &&
          com.detalles === 'true'
      )
    )
  }

  const validateInput = (value, max) => {
    const parsedValue = parseFloat(value)
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > max) {
      return ''
    }

    return parsedValue
  }

  const handleChange = (e) => {
    const { value, name } = e.target

    let validatedValue
    if (name === 'talla') {
      validatedValue = validateInput(value, 230)
    } else if (name === 'peso') {
      validatedValue = validateInput(value, 200)
    } else if (name === 'temperatura') {
      validatedValue = validateInput(value, 42)
    } else if (name === 'frecuencia_cardiaca') {
      validatedValue = validateInput(value, 200)
    } else if (name === 'frecuencia_respiratoria') {
      validatedValue = validateInput(value, 50)
    } else {
      validatedValue = value
    }

    setTriageData((prev) => {
      return {
        ...prev,
        triajeAtencion: {
          ...prev.triajeAtencion,
          [e.target.name]: validatedValue
        }
      }
    })
  }

  const handleComplicacionMedicaChange = (prev, el, isPresent) => {
    const complicacionIndex = prev.complicacionesMedicas.findIndex(
      (complicacion) => complicacion.idcomplicacionmed === el.idcomplicacionmed
    )

    const detalles =
      complicacionIndex !== -1
        ? String(
            prev.complicacionesMedicas[complicacionIndex].detalles === 'true'
              ? 'false'
              : 'true'
          )
        : String(!isPresent)

    const nuevasComplicaciones =
      complicacionIndex !== -1
        ? [
            ...prev.complicacionesMedicas.slice(0, complicacionIndex),
            { idcomplicacionmed: el.idcomplicacionmed, detalles },
            ...prev.complicacionesMedicas.slice(complicacionIndex + 1)
          ]
        : [
            ...prev.complicacionesMedicas,
            { idcomplicacionmed: el.idcomplicacionmed, detalles }
          ]

    return {
      ...prev,
      complicacionesMedicas: nuevasComplicaciones
    }
  }

  const handleAddTriage = async () => {
    setLoading(true)

    try {
      const data = {
        idpersona: personData.idpersona,
        triajeAtencion: {
          ...triageData.triajeAtencion,
          idatencion: personData.idatencion
        },
        nuevasComplicaciones: [
          ...triageData.complicacionesMedicas,
          ...newAllergies
        ]
      }

      const result = await createTriage(data)
      if (result.isSuccess) {
        socket.emit('client:newAction', {
          action: 'Change Atenciones',
          idpago: personData.idpago
        })
        socket.emit('client:newAction', { action: 'New Admision' })
        toast.success('Registrado correctamente')
        navigate('/triaje', { replace: true })
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setLoading(false)
    }
  }

  const isButtonEnabled =
    triageData.triajeAtencion.talla &&
    triageData.triajeAtencion.peso &&
    triageData.triajeAtencion.temperatura &&
    triageData.triajeAtencion.presion_arterial &&
    triageData.triajeAtencion.frecuencia_cardiaca &&
    triageData.triajeAtencion.frecuencia_respiratoria

  return (
    <div className='bg-slate-100 h-screen flex flex-col p-5 gap-y-4'>
      <Header title='Identificación del paciente en Triaje' />
      <Card className='h-full shadow-small rounded-2xl'>
        <CardBody>
          <form autoComplete='off'>
            <div className='lg:flex'>
              <Card shadow='none' className='flex-1'>
                <CardHeader>Datos generales del paciente</CardHeader>
                <CardBody>
                  <div className='flex gap-3 mb-4'>
                    <Input
                      label='Nombres'
                      value={personData.nombres}
                      maxLength={50}
                      isRequired
                      isReadOnly
                    />
                    <Input
                      label='Apellidos'
                      value={personData.apellidos}
                      maxLength={50}
                      isRequired
                      isReadOnly
                    />
                  </div>
                  <div className='flex gap-3 mb-4'>
                    <Input
                      label='DNI / Carnet de Extranjería'
                      maxLength={20}
                      value={personData.num_documento}
                      isRequired
                      isReadOnly
                    />
                    <Input
                      label='Fecha de nacimiento'
                      value={new Date(
                        personData.fecha_nacimiento
                      ).toLocaleDateString('es', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                      isRequired
                      isReadOnly
                    />
                  </div>
                  <div className='flex gap-3 mb-4'>
                    <Input
                      label='Número celular'
                      value={personData.celular || ''}
                      maxLength={9}
                      isReadOnly
                    />
                    <Input
                      label='Correo electrónico'
                      value={personData.correo || ''}
                      maxLength={40}
                      isReadOnly
                    />
                  </div>
                  <div className='flex gap-3 mb-4'>
                    <Input
                      label='Dirección'
                      maxLength={150}
                      value={personData.direccion || ''}
                      isReadOnly
                    />
                  </div>
                  <div className='flex gap-3 mb-4'>
                    <Input
                      label='Edad'
                      type='number'
                      value={calculatePersonAge(personData.fecha_nacimiento)}
                      isRequired
                      isReadOnly
                    />
                    <Input
                      label='Talla (cm)'
                      type='number'
                      name='talla'
                      min={0}
                      max={230}
                      value={triageData.triajeAtencion.talla}
                      onChange={handleChange}
                      isRequired
                    />
                    <Input
                      label='Peso (kg)'
                      type='number'
                      min={0}
                      max={200}
                      onChange={handleChange}
                      name='peso'
                      value={triageData.triajeAtencion.peso}
                      isRequired
                    />
                  </div>
                </CardBody>
              </Card>
              <Card shadow='none' className='flex-1'>
                <CardBody>
                  <Tabs
                    color='primary'
                    aria-label='Tabs colors'
                    variant='underlined'
                  >
                    <Tab
                      key='factores-riesgo'
                      title='Factores de riesgo o comorbilidad'
                    >
                      <div className='grid grid-cols-2 gap-6 px-4 items-start'>
                        {loadingMedicalComplications ? (
                          <Spinner label='Cargando...' labelColor='primary' />
                        ) : (
                          complicacionesMedicas?.map((el) => {
                            const isComplicacionPresent =
                              isComplicacionMedicaPresent(el.idcomplicacionmed)

                            if (el.idcomplicacionmed === 3) {
                              return (
                                <div
                                  className='flex gap-1'
                                  key={el.idcomplicacionmed}
                                >
                                  <Checkbox
                                    isDisabled={isComplicacionPresent}
                                    isSelected={
                                      isComplicacionPresent ||
                                      newAllergies.length > 0
                                    }
                                    onValueChange={() => {
                                      if (!newAllergies.length) onOpen()
                                      else setNewAllergies([])
                                    }}
                                  >
                                    {el.nombre_complicacion}
                                  </Checkbox>
                                  <Button
                                    tabIndex={-1}
                                    isIconOnly
                                    size='sm'
                                    variant='light'
                                    color='primary'
                                    onPress={onOpen}
                                  >
                                    <ArrowUpRight size={20} />
                                  </Button>
                                </div>
                              )
                            }

                            return (
                              <Checkbox
                                isDisabled={isComplicacionPresent}
                                isSelected={calculateIsSelected(
                                  isComplicacionPresent,
                                  triageData.complicacionesMedicas,
                                  el
                                )}
                                onValueChange={() => {
                                  setTriageData((prev) =>
                                    handleComplicacionMedicaChange(
                                      prev,
                                      el,
                                      isComplicacionPresent
                                    )
                                  )
                                }}
                                key={el.idcomplicacionmed}
                              >
                                {el.nombre_complicacion}
                              </Checkbox>
                            )
                          })
                        )}
                        {personData.genero === 'F' && (
                          <Checkbox
                            isSelected={triageData.triajeAtencion.embarazo}
                            onValueChange={() => {
                              setTriageData((prev) => {
                                return {
                                  ...prev,
                                  triajeAtencion: {
                                    ...prev.triajeAtencion,
                                    embarazo: !prev.triajeAtencion.embarazo
                                  }
                                }
                              })
                            }}
                          >
                            Embarazo
                          </Checkbox>
                        )}
                        <Checkbox
                          isSelected={triageData.triajeAtencion.danio_hepatico}
                          onValueChange={() => {
                            setTriageData((prev) => {
                              return {
                                ...prev,
                                triajeAtencion: {
                                  ...prev.triajeAtencion,
                                  danio_hepatico:
                                    !prev.triajeAtencion.danio_hepatico
                                }
                              }
                            })
                          }}
                        >
                          Daño hepático
                        </Checkbox>
                        <Input
                          label='Otros'
                          name='otros'
                          color='primary'
                          variant='bordered'
                          radius='lg'
                          className='col-start-1 col-span-2'
                          value={triageData.triajeAtencion.otros}
                          onChange={handleChange}
                        />
                      </div>
                    </Tab>
                    <Tab
                      key='control-funciones-vitales'
                      title='Control de funciones vitales'
                    >
                      <div className='grid grid-cols-2 gap-6 px-4'>
                        <Input
                          type='text'
                          label='Temperatura (°C)'
                          name='temperatura'
                          value={triageData.triajeAtencion.temperatura}
                          onChange={handleChange}
                          color='primary'
                          variant='bordered'
                          radius='lg'
                        />
                        <Input
                          type='text'
                          label='Presión arterial (mm Hg)'
                          onChange={handleChange}
                          color='primary'
                          variant='bordered'
                          name='presion_arterial'
                          value={triageData.triajeAtencion.presion_arterial}
                          radius='lg'
                        />
                        <Input
                          type='text'
                          label='Frecuencia Cardiaca (lpm)'
                          color='primary'
                          variant='bordered'
                          onChange={handleChange}
                          radius='lg'
                          name='frecuencia_cardiaca'
                          value={triageData.triajeAtencion.frecuencia_cardiaca}
                        />
                        <Input
                          type='text'
                          onChange={handleChange}
                          label='Frecuencia Respiratoria (rpm)'
                          color='primary'
                          variant='bordered'
                          radius='lg'
                          name='frecuencia_respiratoria'
                          value={
                            triageData.triajeAtencion.frecuencia_respiratoria
                          }
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </div>
          </form>
        </CardBody>
        <CardFooter className='flex justify-end gap-3'>
          <Button
            color='danger'
            variant='light'
            onClick={() => navigate('/triaje', { replace: true })}
          >
            Cancelar
          </Button>
          <Button
            isLoading={loading}
            color='primary'
            onClick={handleAddTriage}
            isDisabled={!isButtonEnabled}
          >
            Guardar
          </Button>
        </CardFooter>
      </Card>
      <AllergiesModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        data={{
          idpersona: personData.idpersona,
          detalleComplicacionMedica
        }}
        newAllergies={newAllergies}
        setNewAllergies={setNewAllergies}
      />
    </div>
  )
}
