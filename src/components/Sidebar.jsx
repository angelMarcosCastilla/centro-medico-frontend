import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react'
import { Button } from '@nextui-org/react'

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)

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

        <div className='border-t flex px-3 py-4'>
          <img
            src='https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true'
            alt=''
            className='w-10 h-10 rounded-md'
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}
            `}
          >
            <div className='leading-4'>
              <h4 className='font-semibold'>John Doe</h4>
              <span className='text-xs text-gray-600'>johndoe@gmail.com</span>
            </div>
            <Button isIconOnly variant='light'>
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, route }) {
  const { expanded } = useContext(SidebarContext)
  const location = useLocation()

  const isActive = location.pathname.endsWith(route || 'dashboard')

  return (
    <Link to={route ? `./${route}` : ''}>
      <li
        className={`
        relative flex items-center py-2 px-3 my-1
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

Sidebar.propTypes = {
  children: PropTypes.node.isRequired
}

SidebarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  route: PropTypes.string
}
