export default function MedicalServicesSummary({ detService, totalAmount }) {
  return (
    <div className='bg-slate-100 h-full px-3 py-5 rounded-lg'>
      <h2 className='mb-7 px-2 text-lg font-bold'>
        Resumen de Servicios Médicos{' '}
        {detService.length > 0 && `(${detService.length})`}
      </h2>
      <div className='mb-2 px-3 mx-2 font-bold grid grid-cols-2 gap-x-5 border-b border-gray-300 py-1'>
        <span>Servicio</span>
        <span className='text-right'>Precio</span>
      </div>

      {detService.map((service, index) => (
        <div
          key={index}
          className='mb-2 px-3 mx-2 text-sm grid grid-cols-2 gap-x-5 items-center border-b py-2'
        >
          <span>{service.nombre}</span>
          <span className='text-right'>
            S/. {(service.precio - service.descuento).toFixed(2)}
          </span>
        </div>
      ))}

      <div className='text-lg mt-10 px-5 font-bold rounded-lg py-5 bg-blue-100 flex text-blue-700 justify-between items-center gap-x-2'>
        <span>Total</span>
        S/. {totalAmount ? totalAmount.toFixed(2) : '0'}
      </div>
    </div>
  )
}
