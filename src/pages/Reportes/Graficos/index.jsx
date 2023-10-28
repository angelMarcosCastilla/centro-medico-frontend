import {
  Card,
  CardBody,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import React from 'react'
import { getAllGraficos } from '../../../services/reporte'
import { useFetcher } from '../../../hook/useFetcher'
import ChartLastAtenciones from '../components/ChartLastAtenciones'
import { TIPO_COMPROBANTE } from '../../../constants/state'

const classArea = {
  Tomografía: 'border-orange-300 [&_h2]:text-orange-500',
  'Rayos X': 'border-green-300 [&_h2]:text-green-500',
  Laboratorio: 'border-red-300 [&_h2]:text-red-500'
}

const classTop = [
  'bg-success-100',
  'bg-orange-50',
  'bg-primary-50',
  'bg-pink-50',
  'bg-red-50'
]

export default function Graficos() {
  const { data, loading } = useFetcher(getAllGraficos)
  const { last7days, totalByarea = [], ranking = [], payment = [] } = data
  const total =
    Number(payment[0]?.total ?? '0') + Number(payment[1]?.total ?? '0')

  return (
    <div className='p-8 overflow-y-auto'>
      <h1 className='mb-5 text-xl '>Información del mes</h1>
      <div className='gap-2 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))]'>
        {totalByarea.map((item, index) => (
          <Card
            className={`h-[150px]  grid place-content-center border-l-4  ${
              classArea[item.categoria]
            }`}
            shadow='sm'
            key={index}
          >
            <CardBody className='overflow-visible p-0'>
              <h2 className='text-xl font-bold mb-2'>{item.categoria}</h2>
              <h3 className='text-center'>{item.total}</h3>
            </CardBody>
          </Card>
        ))}
        <Card
          className={`h-[150px]  grid place-content-center border-l-4 border-primary-500`}
          shadow='sm'
        >
          <CardBody className='overflow-visible p-0'>
            {loading && <Spinner color='primary' />}
            {!loading && (
              <>
                <h1 className='text-xl mb-2 text-center'>
                  S/. {total.toFixed(2)}
                </h1>
                {payment.map((el) => (
                  <h2 key={el.tipo_comprobante}>
                    {TIPO_COMPROBANTE[el.tipo_comprobante]}:{' '}
                    {el?.total ?? '00:0'}{' '}
                  </h2>
                ))}
              </>
            )}
          </CardBody>
        </Card>
      </div>
      <div className='flex flex-row gap-x-5 mt-11 flex-wrap'>
        <div>
          <ChartLastAtenciones last7days={last7days} />
        </div>
        <div className='flex-1'>
          <h2 className='text-center mb-4'>Top 5 servicios </h2>
          <Table
            removeWrapper
            className=''
            aria-label='Example static collection table'
          >
            <TableHeader>
              <TableColumn>N°</TableColumn>
              <TableColumn>Area</TableColumn>
              <TableColumn>Servicio</TableColumn>
              <TableColumn>total</TableColumn>
            </TableHeader>
            <TableBody>
              {ranking.map((el, index) => (
                <TableRow key='4' className={`${classTop[index]}`}>
                  <TableCell >{index + 1}</TableCell>
                  <TableCell >{el.area}</TableCell>
                  <TableCell >{el.nombre_servicio}</TableCell>
                  <TableCell >{el.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
