import { CircleDollarSign } from 'lucide-react'
import React from 'react'

export default function DetalleServiciosCard({ detService, montoTotal }) {
  return (
    <article className='bg-slate-100 h-full px-3 py-3'>
      <h2 className='mb-7 px-5'>Detalles servicios</h2>
      <div className='mb-2 px-5 font-bold grid grid-cols-2 gap-x-5 border-b border-gray-300 py-1'>
        <span>Servicio</span>
        <span className='text-right'>Precio</span>
      </div>
      {detService.map((service, index) => (
        <div
          key={index}
          className='mb-2 px-5 text-sm grid grid-cols-2 gap-x-5 border-b py-2'
        >
          <span>{service.nombre}</span>
          <span className='text-right'>
            s/. {service.precio - service.descuento}
          </span>
        </div>
      ))}

      <div className='text-xl mt-12 rounded py-5 bg-blue-100 flex-col text-blue-700 flex justify-start items-center gap-y-2'>
        <CircleDollarSign size={50} />
        S/. {montoTotal}
      </div>
    </article>
  )
}
