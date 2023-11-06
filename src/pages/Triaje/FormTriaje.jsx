import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Tab,
  Tabs
} from '@nextui-org/react'

import { useLocation, useNavigate } from 'react-router-dom'
import { createTriage } from '../../services/triage'
import { toast } from 'sonner'
import Header from '../../components/Header'
import { capitalize } from '../../utils'
import { socket } from '../../components/Socket'

export default function FormTriaje() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [values, setValues] = useState({
    complicacionesMedicas: state.complicaciones,
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
    }
  })
  const [disabledCheckboxes] = useState(
    Object.entries(values.complicacionesMedicas).reduce((acc, [key, value]) => {
      acc[key] = value === 1
      return acc
    }, {})
  )
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const currentAge =
    new Date().getFullYear() -
    new Date(state.datosPaciente.fecha_nacimiento).getFullYear()

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

    setValues((prev) => {
      return {
        ...prev,
        triajeAtencion: {
          ...prev.triajeAtencion,
          [e.target.name]: validatedValue
        }
      }
    })
  }

  const handleAddTriage = async () => {
    try {
      setLoading(true)
      const data = {
        ...values,
        complicacionesMedicas: {
          ...values.complicacionesMedicas,
          idcomplicacionmed: state.datosPaciente.idcomplicacionmed
        },
        triajeAtencion: {
          ...values.triajeAtencion,
          idatencion: state.datosPaciente.idatencion
        }
      }
      const result = await createTriage(data)
      if (result.isSuccess) {
        socket.emit('client:newAction', { action: 'Change Atenciones', idpago: state.datosPaciente.idpago  })
        socket.emit('client:newAction', { action: 'New Admision' })
        toast.success('Registrado correctamente')
        navigate('/triaje', { replace: true })
      }
    } catch (error) {
      toast.error('Ocurrió un error al registrar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const areAllFieldsFilled =
      values.triajeAtencion.talla &&
      values.triajeAtencion.peso &&
      values.triajeAtencion.temperatura &&
      values.triajeAtencion.presion_arterial &&
      values.triajeAtencion.frecuencia_cardiaca &&
      values.triajeAtencion.frecuencia_respiratoria

    setIsButtonEnabled(areAllFieldsFilled)
  }, [values.triajeAtencion])

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
                      value={state.datosPaciente.nombres}
                      maxLength={50}
                      isRequired
                      isReadOnly
                    />
                    <Input
                      label='Apellidos'
                      value={state.datosPaciente.apellidos}
                      maxLength={50}
                      isRequired
                      isReadOnly
                    />
                  </div>
                  <div className='flex gap-3 mb-4'>
                    <Input
                      label='DNI / Carnet de Extranjería'
                      maxLength={20}
                      value={state.datosPaciente.num_documento}
                      isRequired
                      isReadOnly
                    />
                    <Input
                      label='Fecha de nacimiento'
                      value={new Date(
                        state.datosPaciente.fecha_nacimiento
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
                      value={state.datosPaciente.celular || ''}
                      maxLength={9}
                      isReadOnly
                    />
                    <Input
                      label='Correo electrónico'
                      value={state.datosPaciente.correo || ''}
                      maxLength={40}
                      isReadOnly
                    />
                  </div>
                  <div className='flex gap-3 mb-4'>
                    <Input
                      label='Dirección'
                      maxLength={150}
                      value={state.datosPaciente.direccion || ''}
                      isReadOnly
                    />
                  </div>
                  <div className='flex gap-3 mb-4'>
                    <Input
                      label='Edad'
                      type='number'
                      value={currentAge}
                      isRequired
                      isReadOnly
                    />
                    <Input
                      label='Talla (cm)'
                      type='number'
                      name='talla'
                      min={0}
                      max={230}
                      value={values.triajeAtencion.talla}
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
                      value={values.triajeAtencion.peso}
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
                        {Object.entries(values.complicacionesMedicas).map(
                          ([complicacion, valor]) => (
                            <Checkbox
                              isDisabled={disabledCheckboxes[complicacion]}
                              isSelected={valor === 1}
                              onValueChange={() => {
                                setValues((prev) => {
                                  return {
                                    ...prev,
                                    complicacionesMedicas: {
                                      ...prev.complicacionesMedicas,
                                      [complicacion]: valor === 1 ? 0 : 1
                                    }
                                  }
                                })
                              }}
                              key={complicacion}
                            >
                              {capitalize(complicacion.replace('_', ' '))}
                            </Checkbox>
                          )
                        )}
                        <Checkbox
                          isSelected={values.triajeAtencion.embarazo}
                          onValueChange={() => {
                            setValues((prev) => {
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
                        <Checkbox
                          isSelected={values.triajeAtencion.danio_hepatico}
                          onValueChange={() => {
                            setValues((prev) => {
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
                          value={values.triajeAtencion.otros}
                          onChange={handleChange}
                        ></Input>
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
                          value={values.triajeAtencion.temperatura}
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
                          value={values.triajeAtencion.presion_arterial}
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
                          value={values.triajeAtencion.frecuencia_cardiaca}
                        />
                        <Input
                          type='text'
                          onChange={handleChange}
                          label='Frecuencia Respiratoria (rpm)'
                          color='primary'
                          variant='bordered'
                          radius='lg'
                          name='frecuencia_respiratoria'
                          value={values.triajeAtencion.frecuencia_respiratoria}
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
    </div>
  )
}
