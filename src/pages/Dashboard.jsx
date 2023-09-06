import { Outlet } from 'react-router-dom'
import Sidebar, { SidebarItem } from '../components/Sidebar'
import { Brain, Bone, FileText } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className='flex h-screen'>
      <Sidebar>
        <SidebarItem
          icon={<FileText size={20} />}
          text='Admisión'
          route='admision'
        />
        <SidebarItem
          icon={<Brain size={20} />}
          text='Tomografía'
          route='tomografia'
        />
        <SidebarItem icon={<Bone size={20} />} text='Rayos X' route='rayosx' />
      </Sidebar>
      <div className='bg-slate-100 flex-1 px-10 py-5 overflow-y-auto'>
        <Outlet />
      </div>
    </div>
  )
}
