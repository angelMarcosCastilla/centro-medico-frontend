import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Admision from '../pages/Admision'
import Reportes from '../pages/Admision/Reportes'
import Pagos  from '../pages/Admision/Pagos'
import ReportP from '../pages/Admision/ReportP'
import Tomografia from '../pages/Tomografia'
import Rayosx from '../pages/Rayosx'
import Triaje from '../pages/Triaje'
import RoleGard from './RoleGard.jsx'
import { listRoles } from '../constants/auth.constant.js'
import Servicios from '../pages/Servicios'
import FormTriaje from '../pages/Triaje/FormTriaje.jsx'
import Laboratorio from '../pages/Laboratorio/index.jsx'
import Informes from '../pages/Informes/index.jsx'
import ExternalModule from '../pages/ExternalModule/index.jsx'
import ReportEditor from '../pages/Informes/ReportEditor.jsx'
import Plantillas from '../pages/Plantillas/index.jsx'
import TemplateEditor from '../pages/Plantillas/components/TemplateEditor.jsx'
import PrivateRoute from './privateRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/externalmodule',
        element: <ExternalModule />
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
        element: <Dashboard />,
        children: [
          {
            path: 'admision',
            element: (
              <RoleGard listRoles={listRoles.admision}>
                <Admision />
              </RoleGard>
            ),
            index: true
          },
          {
            path: 'reportes',
            element: (
              <RoleGard listRoles={listRoles.admision}>
                <Reportes />
              </RoleGard>
            ),            
          },
          {
            path: 'pagos',
            element:(
              <RoleGard listRoles={listRoles.admision}>
                <Pagos/>
              </RoleGard>
            )
          },              
          {
            path: 'servicios',
            element: (
              <RoleGard listRoles={listRoles.admision}>
                <Servicios />
              </RoleGard>
            )
          },
          {
            path: 'reporte personalizado',
            element: (
              <RoleGard listRoles={listRoles.admision}>
                <ReportP />
              </RoleGard>
            )
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
            path: 'plantillas/:id',
            element: (
              <RoleGard listRoles={listRoles.plantillas}>
                <TemplateEditor />
              </RoleGard>
            )
          },          
          {
            path: '*',
            element: <h1>404</h1>
          }
        ]
      }
    ]
  },
  {
    path: 'no-autorizado',
    element: <h1>No estas autorizado</h1>
  }
])

export { router }
