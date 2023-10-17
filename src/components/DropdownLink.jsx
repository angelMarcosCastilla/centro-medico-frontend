import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import { AreaChart } from 'lucide-react'
import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SidebarContext } from './Sidebar'

export default function DropdownLink() {
  const { pathname } = useLocation()
  const { expanded } = useContext(SidebarContext)

  const isActive = pathname.includes('report')

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
          <AreaChart size={20} />
          <span
            className={`overflow-hidden h-5 text-[15px] transition-all ${
              expanded ? 'w-[200px] ml-3' : 'w-0'
            }`}
          >
            Reportes
          </span>
        </li>
      </DropdownTrigger>
      <DropdownMenu variant='flat' aria-label='Example with disabled actions'>
        <DropdownItem key='graficos' className='p-0'>
          <Link to='/reportes/graficos' className='p-2 w-full block'>
            Gráficos
          </Link>
        </DropdownItem>
        <DropdownItem key='pagos' className='p-0'>
          <Link to='/reportes/pagos' className='p-2 w-full block'>
            Pagos
          </Link>
        </DropdownItem>
        <DropdownItem key='servicios' className='p-0'>
          <Link to='/reportes/servicios' className='p-2 w-full block'>
            Servicios
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
