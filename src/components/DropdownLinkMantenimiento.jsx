import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import {  UserCog } from 'lucide-react'
import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SidebarContext } from './Sidebar'

export default function DropdownLinkMantenimiento() {
  const { pathname } = useLocation()
  const { expanded } = useContext(SidebarContext)

  const isActive = pathname.includes('mantenimiento')

  return (
    <Dropdown placement='left' showArrow>
      <DropdownTrigger>
        <li
          className={`
        relative flex items-center py-2.5 px-3.5 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        aria-[expanded=true]:opacity-100
        ${
          isActive
            ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
            : 'hover:bg-indigo-50 text-gray-600'
        }
      `}
        >
          <UserCog size={20} />
          <span
            className={`overflow-hidden h-5 text-[15px] transition-all ${
              expanded ? 'w-[200px] ml-3' : 'w-0'
            }`}
          >
            Mantenimiento
          </span>
        </li>
      </DropdownTrigger>
      <DropdownMenu variant='flat' aria-label='Example with disabled actions'>
        <DropdownItem key='graficos' className='p-0'>
          <Link to='/mantenimiento/personas' className='p-2 w-full block'>
            Personas
          </Link>
        </DropdownItem>
        <DropdownItem key='graficos' className='p-0'>
          <Link to='/mantenimiento/empresas' className='p-2 w-full block'>
            Empresas
          </Link>
        </DropdownItem>
        
      </DropdownMenu>
    </Dropdown>
  )
}
