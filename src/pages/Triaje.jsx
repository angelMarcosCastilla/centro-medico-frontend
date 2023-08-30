import { Button, Checkbox, Input, Tab, Tabs } from '@nextui-org/react'
import React, { useState } from 'react'
const factoresRiezgos = [
  {
    name: 'Diabetis',
    checked: false
  },
  {
    name: 'Hipertensión Arterial',
    checked: false
  },
  {
    name: 'Alergia: Cerdo, marisco, etc',
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
    name: 'Otro',
    text: ''
  }
]

export default function Triaje() {
  const [factores, setFactores] = useState(factoresRiezgos)

  const handleSelectdRiezgo = (e) => {
    const { value, checked } = e.target
    const newFactores = factores.map((factor) => {
      if (factor.name === value) {
        factor.checked = checked
      }
      return factor
    })
    setFactores(newFactores)
  }

  const handleChangeOtro = (e) => {
    const { value } = e.target
    const newFactores = factores.map((factor) => {
      if (factor.name === 'Otro') {
        factor.text = value
      }
      return factor
    })
    setFactores(newFactores)
  }

  return (
    <section>
      <h1 className='text-center mb-2'>Identificación del paciente - Triaje</h1>
      <div className='flex justify-between gap-x-12'>
        <article className='w-full'>
          <h2 className='mb-2'>Datos Pacientes: </h2>
          <div className='flex gap-3 mb-4'>
            <Input label='Nombre' placeholder='Nombre' />
            <Input label='Apellido' placeholder='Apellido' />
          </div>
          <div className='flex gap-3 mb-4'>
            <Input label='Numero documento' placeholder='Numero documento' />
            <Input label='celular' placeholder='celular' />
          </div>
          <div className='flex gap-3 mb-4'>
            <Input label='direccion' placeholder='direccion' />
          </div>
        </article>
        <article className='w-full'>
          <p className='mb-4 text-right'>
            fecha: {new Date().toLocaleDateString('es')}
          </p>
          <h2 className='mb-4'>Investigador: </h2>
          <div className='flex gap-3 mb-4'>
            <Input label='Nombre' placeholder='Nombre' />
            <Input label='Apellido' placeholder='Apellido' />
          </div>
        </article>
      </div>
      <Tabs
        className=''
        color='primary'
        aria-label='Tabs colors'
        size='lg'
        variant='underlined'
        radius='full'
      >
        <Tab
          key='factoresRiesgo'
          title='Factores de riesgo'
          className='text-black'
        >
          <div className='px-4 '>
            <div className='grid grid-cols-2 lg:w-1/2 gap-3'>
              {factoresRiezgos.map((factor, index) => {
                if (factor.name === 'Otro') {
                  return (
                    <Input
                      size='sm'
                      className='h-full'
                      onChange={handleChangeOtro}
                      key={index}
                      value={factor.text}
                      placeholder='Otros'
                    />
                  )
                }
                return (
                  <Checkbox
                    defaultSelected={factor.checked}
                    value={factor.name}
                    key={index}
                    onChange={handleSelectdRiezgo}
                  >
                    {factor.name}
                  </Checkbox>
                )
              })}
            </div>
          </div>
        </Tab>
        <Tab key='controlfuncionesfitales' title='Control de funciones Vitales'>
          <div className='px-4 '>
            <div className='grid grid-cols-2 lg:w-1/2 gap-3 gap-x-6'>
              <Input
                radius='lg'
                variant='bordered'
                type='number'
                label='Temperatura'
                placeholder='Temperatura'
                labelPlacement='outside'
              />
              <Input
                radius='lg'
                variant='bordered'
                label='Presión arterial'
                placeholder='Presión arterial'
                labelPlacement='outside'
              />
              <Input
                radius='lg'
                variant='bordered'
                label='Frecuencia Cardiaca'
                placeholder='Frecuencia Cardiaca'
                labelPlacement='outside'
              />
              <Input
                radius='lg'
                variant='bordered'
                label='frecuencia Respiratoria'
                placeholder='frecuencia Respiratoria'
                labelPlacement='outside'
              />
            </div>
          </div>
        </Tab>
      </Tabs>
      <Button color='primary' className='my-3'>
        Registrar Triaje
      </Button>
    </section>
  )
}
