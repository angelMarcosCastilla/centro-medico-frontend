import { Outlet } from "react-router-dom"
import Sidebar, { SidebarItem } from '../components/Sidebar'
import {
  Brain,
  Bone,
  Home,
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem icon={<Home size={20} />} text="Inicio" />
        <SidebarItem icon={<Bone size={20}/>} text="Admisión" />
        <SidebarItem icon={<Brain size={20} />} text="Tomografía" route="tomografia" />
        <SidebarItem icon={<Bone size={20} />} text="Rayos X" route="rayosx" />
      </Sidebar>
      <div className=" bg-slate-100 flex-1 px-10 py-5">
        <Outlet />
      </div>
    </div>
  )
}
