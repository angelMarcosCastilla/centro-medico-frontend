import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Admision from '../pages/Admision'
import Tomografia from '../pages/Tomografia'
import Rayosx from '../pages/Rayosx'
import Triaje from '../pages/Triaje'
import RoleGard from './RoleGard.jsx'
import { listRoles } from '../constants/auth.constant.js'
import Plantillas from '../pages/Plantillas/index.jsx'
import ServiciosLaboratorio from '../pages/ServiciosLaboratorio'
import FormTriaje from '../pages/Triaje/FormTriaje.jsx'
import Laboratorio from '../pages/Laboratorio/index.jsx'
import Informes from '../pages/Informes/index.jsx'
import ExternalModule from '../pages/externalModule/index.jsx'
import ReportEditor from '../pages/Informes/ReportEditor.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/externalmodule',
    element: <ExternalModule />
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
          <RoleGard listRoles={listRoles.radiologia}>
            <Rayosx />
          </RoleGard>
        )
      },
      {
        path: 'laboratorio',
        element: (
          <RoleGard listRoles={listRoles.laboratorio}>
            <Laboratorio />
          </RoleGard>
        )
      },
      {
        path: 'servicios',
        element: (
          <RoleGard listRoles={listRoles.servicios}>
            <ServiciosLaboratorio />
          </RoleGard>
        )
      },
      {
        path: 'informes',
        element: (
          <RoleGard listRoles={listRoles.informes}>
            <Informes />
          </RoleGard>
        )
      },
      {
        path: 'informes/:id',
        element: (
          <RoleGard listRoles={listRoles.informes}>
            <ReportEditor />
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
        path: 'triaje',
        element: (
          <RoleGard listRoles={listRoles.triaje}>
            <Triaje />
          </RoleGard>
        )
      },
      {
        path: '/triaje/:id',
        element: (
          <RoleGard listRoles={listRoles.triaje}>
            <FormTriaje />
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
