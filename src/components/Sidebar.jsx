import { createContext, useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User,
  useDisclosure
} from '@nextui-org/react'
import { useAuth } from '../context/AuthContext'
import { mapRoles } from '../constants/auth.constant'

const SidebarContext = createContext()

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
              expanded ? 'w-[220px] h-[44px]' : 'w-0'
            }`}
            alt='Centro Médico Melchorita'
            src='../../public/logo.png'
          />
          <Button
            className='text-gray-600'
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

        <div className='border-t flex p-3'>
          <Dropdown placement='bottom-start'>
            <DropdownTrigger>
              <User
                as='button'
                avatarProps={{
                  isBordered: true,
                  src: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${userInfo.nombres}`
                }}
                {...(expanded && {
                  className: 'transition-transform',
                  description: mapRoles[userInfo.nivel_acceso],
                  name: `${userInfo.nombres} ${userInfo.apellidos}`
                })}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='User Actions' variant='flat'>
              <DropdownItem key='profile' onPress={onOpen}>
                Perfil
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className='flex flex-col gap-1'>
                          Modal Title
                        </ModalHeader>
                        <ModalBody>
                          <p>perfil</p>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color='danger'
                            variant='light'
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button color='primary' onPress={onClose}>
                            Action
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
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
        relative flex items-center py-2.5 px-3.5 my-1
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
          className={`overflow-hidden h-5 text-[15px] transition-all ${
            expanded ? 'w-[200px] ml-3' : 'w-0'
          }`}
        >
          {text}
        </span>

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
