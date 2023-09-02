import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Tomografia from '../pages/Tomografía.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        path: '',
        element: <h1>Home</h1>,
        index: true
      },
      {
        path: "admision",
        element: <h1>Admisión</h1>
      },
      {
        path: "tomografia",
        element: <Tomografia/>
      },
      {
        path: "rayosx",
        element: <h1>Rayos X</h1>,
      }, 
      {
        path: 'laboratorio',
        element: <h1>Laboratorio</h1>
      }
    ]
  }
])

export { router }
