import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { router } from './routes/router.jsx'
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './context/AuthContext.jsx'
import './global.css'
import { Toaster } from 'sonner'
import { initialAxios } from './services/axios.js'

initialAxios()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NextUIProvider>
    <Toaster position='top-right' richColors />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </NextUIProvider>
)
