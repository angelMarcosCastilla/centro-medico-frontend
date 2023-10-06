import { Button, Modal, ModalContent } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function NoAuthorization() {
  const [show, setShow] = React.useState(false)
  const { logout } = useAuth()

  const handleClose = () => {
    logout()
  }

  useEffect(() => {
    const abrir = () => setShow(true)
    window.addEventListener('invalidToken', abrir)

    return () => {
      window.removeEventListener('invalidToken', abrir)
    }
  }, [])

  return (
    <Modal backdrop='blur' isOpen={show}>
      <ModalContent className='py-6 px-5 flex flex-col gap-y-4 items-center'>
        <img src='./session.svg' className='w-64 aspect-square'></img>
        <h3 className='text-2xl'>Su sesión a expirado</h3>
        <Button onClick={handleClose}>Ir a login</Button>
      </ModalContent>
    </Modal>
  )
}
