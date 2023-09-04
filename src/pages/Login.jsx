import { Button, Input } from '@nextui-org/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [visible, toggleVisible] = useState(false)

  const login = () => {
    /* if (username && password) alert('¡Bienvenido!')
    else alert('Complete los datos por favor') */
    alert('Bienvenido')
    location.href = '/dashboard'
  }

  return (
    <div className='bg-gray-50 min-h-screen flex items-center justify-center'>
      {/* Login container */}
      <div className='bg-gray-100 flex rounded-2xl shadow-2xl max-w-4xl p-5 items-center'>
        {/* Image */}
        <div className='md:block hidden w-1/2 relative'>
          <img
            className='rounded-2xl'
            /* src='https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80' */
            /* src='https://i.imgur.com/jZHyOL1.jpg' */
            src='https://i.imgur.com/LucPa4a.jpg'
          />
          <p className='text-xl text-center text-white absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 w-4/5'>
            <i>
              &#34;La calidad de nuestro servicio, nuestra mejor garantía&#34;
            </i>
          </p>
        </div>

        {/* Form */}
        <div className='md:w-1/2 px-8 md:px-14'>
          <h2 className='font-bold text-4xl'>¡Bienvenido!</h2>
          <p className='text-base mt-4 mb-10'>
            Por favor, inicia sesión para continuar...
          </p>

          <form
            className='flex flex-col gap-4'
            autoComplete='off'
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              color='primary'
              variant='faded'
              size='lg'
              type='text'
              name='username'
              value={username}
              className='mb-2'
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Nombre de usuario'
            />
            <Input
              color='primary'
              variant='faded'
              size='lg'
              type={visible ? 'text' : 'password'}
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Contraseña'
              endContent={
                <button
                  className='focus:outline-none'
                  type='button'
                  onClick={() => toggleVisible(!visible)}
                >
                  {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
            <div className='text-sm text-end hover:underline hover:text-primary-500'>
              <a href='#'>¿Olvidaste tu contraseña?</a>
            </div>
            <Button
              color='primary'
              size='lg'
              onClick={login}
              className='hover:bg-primary-600'
            >
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
