import { Navigate, Outlet } from 'react-router-dom'
import Sidebar, { SidebarItem } from '../components/Sidebar'
import { Brain, Bone, Microscope, FileText, LayoutTemplate } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import HasRole from '../components/HasRole'
import { listRoles } from '../constants/auth.constant'
import { DataProvider } from './Admision/components/DataContext'
import { Card } from '@nextui-org/react'

export default function Dashboard() {
  const { isAuthenticated, userInfo } = useAuth()

  if (!isAuthenticated) return <Navigate to='/' />

  return (
    <div className='flex h-screen'>
      <Sidebar>
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.admisión}>
          <SidebarItem
            icon={<FileText size={20} />}
            text='Admisión'
            route='admision'
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
        <HasRole rol={userInfo.nivel_acceso} listRoles={listRoles.plantillas}>
          <SidebarItem
            icon={<LayoutTemplate size={20} />}
            text='Plantillas'
            route='plantillas'
          />
        </HasRole>
      </Sidebar>
      <div className='bg-slate-100 flex-1 px-10 py-5 overflow-y-auto'>
        <DataProvider>
          <Card className='h-full' shadow='none'>
            <Outlet />
          </Card>
        </DataProvider>
      </div>
    </div>
  )
}
