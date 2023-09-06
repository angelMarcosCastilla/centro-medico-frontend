import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Tomografia from '../pages/Tomografía.jsx'
import Admision from '../pages/Admision.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    element: <Dashboard />,
    children: [
      {
        index: true,
        path: 'admision',
        element: <Admision />
      },
      {
        path: 'tomografia',
        element: <Tomografia />
      }
    ]
  }
])

export { router }
