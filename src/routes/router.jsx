import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Admision from '../pages/Admision'
import Informes from '../pages/Informes'
import Tomografia from '../pages/Tomografia'
import Rayosx from '../pages/Rayosx'
import Triaje from '../pages/Triaje'
import RoleGard from './RoleGard.jsx'
import { listRoles } from '../constants/auth.constant.js'
import Servicios from '../pages/Servicios'
import FormTriaje from '../pages/Triaje/FormTriaje.jsx'
import Laboratorio from '../pages/Laboratorio/index.jsx'
import InformesLaboratorio from '../pages/InformesLaboratorio'
import GestionInformes from '../pages/GestionInformes'
import ReportEditor from '../pages/InformesLaboratorio/components/ReportEditor.jsx'
import Plantillas from '../pages/Plantillas/index.jsx'
import TemplateEditor from '../pages/Plantillas/components/TemplateEditor.jsx'
import PrivateRoute from './privateRoute.jsx'
import ReporteAtenciones from '../pages/Reportes/ReporteAtenciones'
import Graficos from '../pages/Reportes/Graficos'
import Empresas from '../pages/mantenimiento/Empresas'
import ReportePagos from '../pages/Reportes/ReportePagos'
import Mantenimiento from '../pages/mantenimiento'
import Personas from '../pages/mantenimiento/Personas'
import Categorias from '../pages/mantenimiento/categorias/index.jsx'
import Reembolsos from '../pages/Reembolsos'
import PagosConvenio from '../pages/PagosConvenio'
import PersonalMedico from '../pages/mantenimiento/personalMedico/index.jsx'
import Reportes from '../pages/Reportes'
import NotFound from '../pages/NotFound.jsx'
import Usuarios from '../pages/mantenimiento/usuarios/index.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/gestion-informes',
        element: <GestionInformes />
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
            path: 'pagosconvenio',
            element: (
              <RoleGard listRoles={listRoles.pagosconvenio}>
                <PagosConvenio />
              </RoleGard>
            )
          },
          {
            path: 'reembolsos',
            element: (
              <RoleGard listRoles={listRoles.reembolsos}>
                <Reembolsos />
              </RoleGard>
            )
          },
          {
            path: 'servicios',
            element: (
              <RoleGard listRoles={listRoles.servicios}>
                <Servicios />
              </RoleGard>
            )
          },
          {
            path: 'reportes',
            element: (
              <RoleGard listRoles={listRoles.reportes}>
                <Reportes />
              </RoleGard>
            ),
            children: [
              {
                path: 'graficos',
                element: <Graficos />
              },
              {
                path: 'pagos',
                element: <ReportePagos />
              },
              {
                path: 'atenciones',
                element: <ReporteAtenciones />
              }
            ]
          },

          {
            path: '/mantenimiento',
            element: (
              <RoleGard listRoles={listRoles.mantenimiento}>
                <Mantenimiento />
              </RoleGard>
            ),
            children: [
              {
                path: 'personas',
                element: <Personas />
              },
              {
                path: 'empresas',
                element: <Empresas />
              },
              {
                path: 'personal-medico',
                element: <PersonalMedico />
              },
              {
                path: 'categorias',
                element: <Categorias />
              },
              {
                path: 'usuarios',
                element: <Usuarios />
              }
            ]
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
            path: 'informes-laboratorio',
            element: (
              <RoleGard listRoles={listRoles.laboratorio}>
                <InformesLaboratorio />
              </RoleGard>
            )
          },
          {
            path: 'informes-laboratorio/:id',
            element: (
              <RoleGard listRoles={listRoles.laboratorio}>
                <ReportEditor />
              </RoleGard>
            )
          },
          {
            path: 'plantillas',
            element: (
              <RoleGard listRoles={listRoles.laboratorio}>
                <Plantillas />
              </RoleGard>
            )
          },
          {
            path: 'plantillas/:id',
            element: (
              <RoleGard listRoles={listRoles.laboratorio}>
                <TemplateEditor />
              </RoleGard>
            )
          }
        ]
      }
    ]
  },
  {
    path: 'no-autorizado',
    element: <h1>No estas autorizado</h1>
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export { router }
