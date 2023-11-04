import {
  Button,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import { getAllChartData } from '../../../services/report'
import { useFetcher } from '../../../hook/useFetcher'
import AreaChartLast7Days from './components/AreaChartLast7Days'
import { TIPO_COMPROBANTE } from '../../../constants/state'
import { Bone, Brain, Landmark, Microscope } from 'lucide-react'
import { cloneElement } from 'react'
import DateTimeClock from '../../../components/DateTimeClock'

const AREAS = {
  Tomografía: {
    style: 'border-primary-400 [&_h2]:text-primary-500',
    icon: <Brain size={25} />
  },
  'Rayos X': {
    style: 'border-success-400 [&_h2]:text-success-500',
    icon: <Bone size={25} />
  },
  Laboratorio: {
    style: 'border-primary-400 [&_h2]:text-primary-500',
    icon: <Microscope size={25} />
  }
}

export default function Graficos() {
  const { data, loading } = useFetcher(getAllChartData)
  const { last7days, totalByarea = [], ranking = [], payment = [] } = data

  const totalAmount = payment.reduce((acc, item) => {
    const amount = Number(item.total_monto) || 0
    return acc + amount
  }, 0)

  return (
    <>
      <CardHeader className='flex justify-between'>
        <h2 className='text-2xl'>Dashboard</h2>
        <DateTimeClock />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='grid grid-cols-4 gap-4 select-none'>
          {totalByarea.map((item) => (
            <div
              className={`h-[150px] grid items-center rounded-2xl border-l-5 shadow-small ${
                AREAS[item.area].style
              }`}
              key={item.idarea}
            >
              <div className='flex justify-evenly items-center overflow-hidden'>
                <div>
                  <h2 className='text-xl font-semibold mb-1'>
                    {item.area === 'Rayos X' ? 'Radiología' : item.area}
                  </h2>
                  <h3 className='text-lg text-center'>{item.total}</h3>
                </div>
                <div>
                  <Button
                    isIconOnly
                    tabIndex={-1}
                    color={
                      item.area === 'Tomografía' || item.area === 'Laboratorio'
                        ? 'primary'
                        : 'success'
                    }
                    variant='flat'
                    size='lg'
                    className='p-1 cursor-default'
                    disableAnimation
                  >
                    {AREAS[item.area].icon}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className='h-[150px] grid items-center rounded-2xl border-l-5 shadow-small border-success-400'>
            <div className='flex justify-evenly items-center overflow-hidden'>
              {loading && <Spinner color='primary' />}
              {!loading && (
                <>
                  <div>
                    <h1 className='font-semibold'>Total de ingresos</h1>
                    <h2 className='text-xl mb-2 text-start'>
                      S/ {totalAmount.toFixed(2)}
                    </h2>
                    {payment.map((el) => (
                      <h2 className='text-sm' key={el.tipo_comprobante}>
                        {TIPO_COMPROBANTE[el.tipo_comprobante]}: S/{' '}
                        {el?.total_monto ?? '00:0'}{' '}
                      </h2>
                    ))}
                  </div>
                  <div>
                    <Button
                      isIconOnly
                      tabIndex={-1}
                      color='success'
                      variant='flat'
                      size='lg'
                      className='p-1 cursor-default'
                      disableAnimation
                    >
                      <Landmark size={25} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='grid lg:grid-cols-3 gap-4 mt-8 '>
          <div className='lg:col-span-2 p-3 rounded-2xl shadow-small'>
            <AreaChartLast7Days last7days={last7days} />
          </div>
          <div className='flex-1 p-3 rounded-2xl shadow-small'>
            <h2 className='text-lg text-center font-semibold mb-4'>
              Top Servicios Más Solicitados
            </h2>
            <Table
              removeWrapper
              hideHeader
              tabIndex={-1}
              aria-label='Tabla de servicios más solicitados'
            >
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>ÁREA</TableColumn>
                <TableColumn>SERVICIO</TableColumn>
                <TableColumn>TOTAL</TableColumn>
              </TableHeader>
              <TableBody>
                {ranking.map((el, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button
                        isIconOnly
                        tabIndex={-1}
                        color={
                          el.area === 'Tomografía'
                            ? 'secondary'
                            : el.area === 'Rayos X'
                            ? 'success'
                            : 'primary'
                        }
                        variant='flat'
                        className='p-1 cursor-default'
                        disableAnimation
                      >
                        {cloneElement(AREAS[el.area].icon, { size: 20 })}
                      </Button>
                    </TableCell>
                    <TableCell>{el.area}</TableCell>
                    <TableCell>{el.nombre_servicio}</TableCell>
                    <TableCell>{el.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardBody>
    </>
  )
}
