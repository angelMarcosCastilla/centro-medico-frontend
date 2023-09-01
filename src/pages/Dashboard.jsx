import { Outlet } from "react-router-dom"
import Sidebar, { SidebarItem } from '../components/Sidebar'
import {
  Settings,
  Brain,
  Bone,
  Home,
  HelpCircle
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem icon={<Home size={20} />} text="Inicio" />
        <SidebarItem icon={<Brain size={20} />} text="Tomografía" route="tomografia" />
        <SidebarItem icon={<Bone size={20} />} text="Rayos X" route="rayosx" />
        <hr className="my-3" />
        <SidebarItem icon={<Settings size={20} />} text="Configuración" />
        <SidebarItem icon={<HelpCircle size={20} />} text="Ayuda" />
      </Sidebar>
      <div className="flex-1 px-10 py-5">
        <Outlet />
      </div>
    </div>
  )
}
