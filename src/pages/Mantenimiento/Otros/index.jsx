import { Tabs, Tab, CardBody, CardHeader, Divider } from '@nextui-org/react'
import DateTimeClock from '../../../components/DateTimeClock'
import AreaCrud from './components/AreaCrud'
import CategoryCrud from './components/CategoryCrud'
import SpecialtyCrud from './components/SpecialtyCrud'

export default function Otros() {
  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Mantenimiento Adicionales</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <Tabs aria-label='Options' variant='underlined' color='primary'>
          <Tab key='areas' title='Áreas'>
            <AreaCrud />
          </Tab>
          <Tab key='categorias' title='Categorías'>
            <CategoryCrud />
          </Tab>
          <Tab key='especialidades' title='Especialidades'>
            <SpecialtyCrud />
          </Tab>
        </Tabs>
      </CardBody>
    </>
  )
}
