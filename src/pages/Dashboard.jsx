import { Outlet } from 'react-router-dom'
import Sidebar, { SidebarItem } from '../components/Sidebar'
import {
  Brain,
  Bone,
  Microscope,
  FileText,
  LayoutTemplate,
  HeartHandshake,
  Folders,
  HelpingHand,
  AreaChart
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import HasRole from '../components/HasRole'
import { listRoles } from '../constants/auth.constant'
import { DataProvider } from './Admision/components/DataContext'
import { Card } from '@nextui-org/react'
import DropdownLink from '../components/DropdownLink'

export default function Dashboard() {
  const { userInfo } = useAuth()

  return (
    <div className='flex h-screen'>
      <Sidebar>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.admision}>
          <SidebarItem
            icon={<FileText size={20} />}
            text='Admisión'
            route='admision'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.admision}>
          <SidebarItem
            icon={<Folders size={20} />}
            text='Reportes'
            route='reportes'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.admision}>
          <SidebarItem
            icon={<HelpingHand size={20} />}
            text='Pagos'
            route='pagos'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.admision}>
          <SidebarItem
            icon={<HeartHandshake size={20} />}
            text='Servicios'
            route='servicios'
          />
        </HasRole>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.admision}>
          <SidebarItem
            icon={<AreaChart size={20} />}
            text='Reporte Personalizado'
            route='reporte personalizado'
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
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.informes}>
          <SidebarItem
            icon={<Folders size={20} />}
            text='Informes'
            route='informes'
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
        {userInfo.nivel_acceso === 'A' && <DropdownLink />}
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
