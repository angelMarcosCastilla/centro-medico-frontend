import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Admision from '../pages/Admision'
import Tomografia from '../pages/Tomografia'
import Triaje from '../pages/Triaje.jsx'
import RoleGard from './RoleGard.jsx'
import { listRoles } from '../constants/auth.constant.js'
import Plantillas from '../pages/Plantillas/index.jsx'

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
        element: (
          <RoleGard listRoles={listRoles.admisión}>
            <Admision />
          </RoleGard>
        ),
        index: true
      },
      {
        path: 'tomografia',
        element: (
          <RoleGard listRoles={listRoles.tomografia}>
            <Tomografia />
          </RoleGard>
        )
      },
      {
        path: 'rayosx',
        element: (
          <RoleGard listRoles={listRoles.tomografia}>
            <h1>Rayos x</h1>
          </RoleGard>
        )
      },
      {
        path: 'plantillas',
        element: (
          <RoleGard listRoles={listRoles.plantillas}>
            <Plantillas />
          </RoleGard>
        )
      },
      {
        path: 'laboratorio',
        element: (
          <RoleGard listRoles={listRoles.laboratorio}>
            <h1>Laboratorio</h1>
          </RoleGard>
        )
      },
      {
        path: 'triaje',
        element: (
          <RoleGard listRoles={listRoles.triaje}>
            <Triaje />
          </RoleGard>
        )
      },
      {
        path: '*',
        element: <h1>404</h1>
      }
    ]
  },
  {
    path: 'no-autorizado',
    element: <h1>No estas autorizado</h1>
  }
])

export { router }
