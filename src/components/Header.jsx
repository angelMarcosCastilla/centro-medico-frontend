import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User
} from '@nextui-org/react'
import { useAuth } from '../context/AuthContext'
import { mapRoles } from '../constants/auth.constant'

export default function Header({ title }) {
  const { userInfo, logout } = useAuth()

  return (
    <header className='bg-white grid grid-cols-3 items-center sticky top-4 p-5 rounded-2xl shadow-small'>
      <div className='flex justify-start'>
        <img
          src='/logo.png'
          alt='Centro Médico Melchorita'
          className='w-[220px] h-[44px]'
        />
      </div>
      <div className='flex justify-center'>
        <h1 className='text-xl font-bold text-center'>{title}</h1>
      </div>
      <div className='flex justify-end'>
        <Dropdown placement='bottom-start'>
          <DropdownTrigger>
            <User
              as='button'
              avatarProps={{
                className: 'ml-2',
                isBordered: true,
                src: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${userInfo.nombres}`
              }}
              description={mapRoles[userInfo.nivel_acceso]}
              classNames={{
                base: 'flex-row-reverse',
                wrapper: 'items-end'
              }}
              name={`${userInfo.nombres} ${userInfo.apellidos}`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label='User Actions' variant='flat'>
            <DropdownItem key='profile'>Perfil</DropdownItem>
            <DropdownItem key='signature'>Firma</DropdownItem>
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
    </header>
  )
}
