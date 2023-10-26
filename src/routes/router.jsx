import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Admision from '../pages/Admision'
import Informes from '../pages/Informes'
import Pagos from '../pages/Pagos'
import Tomografia from '../pages/Tomografia'
import Rayosx from '../pages/Rayosx'
import Triaje from '../pages/Triaje'
import RoleGard from './RoleGard.jsx'
import { listRoles } from '../constants/auth.constant.js'
import Servicios from '../pages/Servicios'
import FormTriaje from '../pages/Triaje/FormTriaje.jsx'
import Laboratorio from '../pages/Laboratorio/index.jsx'
import InformesLaboratorio from '../pages/InformesLaboratorio'
import ExternalModule from '../pages/ExternalModule/index.jsx'
import ReportEditor from '../pages/InformesLaboratorio/ReportEditor.jsx'
import Plantillas from '../pages/Plantillas/index.jsx'
import TemplateEditor from '../pages/Plantillas/components/TemplateEditor.jsx'
import PrivateRoute from './privateRoute.jsx'
import ReporteAtenciones from '../pages/Reportes/ReporteAtenciones'
import Graficos from '../pages/Reportes/Graficos/index.jsx'
import ReportePagos from '../pages/Reportes/ReportePagos/index.jsx'
import Mantenimiento from '../pages/mantenimiento/mantenimiento.jsx'
import Personas from '../pages/mantenimiento/personas/index.jsx'
import Reembolsos from '../pages/Reembolsos'

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
            path: 'informes',
            element: (
              <RoleGard listRoles={listRoles.admision}>
                <Informes />
              </RoleGard>
            )
          },
          {
            path: 'pagos',
            element: (
              <RoleGard listRoles={listRoles.admision}>
                <Pagos />
              </RoleGard>
            )
          },
          {
            path: 'reembolsos',
            element: (
              <RoleGard listRoles={listRoles.admision}>
                <Reembolsos />
              </RoleGard>
            )
          },
          {
            path: '/reportes/graficos',
            element: (
              <RoleGard listRoles={['A']}>
                <Graficos />
              </RoleGard>
            )
          },
          {
            path: '/reportes/pagos',
            element: (
              <RoleGard listRoles={['A']}>
                <ReportePagos />
              </RoleGard>
            )
          },
          {
            path: '/reportes/atenciones',
            element: (
              <RoleGard listRoles={['A']}>
                <ReporteAtenciones />
              </RoleGard>
            )
          },
          {
            path: '/mantenimiento',
            element: (
              <RoleGard listRoles={['A']}>
                <Mantenimiento />
              </RoleGard>
            ),
            children: [
              {
                path: 'personas',
                element: <Personas />
              }
            ]
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
            path: 'informeslaboratorio',
            element: (
              <RoleGard listRoles={listRoles.informes}>
                <InformesLaboratorio />
              </RoleGard>
            )
          },
          {
            path: 'informeslaboratorio/:id',
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
