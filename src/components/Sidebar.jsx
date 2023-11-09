import { createContext, useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronFirst } from 'lucide-react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  useDisclosure
} from '@nextui-org/react'
import { useAuth } from '../context/AuthContext'
import { mapRoles } from '../constants/auth.constant'
import Profile from './Profile'

export const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(() => {
    const storedExpanded = localStorage.getItem('sidebarExpanded')
    if (storedExpanded) {
      return storedExpanded === 'true'
    }
    return true
  })

  const { logout, userInfo } = useAuth()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', expanded.toString())
  }, [expanded])

  return (
    <aside className='h-screen'>
      <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
        <div
          className={`flex justify-around items-center py-8 ${
            expanded ? 'p-3.5' : 'p-4'
          }`}
        >
          <img
            className={`overflow-hidden transition-all ${
              expanded ? 'w-[220px] h-[44px]' : 'w-0 h-0'
            }`}
            alt='Centro Médico Melchorita'
            src='/logo.png'
          />
          <Button
            className={`text-gray-600 transition-all ${
              !expanded && 'rotate-180'
            }`}
            variant='light'
            isIconOnly
            onPress={() => setExpanded((curr) => !curr)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                setExpanded((curr) => !curr)
              }
            }}
          >
            {<ChevronFirst />}
          </Button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul
            className={`flex-1 px-3 ${
              expanded && 'scrollbar-hide overflow-y-auto'
            }`}
          >
            {children}
          </ul>
        </SidebarContext.Provider>

        <div className='border-t flex p-3'>
          <Dropdown placement='bottom-start'>
            <DropdownTrigger>
              <User
                className=''
                as='button'
                avatarProps={{
                  isBordered: true,
                  src: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${
                    userInfo.nombres + ' ' + userInfo.apellidos
                  }`
                }}
                {...(expanded && {
                  className: 'transition-transform',
                  description: mapRoles[userInfo.nivel_acceso],
                  name: `${userInfo.nombres} ${userInfo.apellidos}`
                })}
                classNames={{
                  root: 'w-full',
                  name:`${expanded ?"w-[190px]" : ""} line-clamp-1 `
                }}
                
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='User Actions' variant='flat'>
              <DropdownItem key='profile' onPress={onOpen}>
                Perfil
              </DropdownItem>
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
          <Profile isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, route, alert }) {
  const { expanded } = useContext(SidebarContext)
  const location = useLocation()

  const isActive = location.pathname.substring(1).startsWith(route)

  return (
    <Link to={route} tabIndex={-1}>
      <li
        className={`
        relative flex items-center py-2.5 px-3.5 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group select-none
        ${
          isActive
            ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
            : 'hover:bg-indigo-50 text-gray-600'
        }
      `}
      >
        {icon}
        <span
          className={`overflow-hidden h-5 text-[15px] transition-all ${
            expanded ? 'w-[200px] ml-3' : 'w-0'
          }`}
        >
          {text}
        </span>

        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? '' : 'top-2'
            }`}
          />
        )}

        {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6 text-[15px]  
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

export function SidebarList({ icon, text, route, items }) {
  const { expanded } = useContext(SidebarContext)
  const location = useLocation()

  const currentRoute = location.pathname.split('/')[1]
  const itemActive = location.pathname.split('/')[2]
  const [open, setOpen] = useState(currentRoute === route)

  /* me gustaría declararle mi amor
  pero solo puedo declarar variables */

  useEffect(() => {
    if (!itemActive || currentRoute !== route) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [itemActive])

  return (
    <>
      <li
        className={`
          relative flex items-center py-2.5 px-3.5 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group select-none
          ${
            currentRoute === route && itemActive && (!expanded || !open)
              ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
              : 'hover:bg-indigo-50 text-gray-600'
          }
        `}
        onClick={() => {
          if (expanded) setOpen(!open)
        }}
      >
        {icon}
        <span
          className={`overflow-hidden h-5 text-[15px] transition-all ${
            expanded ? 'w-[200px] ml-3' : 'w-0'
          }`}
        >
          {text}
        </span>

        {items && expanded && (
          <ChevronDown
            size={20}
            className={`transition-all ${open && 'rotate-180'}`}
          />
        )}

        {!expanded && (
          <div
            className={`
              absolute left-full rounded-lg px-2 py-1 ml-4
              bg-white w-48 border
              invisible opacity-20 -translate-x-3 transition-all
              whitespace-nowrap cursor-auto
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
              z-50
            `}
          >
            <p className='px-2 py-1 text-gray-700'>{text}</p>
            <ul>
              {items.map((item) => (
                <li
                  key={item.key}
                  className={`
                    text-gray-600 text-sm flex items-center gap-x-4
                    my-1 rounded-lg cursor-pointer select-none
                    ${
                      itemActive === item.route
                        ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
                        : 'hover:bg-indigo-50'
                    }
                  `}
                >
                  <Link
                    to={`${route}/${item.route}`}
                    className='w-full rounded-lg px-3 py-1.5'
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>

      {items && expanded && open && (
        <ul>
          {items.map((item) => (
            <li
              key={item.key}
              className={`
                text-gray-600 text-sm flex items-center gap-x-4
                my-1 rounded-md cursor-pointer select-none
                ${
                  itemActive === item.route
                    ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
                    : 'hover:bg-indigo-50'
                }
              `}
            >
              <Link
                to={`${route}/${item.route}`}
                className='w-full block px-3.5 py-1.5 pl-[46px]'
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
