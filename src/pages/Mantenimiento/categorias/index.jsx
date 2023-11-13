import React from 'react'
import {
  Tabs,
  Tab,
  CardBody,
  CardHeader,
  Divider
} from '@nextui-org/react'
import DateTimeClock from '../../../components/DateTimeClock'
import TableArea from './components/TableArea'
import TableCategorie from './components/TableCategorie'
export default function index() {
  const YourComponent = () => {
    return (
      <div>
        <TableArea />
      </div>
    )
  }
  const SecondTable = () => {
    return (
      <div>
        <TableCategorie />
      </div>
    )
  }
  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Otros...</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Tabs aria-label='Options' variant='underlined' color='primary'>
          <Tab key='categorias' title='Areas' shadow='none'>
            <YourComponent />
          </Tab>
          <Tab key='music' title='Categorias'>
            <SecondTable />
          </Tab>
          <Tab key='videos' title='Especialidades'>
            <YourComponent />
          </Tab>
        </Tabs>
      </CardBody>
    </>
  )
}
