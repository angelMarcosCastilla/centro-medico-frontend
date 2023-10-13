import React from 'react'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

export default function ChartLastAtenciones({last7days}) {
  return (
    <>
      {' '}
      <h2 className='text-center'>Totales Atenciones de las últimas semanas</h2>
      <AreaChart
        width={750}
        height={350}
        data={last7days}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id='total' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#0070f0' stopOpacity={0.8} />
            <stop offset='50%' stopColor='#0070f0' stopOpacity={0.3} />
            <stop offset='100%' stopColor='#0070f0' stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey='fecha' />
        <YAxis />
        <CartesianGrid strokeDasharray='3 3' />
        <Tooltip />
        <Area
          type='monotone'
          dataKey='total'
          stroke='#0070f0'
          fillOpacity={1}
          fill='url(#total)'
        />
      </AreaChart>
    </>
  )
}
