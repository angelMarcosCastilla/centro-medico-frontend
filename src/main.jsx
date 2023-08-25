import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { router } from './routes/router.jsx'
import { RouterProvider } from 'react-router-dom'
import './global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NextUIProvider>
    <RouterProvider router={router} />
  </NextUIProvider>
)
