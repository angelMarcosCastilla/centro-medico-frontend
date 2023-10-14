import { useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Image,
  Input,
  Tab,
  Tabs
} from '@nextui-org/react'

import { useLocation, useNavigate } from 'react-router-dom'
import { createTriage } from '../../services/triaje'
import { toast } from 'sonner'
import Header from '../../components/Header'
import { capitalize } from '../../utils'

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
      frecuencia_respiratoria: ''
    }
  })
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  const currentAge =
    new Date().getFullYear() -
    new Date(state.datosPaciente.fecha_nacimiento).getFullYear()

  const validateInput = (name, value, max) => {
    const parsedValue = parseFloat(value)
    if (isNaN(parsedValue) || parsedValue < 0) {
      // Si el valor no es un número, devolver ''
      return ''
    }

    // Validar que el valor sea menor o igual al máximo permitido
    return Math.min(parsedValue, max)
  }

  const handleChange = (e) => {
    const { value, name } = e.target

    let validatedValue
    if (name === 'talla') {
      validatedValue = validateInput(name, value, 230)
    } else if (name === 'peso') {
      validatedValue = validateInput(name, value, 200)
    } else if (name === 'temperatura') {
      validatedValue = validateInput(name, value, 40)
    } else if (name === 'frecuencia_cardiaca') {
      validatedValue = validateInput(name, value, 100)
    } else if (name === 'frecuencia_respiratoria') {
      validatedValue = validateInput(name, value, 30)
    } else {
      validatedValue = value
    }

    const areAllFieldsFilled =
      values.triajeAtencion.talla &&
      values.triajeAtencion.peso &&
      values.triajeAtencion.temperatura &&
      values.triajeAtencion.presion_arterial &&
      values.triajeAtencion.frecuencia_cardiaca &&
      values.triajeAtencion.frecuencia_respiratoria

    setIsButtonEnabled(areAllFieldsFilled)

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

  const handleAddTriaje = async () => {
    try {
      const data = {
        ...values,
        complicacionesMedicas: {
          ...values.complicacionesMedicas,
          idcompliacionmed: state.datosPaciente.idcompliacionmed
        },
        triajeAtencion: {
          ...values.triajeAtencion,
          idatencion: state.datosPaciente.idatencion
        }
      }

      const result = await createTriage(data)
      if (result.isSuccess) {
        toast.success('Triaje registrado correctamente')
        navigate('/triaje', { replace: true })
      }
    } catch (error) {
      toast.error('Ocurrió un error al registrar el triaje')
    }
  }

  return (
    <section className='px-3 py-4 bg-slate-100 h-screen flex flex-col gap-y-4'>
      <Header title='Identificación del paciente en Triaje' />
      <Card className='flex-1'>
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
                      <div className='grid grid-cols-2 gap-6 px-4'>
                        {Object.entries(values.complicacionesMedicas).map(
                          (item) => (
                            <Checkbox
                              isSelected={item[1]}
                              onValueChange={() => {
                                setValues((prev) => {
                                  return {
                                    ...prev,
                                    complicacionesMedicas: {
                                      ...prev.complicacionesMedicas,
                                      [item[0]]: !item[1]
                                    }
                                  }
                                })
                              }}
                              key={item[0]}
                            >
                              {capitalize(item[0].replace('_', ' '))}
                            </Checkbox>
                          )
                        )}
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
                          variant='bordered'
                          radius='lg'
                        />
                        <Input
                          type='text'
                          label='Presión arterial (mm Hg)'
                          onChange={handleChange}
                          variant='bordered'
                          name='presion_arterial'
                          value={values.triajeAtencion.presion_arterial}
                          radius='lg'
                        />
                        <Input
                          type='text'
                          label='Frecuencia Cardiaca (lpm)'
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
            <div className='flex justify-end'>
              <Image
                width={125}
                alt='Sello'
                src='../../../private/sello.png'
              />
            </div>
          </form>
        </CardBody>
        <CardFooter className='flex justify-end gap-5'>
          <Button
            onClick={() => navigate(-1, { replace: true })}
            className='hover:bg-danger hover:text-white'
          >
            Cancelar
          </Button>
          <Button
            color='primary'
            onClick={handleAddTriaje}
            isDisabled={!isButtonEnabled}
          >
            Guardar
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
