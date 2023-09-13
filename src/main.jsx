import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { router } from './routes/router.jsx'
import { RouterProvider } from 'react-router-dom'
import './global.css'
import AuthProvider from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NextUIProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </NextUIProvider>
)
