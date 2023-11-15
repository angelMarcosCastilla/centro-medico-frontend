import { Lock } from 'lucide-react'

export default function Unauthorized() {
  return (
    <div className='h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white py-20 px-24 max-w-3xl rounded-2xl shadow-md text-center'>
        <div className='flex flex-col items-center'>
          <Lock size={150} className='text-gray-500 mb-5' />
          <h1 className='text-5xl font-bold text-gray-500 mb-4'>401</h1>
          <h2 className='text-2xl text-gray-500 mb-4'>Acceso no autorizado</h2>
          <p className='text-gray-500'>
            No tienes los permisos necesarios para acceder a esta página.
            Verifica tus credenciales e intenta nuevamente.
          </p>
        </div>
      </div>
    </div>
  )
}
