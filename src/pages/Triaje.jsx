import React, { useState } from 'react'
import { 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader, 
  Checkbox, 
  Divider, 
  Input, 
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

export default function Triaje() {
  const [riskFactors, setRiskFactors] = useState(listRiskFactors)

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

  return (
    <Card shadow='none'>
      <CardHeader>
        <h1 className='text-2xl'>Identificación del paciente - Triaje</h1>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex justify-between gap-x-12'>
          <div className='w-full'>
            <h2 className='mb-2'>Datos generales del paciente: </h2>
            <div className='flex gap-3 mb-4'>
              <Input label='Nombres' size='lg' />
              <Input label='Apellidos' size='lg' />
            </div>
            <div className='flex gap-3 mb-4'>
              <Input label='DNI' size='lg' maxLength={20} />
              <Input label='Número celular' size='lg' maxLength={9} />
            </div>
            <div className='flex gap-3 mb-4'>
              <Input label='Dirección' size='lg' maxLength={150} />
            </div>
            <div className='flex gap-3 mb-4'>
              <Input label='Edad' type='number' size='lg' disabled />
              <Input label='Talla (cm)' type='number' size='lg' min={0} max={250} />
              <Input label='Peso (kg)' type='number' size='lg' min={0} max={500} />
            </div>
          </div>
          <div className='w-full'>
            <Tabs
              color='primary'
              aria-label='Tabs colors'
              size='lg'
              variant='underlined'
              radius='full'
            >
              <Tab
                key='factores-riesgo'
                title='Factores de riesgo o comorbilidad'
              >
                <div className='grid grid-cols-2 gap-6 px-4'>
                  {listRiskFactors.map((factor, index) => {
                    return factor.name !== 'Otros' && (
                      <Checkbox
                        defaultSelected={factor.checked}
                        value={factor.name}
                        key={index}
                        onChange={handleSelectedRisk}
                      >
                        {factor.name}
                      </Checkbox>
                    )
                  })}
                </div>
                <div className='px-4 mt-5'>
                  {listRiskFactors.map((factor, index) => {
                    return factor.name === 'Otros' && (
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
          </div>
        </div>
        <div>
          <p className='mb-4 text-right'>
            fecha: {new Date().toLocaleDateString('es')}
          </p>
          <h2 className='mb-4'>Investigador: </h2>
          <div className='flex gap-3 mb-4'>
            <Input label='Nombre' placeholder='Nombre' />
            <Input label='Apellido' placeholder='Apellido' />
          </div>
        </div>
      </CardBody>
      <CardFooter className='flex justify-end gap-5'>
        <Button size='lg' radius='lg'>
          Reiniciar formulario
        </Button>
        <Button color='primary' size='lg' radius='lg'>
          Registrar paciente
        </Button>
      </CardFooter>
    </Card>
  )
}
