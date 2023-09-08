import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Admision from '../pages/Admision.jsx'
import Tomografia from '../pages/Tomografia'
import Triaje from '../pages/Triaje.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    element: <Dashboard />,
    children: [
      {
        path: 'admision',
        element: <Admision />,
        index: true
      },
      {
        path: 'tomografia',
        element: <Tomografia />
      },
      {
        path: 'rayosx',
        element: <h1>Rayos X</h1>
      },
      {
        path: 'triaje',
        element: <Triaje />
      },
      {
        path: '*',
        element: <h1>404</h1>
      }
    ]
  }
])

export { router }
