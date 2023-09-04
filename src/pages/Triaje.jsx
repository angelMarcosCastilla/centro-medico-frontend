import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs
} from '@nextui-org/react'

const listRiskFactors = [
  {
    name: 'Diabetes',
    checked: false
  },
  {
    name: 'Hipertensión Arterial',
    checked: false
  },
  {
    name: 'Alergia: cerdo, marisco, etc',
    checked: false
  },
  {
    name: 'Enfermedad Renal',
    checked: false
  },
  {
    name: 'Inmunodeficencia VIH',
    checked: false
  },
  {
    name: 'Daño Hepático',
    checked: false
  },
  {
    name: 'Embarazo',
    checked: false
  },
  {
    name: 'Otros',
    text: ''
  }
]

const listInvestigators = [
  { name: 'Alejandro Torres', signature: 'https://i.imgur.com/IvNkEE0.png' },
  { name: 'Valentina Martínez', signature: 'https://i.imgur.com/mmXcrf0.png' },
  { name: 'Andrés García', signature: 'https://i.imgur.com/SDsnYbJ.png' },
  { name: 'Gabriela López', signature: 'https://i.imgur.com/SDsnYbJ.png' },
  { name: 'Sebastián Rodríguez', signature: 'https://i.imgur.com/nim2HOX.png' }
]

export default function Triaje() {
  const [riskFactors, setRiskFactors] = useState(listRiskFactors)
  const [investigator, setInvestigator] = useState('')
  const [signature, setSignature] = useState('')

  const handleSelectedRisk = (e) => {
    const { value, checked } = e.target
    const selectedRiskFactors = riskFactors.map((risk) => {
      if (risk.name === value) {
        risk.checked = checked
      }
      return risk
    })
    setRiskFactors(selectedRiskFactors)
  }

  const handleChangeToOthers = (e) => {
    const { value } = e.target
    const selectedRiskFactors = riskFactors.map((risk) => {
      if (risk.name === 'Otros') {
        risk.text = value
      }
      return risk
    })
    setRiskFactors(selectedRiskFactors)
  }

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

  return (
    <Card shadow='none'>
      <CardHeader className='flex justify-between'>
        <h1 className='text-2xl'>Identificación del paciente en Triaje</h1>
        <h2 className='text-lg'>
          Fecha:{' '}
          {new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='grid grid-cols-2 gap-4'>
          <Card shadow='none'>
            <CardHeader>Datos generales del paciente</CardHeader>
            <CardBody>
              <div className='flex gap-3 mb-4'>
                <Input label='Nombres' size='lg' maxLength={60} isRequired />
                <Input label='Apellidos' size='lg' maxLength={60} isRequired />
              </div>
              <div className='flex gap-3 mb-4'>
                <Input label='DNI' size='lg' maxLength={20} isRequired />
                <Input label='Fecha de nacimiento' size='lg' isRequired />
              </div>
              <div className='flex gap-3 mb-4'>
                <Input label='Número celular' size='lg' maxLength={9} />
                <Input label='Correo electrónico' size='lg' maxLength={100} />
              </div>
              <div className='flex gap-3 mb-4'>
                <Input label='Dirección' size='lg' maxLength={150} />
              </div>
              <div className='flex gap-3 mb-4'>
                <Input
                  label='Edad'
                  type='number'
                  size='lg'
                  disabled
                  isRequired
                />
                <Input
                  label='Talla (cm)'
                  type='number'
                  size='lg'
                  min={0}
                  max={250}
                  isRequired
                />
                <Input
                  label='Peso (kg)'
                  type='number'
                  size='lg'
                  min={0}
                  max={500}
                  isRequired
                />
              </div>
            </CardBody>
          </Card>
          <Card shadow='none'>
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
                    {listRiskFactors.map((factor, index) => {
                      return (
                        factor.name !== 'Otros' && (
                          <Checkbox
                            defaultSelected={factor.checked}
                            value={factor.name}
                            key={index}
                            onChange={handleSelectedRisk}
                          >
                            {factor.name}
                          </Checkbox>
                        )
                      )
                    })}
                  </div>
                  <div className='px-4 mt-5'>
                    {listRiskFactors.map((factor, index) => {
                      return (
                        factor.name === 'Otros' && (
                          <Input
                            label='Otros'
                            variant='bordered'
                            size='sm'
                            radius='lg'
                            onChange={handleChangeToOthers}
                            key={index}
                            value={factor.text}
                            maxLength={50}
                          />
                        )
                      )
                    })}
                  </div>
                </Tab>
                <Tab
                  key='control-funciones-vitales'
                  title='Control de funciones vitales'
                >
                  <div className='grid grid-cols-2 gap-6 px-4'>
                    <Input
                      label='Temperatura (°C)'
                      variant='bordered'
                      size='lg'
                      radius='lg'
                      type='number'
                    />
                    <Input
                      label='Presión arterial (mm Hg)'
                      variant='bordered'
                      size='lg'
                      radius='lg'
                    />
                    <Input
                      label='Frecuencia Cardiaca (lpm)'
                      variant='bordered'
                      size='lg'
                      radius='lg'
                    />
                    <Input
                      label='Frecuencia Respiratoria (rpm)'
                      variant='bordered'
                      size='lg'
                      radius='lg'
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
        {/* <Card shadow='none'>
          <CardHeader>Investigador (a)</CardHeader>
          <CardBody>
            <div className='grid grid-cols-3 gap-4'>
              <Select
                label='Seleccione un investigador (a)'
                size='lg'
                isRequired
                onChange={handleSelectedInvestigator}
              >
                {listInvestigators.map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </Select>
                <Image
                  width={150}
                  alt='Firma del investigador'
                  src={signature}
                />
                <Image
                  width={200}
                  alt='Sello'
                  src='https://www.pngall.com/wp-content/uploads/2016/05/Certified-Stamp-Free-Download-PNG.png'
                />
            </div>
          </CardBody>
        </Card> */}
      </CardBody>
      <Divider />
      <CardFooter className='flex justify-end gap-5'>
        <Button
          size='lg'
          radius='lg'
          className='hover:bg-danger hover:text-white'
        >
          Cancelar
        </Button>
        <Button color='primary' size='lg' radius='lg'>
          Guardar
        </Button>
      </CardFooter>
    </Card>
  )
}
