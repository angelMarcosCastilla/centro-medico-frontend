import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [visible, toggleVisible] = useState(false)

  const login = () => {
    if (username && password) alert('¡Bienvenido!')
    else alert('Complete los datos por favor')
  }

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      {/* Login container */}
      <div className="bg-gray-100 flex rounded-2xl shadow-2xl max-w-4xl p-5 items-center">
        {/* Image */}
        <div className="md:block hidden w-1/2 relative">
          <img
            className="rounded-2xl"
            src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
            alt="Logo"
          />
          <p className="text-lg text-center text-white absolute bottom-12 left-1/2 transform -translate-x-1/2 p-2 w-4/5">
            <b>
              &#34;La calidad de nuestro servicio, nuestra mejor garantía&#34;
            </b>
          </p>
        </div>

        {/* Form */}
        <div className="md:w-1/2 px-8 md:px-14">
          <h2 className="font-bold text-4xl">¡Bienvenido!</h2>
          <p className="text-lg mt-4 mb-10">
            Por favor, inicia sesión para continuar...
          </p>

          <form
            className="flex flex-col gap-4"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              color="primary"
              variant="faded"
              type="text"
              name="username"
              value={username}
              className="mb-2"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
            />
            <Input
              color="primary"
              variant="faded"
              type={visible ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={() => toggleVisible(!visible)}
                >
                  {!visible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              }
            />
            <div className="text-sm hover:underline text-end">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
            <Button color="primary" onClick={login}>
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
