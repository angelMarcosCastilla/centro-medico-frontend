import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

export default function AreaChartLast7Days({ last7days }) {
  return (
    <div className='w-full h-full'>
      <h2 className='text-center font-semibold'>
        N° de atenciones de los últimos 7 días
      </h2>
      <ResponsiveContainer width='100%' height='95%'>
        <AreaChart
          data={last7days}
          margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
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
      </ResponsiveContainer>
    </div>
  )
}
