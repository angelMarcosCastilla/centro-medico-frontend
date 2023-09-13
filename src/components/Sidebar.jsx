import { createContext, useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User
} from '@nextui-org/react'
import { useAuth } from '../context/AuthContext'

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(() => {
    const storedExpanded = localStorage.getItem('sidebarExpanded')
    if (storedExpanded) {
      return storedExpanded === 'true'
    }
    return true
  })

  const {
    logout,
    userInfo: { data }
  } = useAuth()

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', expanded.toString())
  }, [expanded])

  return (
    <aside className='h-screen'>
      <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
        <div className='p-4 pb-5 flex justify-between items-center'>
          <img
            className={`overflow-hidden transition-all ${
              expanded ? 'w-56' : 'w-0'
            }`}
            alt='Centro Médico Melchorita'
            src='https://i.imgur.com/jZHyOL1.jpg'
          />
          <Button
            variant='light'
            isIconOnly
            onClick={() => setExpanded((curr) => !curr)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className='flex-1 px-3'>{children}</ul>
        </SidebarContext.Provider>

        <div className='border-t flex px-4 py-4'>
          <Dropdown placement='bottom-start'>
            <DropdownTrigger>
              <User
                as='button'
                avatarProps={{
                  isBordered: true,
                  src: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${data.nombre_usuario}`
                }}
                {...(expanded && {
                  className: 'transition-transform',
                  description: data.nivel_acceso,
                  name: data.nombre_usuario
                })}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='User Actions' variant='flat'>
              <DropdownItem key='profile'>Perfil</DropdownItem>
              <DropdownItem
                key='logout'
                color='danger'
                onClick={() => {
                  localStorage.removeItem('sidebarExpanded')
                  logout()
                }}
              >
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, route }) {
  const { expanded } = useContext(SidebarContext)
  const location = useLocation()

  const isActive = location.pathname.endsWith(route)

  return (
    <Link to={route}>
      <li
        className={`
        relative flex items-center py-2 px-3.5 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          isActive
            ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
            : 'hover:bg-indigo-50 text-gray-600'
        }
      `}
      >
        {icon}
        <span
          className={`overflow-hidden h-6 transition-all ${
            expanded ? 'w-52 ml-3' : 'w-0'
          }`}
        >
          {text}
        </span>

        {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-indigo-100 text-indigo-800
              invisible opacity-20 -translate-x-3 transition-all
              whitespace-nowrap
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
              z-50
            `}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  )
}
