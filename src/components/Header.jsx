import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User
} from '@nextui-org/react'
import { useAuth } from '../context/AuthContext'
import { mapRoles } from '../constants/auth.constant'

export default function Header({ title = 'Informe' }) {
  const { userInfo, logout } = useAuth()

  return (
    <header className='shadow bg-[white] flex justify-between items-center sticky top-4 px-4 py-5 rounded-lg '>
      <img
        src='/logo.png'
        alt=''
        className='w-[220px] h-[44px]'
      />
      <h1 className='text-xl text-justify'>{title}</h1>
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
          <DropdownItem key='profile'>Firma</DropdownItem>
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
    </header>
  )
}
