import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs
} from '@nextui-org/react'
import { Eye, EyeOff } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { changePassword } from '../services/auth'

const INITIAL_FIELDS = {
  current: { text: '', visible: false },
  new: { text: '', visible: false },
  repeat: { text: '', visible: false }
}

function GeneralContent({ userInfo }) {
  return (
    <div className='flex flex-col gap-4 px-10 py-4 text-[15px] [&_h3]:text-gray-500'>
      <div>
        <h3 className='font-semibold'>Nombre completo</h3>
        <p>{userInfo.nombres + ' ' + userInfo.apellidos}</p>
      </div>
      <div>
        <h3 className='font-semibold'>Fecha de nacimiento:</h3>
        <p>
          {new Date(userInfo.fecha_nacimiento).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
          })}
        </p>
      </div>
      <div>
        <h3 className='font-semibold'>Dirección:</h3>
        <p>{userInfo.direccion || 'No disponible'}</p>
      </div>
      <div>
        <h3 className='font-semibold'>Correo electrónico:</h3>
        <p>{userInfo.correo || 'No disponible'}</p>
      </div>
      <div>
        <h3 className='font-semibold'>Teléfono:</h3>
        <p>
          {(userInfo.celular &&
            `+51 ${userInfo.celular.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`) ||
            'No disponible'}
        </p>
      </div>
    </div>
  )
}

function PasswordContent({ userInfo, fields, setFields, onClose }) {
  const [isSaving, setIsSaving] = useState(false)

  const currentPassword = useRef(null)
  const newPassword = useRef(null)
  const repeatPassword = useRef(null)

  const handleChange = (e) => {
    setFields({
      ...fields,
      [e.target.name]: {
        ...fields[e.target.name],
        text: e.target.value
      }
    })
  }

  const handleKeyDown = (e, ref, nextRef) => {
    if (e.keyCode === 13 && ref.current.value.trim() !== '') {
      nextRef.current.focus()
    }

    if (e.keyCode === 9) {
      e.preventDefault()
      nextRef.current.focus()
    }

    if (e.keyCode === 32) {
      e.preventDefault()
    }
  }

  const isSaveButtonEnabled =
    fields.current.text.trim() === '' ||
    fields.new.text.trim() === '' ||
    fields.repeat.text.trim() === ''

  const handleChangePassword = async (onClose) => {
    setIsSaving(true)

    try {
      const currentPassword = fields.current.text.trim()
      const newPassword = fields.new.text.trim()
      const repeatPassword = fields.repeat.text.trim()

      if (newPassword !== repeatPassword) {
        return toast.error('Las contraseñas no coinciden')
      }

      if (currentPassword === newPassword) {
        return toast.error('Las nueva contraseña deber ser diferente')
      }

      const result = await changePassword(
        userInfo.nombre_usuario,
        currentPassword,
        newPassword
      )

      if (result.isSuccess) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error('Ocurrió un problema al cambiar la contraseña')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='flex flex-col gap-4 px-10 py-4 text-[15px] [&_h3]:text-gray-500'>
      <div>
        <h3 className='font-semibold'>Contraseña actual</h3>
        <Input
          type={fields.current.visible ? 'text' : 'password'}
          value={fields.current.text}
          onChange={handleChange}
          name='current'
          color='primary'
          variant='bordered'
          ref={currentPassword}
          onKeyDown={(e) => {
            handleKeyDown(e, currentPassword, newPassword)
          }}
          endContent={
            <button
              className='focus:outline-none'
              type='button'
              onClick={() =>
                setFields({
                  ...fields,
                  current: {
                    ...fields.current,
                    visible: !fields.current.visible
                  }
                })
              }
            >
              {fields.current.visible ? (
                <EyeOff size={20} color='gray' />
              ) : (
                <Eye size={20} color='gray' />
              )}
            </button>
          }
        />
      </div>
      <div>
        <h3 className='font-semibold'>Nueva contraseña</h3>
        <Input
          type={fields.new.visible ? 'text' : 'password'}
          value={fields.new.text}
          onChange={handleChange}
          name='new'
          color='primary'
          variant='bordered'
          ref={newPassword}
          onKeyDown={(e) => {
            handleKeyDown(e, newPassword, repeatPassword)
          }}
          endContent={
            <button
              className='focus:outline-none'
              type='button'
              onClick={() =>
                setFields({
                  ...fields,
                  new: {
                    ...fields.new,
                    visible: !fields.new.visible
                  }
                })
              }
            >
              {fields.new.visible ? (
                <EyeOff size={20} color='gray' />
              ) : (
                <Eye size={20} color='gray' />
              )}
            </button>
          }
        />
      </div>
      <div>
        <h3 className='font-semibold'>Repetir nueva contraseña</h3>
        <Input
          type={fields.repeat.visible ? 'text' : 'password'}
          value={fields.repeat.text}
          onChange={handleChange}
          name='repeat'
          color='primary'
          variant='bordered'
          ref={repeatPassword}
          endContent={
            <button
              className='focus:outline-none'
              type='button'
              onClick={() =>
                setFields({
                  ...fields,
                  repeat: {
                    ...fields.repeat,
                    visible: !fields.repeat.visible
                  }
                })
              }
            >
              {fields.repeat.visible ? (
                <EyeOff size={20} color='gray' />
              ) : (
                <Eye size={20} color='gray' />
              )}
            </button>
          }
        />
      </div>
      <Button
        isLoading={isSaving}
        isDisabled={isSaveButtonEnabled}
        color='primary'
        onPress={() => handleChangePassword(onClose)}
      >
        Guardar
      </Button>
    </div>
  )
}

export default function Profile({ isOpen, onOpenChange }) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [fields, setFields] = useState(INITIAL_FIELDS)

  const handleOpenChange = async (e) => {
    onOpenChange(e)
    setFields(INITIAL_FIELDS)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      size='2xl'
      radius='sm'
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='pb-0'>
              <div className='flex flex-col w-full items-center pt-2 gap-2'>
                <Avatar
                  src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${
                    userInfo.nombres + ' ' + userInfo.apellidos
                  }`}
                  className='w-20 h-20'
                />
                <h2 className='text-primary-700'>
                  {userInfo.nombres + ' ' + userInfo.apellidos}
                </h2>
              </div>
            </ModalHeader>
            <ModalBody>
              <Card className='max-w-full w-full h-[400px] shadow-none'>
                <CardBody className='overflow-hidden'>
                  <Tabs
                    fullWidth
                    aria-label='Options'
                    color='primary'
                    variant='underlined'
                  >
                    <Tab key='general' title='Información General'>
                      <GeneralContent userInfo={userInfo} />
                    </Tab>
                    <Tab key='contrasenia' title='Restablecer Contraseña'>
                      <PasswordContent
                        userInfo={userInfo}
                        fields={fields}
                        setFields={setFields}
                        onClose={onClose}
                      />
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
