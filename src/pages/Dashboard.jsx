import { Outlet } from 'react-router-dom'
import Sidebar, { SidebarItem, SidebarList } from '../components/Sidebar'
import {
  Brain,
  Bone,
  Microscope,
  LayoutTemplate,
  HeartHandshake,
  Folders,
  HelpingHand,
  Info,
  Computer,
  Building2,
  LineChart,
  UserCog
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import HasRole from '../components/HasRole'
import { listRoles } from '../constants/auth.constant'
import { DataProvider } from './Admision/components/DataContext'
import { Card } from '@nextui-org/react'
import { useState, useEffect } from 'react'

import { socket } from '../components/Socket'
import { toast } from 'sonner'

function LinkInforme({ userInfo }) {
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    socket.on('server:newAction', ({ action }) => {
      if (action === 'New Informe' && userInfo.nivel_acceso === 'A') {
        setHasNew(true)
        toast(
          <div className='flex justify-between text-blue-600'>
            <Info size={20} className='mr-2' />
            <span>Hay nuevo informes</span>
          </div>
        )
      }
    })

    return () => socket.off('server:newAction')
  }, [])
  return (
    <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.informes}>
      <span
        onClick={() => {
          setHasNew(false)
        }}
      >
        <SidebarItem
          icon={<Folders size={20} />}
          text='Informes'
          route='informes'
          alert={hasNew}
        />
      </span>
    </HasRole>
  )
}

export default function Dashboard() {
  const { userInfo } = useAuth()

  return (
    <div className='flex h-screen'>
      <Sidebar>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.admision}>
          <SidebarItem
            icon={<Computer size={20} />}
            text='Admisión'
            route='admision'
          />
        </HasRole>
        <LinkInforme userInfo={userInfo} />
        <HasRole
          rol={userInfo.nivel_acceso}
          listRoles={listRoles.pagosconvenio}
        >
          <SidebarItem
            icon={<Building2 size={20} />}
            text='Pagos por Convenio'
            route='pagosconvenio'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.reembolsos}>
          <SidebarItem
            icon={<HelpingHand size={20} />}
            text='Reembolsos'
            route='reembolsos'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.servicios}>
          <SidebarItem
            icon={<HeartHandshake size={20} />}
            text='Servicios'
            route='servicios'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.tomografia}>
          <SidebarItem
            icon={<Brain size={20} />}
            text='Tomografía'
            route='tomografia'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.radiologia}>
          <SidebarItem
            icon={<Bone size={20} />}
            text='Rayos X'
            route='rayosx'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.laboratorio}>
          <SidebarItem
            icon={<Microscope size={20} />}
            text='Laboratorio'
            route='laboratorio'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.laboratorio}>
          <SidebarItem
            icon={<Folders size={20} />}
            text='Informes'
            route='informeslaboratorio'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.plantillas}>
          <SidebarItem
            icon={<LayoutTemplate size={20} />}
            text='Plantillas'
            route='plantillas'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.triaje}>
          <SidebarItem
            icon={<LayoutTemplate size={20} />}
            text='Triaje'
            route='triaje'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.reportes}>
          <SidebarList
            icon={<LineChart size={20} />}
            text='Reportes'
            route='reportes'
            items={[
              { key: '1', label: 'Gráficos', route: 'graficos' },
              { key: '2', label: 'Pagos', route: 'pagos' },
              { key: '3', label: 'Atenciones', route: 'atenciones' }
            ]}
          />
        </HasRole>
        <HasRole
          rol={userInfo.nivel_acceso}
          listRoles={listRoles.mantenimiento}
        >
          <SidebarList
            icon={<UserCog size={20} />}
            text='Mantenimiento'
            route='mantenimiento'
            items={[
              { key: '1', label: 'Personas', route: 'personas' },
              { key: '2', label: 'Empresas', route: 'empresas' },
              { key: '3', label: 'Personal Médico', route: 'personal-medico' }
            ]}
          />
        </HasRole>
      </Sidebar>
      <div className='bg-slate-100 flex-1 px-5 py-3 overflow-y-auto'>
        <DataProvider>
          <Card className='h-full' shadow='none'>
            <Outlet />
          </Card>
        </DataProvider>
      </div>
    </div>
  )
}
