import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import { BarChart } from 'lucide-react'
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
          <BarChart size={20} />
          <span
            className={`overflow-hidden h-5 text-[15px] transition-all ${
              expanded ? 'w-[200px] ml-3' : 'w-0'
            }`}
          >
            Reportes
          </span>
        </li>
      </DropdownTrigger>
      <DropdownMenu
        variant='flat'
        aria-label='Example with disabled actions'
        disabledKeys={['edit', 'delete']}
      >
        <DropdownItem key='graficos' className='p-0'>
          <Link to='/report/graficos' className='p-1 w-full  block'>
            Graficos
          </Link>
        </DropdownItem>
        <DropdownItem key='copy'>Copy link</DropdownItem>
        <DropdownItem key='edit'>Edit file</DropdownItem>
        <DropdownItem key='delete' className='text-danger' color='danger'>
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
