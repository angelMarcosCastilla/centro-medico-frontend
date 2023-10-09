import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Image,
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs
} from '@nextui-org/react'

import { useLocation, useNavigate } from 'react-router-dom'
import { registrarTriajeService } from '../../services/triaje'
import { toast } from 'sonner'
import Header from '../../components/Header'

const listInvestigators = [
  { name: 'Alejandro Torres', signature: 'https://i.imgur.com/IvNkEE0.png' },
  { name: 'Valentina Martínez', signature: 'https://i.imgur.com/mmXcrf0.png' },
  { name: 'Andrés García', signature: 'https://i.imgur.com/SDsnYbJ.png' },
  { name: 'Gabriela López', signature: 'https://i.imgur.com/SDsnYbJ.png' },
  { name: 'Sebastián Rodríguez', signature: 'https://i.imgur.com/nim2HOX.png' }
]

export default function FormTriaje() {
  const [investigator, setInvestigator] = useState('')
  const [signature, setSignature] = useState('')
  const { state } = useLocation()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    complicaciones: state.complicaciones,
    detalleTriaje: {
      temperatura: '',
      peso: '',
      talla: '',
      presion_arterial: '',
      frecuencia_cardiaca: '',
      frecuencia_respiratoria: ''
    }
  })

  const handleSelectedInvestigator = (e) => {
    const { value } = e.target
    setInvestigator(value)
  }

  useEffect(() => {
    const investigatorFound = listInvestigators.find(
      ({ name }) => name === investigator
    )
    if (investigatorFound) setSignature(investigatorFound.signature)
    else setSignature(null)
  }, [investigator])

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

  const handleChange = (e, key) => {
    const { value, name } = e.target

    let validatedValue
    // Validamos  el campo según su nombre
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
      // Para otros campos, simplemente mantener el valor ingresado
      validatedValue = value
    }

    setValues((prev) => {
      return {
        ...prev,
        detalleTriaje: {
          ...prev.detalleTriaje,
          [e.target.name]: validatedValue
        }
      }
    })
  }

  const handleAddTriaje = async () => {
    try {
      const data = {
        ...values,
        idcompliacionmed: state.datosPaciente.idcompliacionmed,
        idatencion: state.datosPaciente.idatencion
      }
      const result = await registrarTriajeService(data)
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
          <div className='lg:flex'>
            <Card shadow='none' className='flex-1'>
              <CardHeader>Datos generales del paciente</CardHeader>
              <CardBody>
                <div className='flex gap-3 mb-4'>
                  <Input
                    label='Nombres'
                    value={state.datosPaciente.nombres}
                    size='lg'
                    maxLength={60}
                    isRequired
                  />
                  <Input
                    label='Apellidos'
                    value={state.datosPaciente.apellidos}
                    size='lg'
                    maxLength={60}
                    isRequired
                  />
                </div>
                <div className='flex gap-3 mb-4'>
                  <Input
                    label='DNI'
                    size='lg'
                    maxLength={20}
                    value={state.datosPaciente.num_documento}
                    isRequired
                  />
                  <Input
                    label='Fecha de nacimiento'
                    value={new Date(
                      state.datosPaciente.fecha_nacimiento
                    ).toLocaleDateString('es')}
                    size='lg'
                    isRequired
                  />
                </div>
                <div className='flex gap-3 mb-4'>
                  <Input
                    label='Número celular'
                    value={state.datosPaciente.celular}
                    size='lg'
                    maxLength={9}
                  />
                  <Input
                    label='Correo electrónico'
                    value={state.datosPaciente.correo}
                    size='lg'
                    maxLength={100}
                  />
                </div>
                <div className='flex gap-3 mb-4'>
                  <Input
                    label='Dirección'
                    size='lg'
                    maxLength={150}
                    value={state.datosPaciente.direccion}
                  />
                </div>
                <div className='flex gap-3 mb-4'>
                  <Input
                    label='Edad'
                    type='number'
                    value={currentAge}
                    size='lg'
                    disabled
                    isRequired
                  />
                  <Input
                    label='Talla (cm)'
                    type='number'
                    size='lg'
                    min={0}
                    name='talla'
                    value={values.detalleTriaje.talla}
                    onChange={handleChange}
                    max={250}
                    isRequired
                  />
                  <Input
                    label='Peso (kg)'
                    type='number'
                    size='lg'
                    min={0}
                    max={500}
                    onChange={handleChange}
                    name='peso'
                    value={values.detalleTriaje.peso}
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
                  size='lg'
                  variant='underlined'
                >
                  <Tab
                    key='factores-riesgo'
                    title='Factores de riesgo o comorbilidad'
                  >
                    <div className='grid grid-cols-2 gap-6 px-4'>
                      {Object.entries(values.complicaciones).map((item) => (
                        <Checkbox
                          isSelected={item[1]}
                          onValueChange={() => {
                            setValues((prev) => {
                              return {
                                ...prev,
                                complicaciones: {
                                  ...prev.complicaciones,
                                  [item[0]]: !item[1]
                                }
                              }
                            })
                          }}
                          key={item[0]}
                        >
                          {item[0]}
                        </Checkbox>
                      ))}
                    </div>
                  </Tab>
                  <Tab
                    key='control-funciones-vitales'
                    title='Control de funciones vitales'
                  >
                    <div className='grid grid-cols-2 gap-6 px-4'>
                      <Input
                        label='Temperatura (°C)'
                        name='temperatura'
                        value={values.detalleTriaje.temperatura}
                        onChange={handleChange}
                        variant='bordered'
                        size='lg'
                        radius='lg'
                        type='number'
                      />
                      <Input
                        label='Presión arterial (mm Hg)'
                        onChange={handleChange}
                        variant='bordered'
                        size='lg'
                        name='presion_arterial'
                        value={values.detalleTriaje.presion_arterial}
                        radius='lg'
                      />
                      <Input
                        label='Frecuencia Cardiaca (lpm)'
                        variant='bordered'
                        size='lg'
                        onChange={handleChange}
                        radius='lg'
                        name='frecuencia_cardiaca'
                        value={values.detalleTriaje.frecuencia_cardiaca}
                      />
                      <Input
                        onChange={handleChange}
                        label='Frecuencia Respiratoria (rpm)'
                        variant='bordered'
                        size='lg'
                        radius='lg'
                        name='frecuencia_respiratoria'
                        value={values.detalleTriaje.frecuencia_respiratoria}
                      />
                    </div>
                  </Tab>
                </Tabs>
                <Card shadow='none'>
                  <CardHeader>Investigador (a)</CardHeader>
                  <CardBody>
                    <div className='flex flex-row gap-2'>
                      <div className='basis-2/3 grid justify-items-center gap-y-2'>
                        <Select
                          label='Investigador a cargo'
                          size='lg'
                          onChange={handleSelectedInvestigator}
                          isRequired
                        >
                          {listInvestigators.map(({ name }) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </Select>
                        <Image
                          width={180}
                          height={50}
                          alt='Firma del investigador'
                          src={signature}
                        />
                      </div>
                      <div className='basis-1/3 flex items-center'>
                        <Image
                          width={250}
                          alt='Sello'
                          src='https://www.pngall.com/wp-content/uploads/2016/05/Certified-Stamp-Free-Download-PNG.png'
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </div>
        </CardBody>
        <CardFooter className='flex justify-end gap-5'>
          <Button
            onClick={() => navigate(-1, { replace: true })}
            size='lg'
            radius='lg'
            className='hover:bg-danger hover:text-white'
          >
            Cancelar
          </Button>
          <Button
            color='primary'
            size='lg'
            radius='lg'
            onClick={handleAddTriaje}
          >
            Guardar
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
