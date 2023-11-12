import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, Search } from 'lucide-react'
import {
  createUser,
  searchPersonNotUser,
  updateUser
} from '../../../../services/user'
import { rolesOptions } from '../../../../constants/auth.constant'

export default function ModalFormUser({
  isOpen,
  onOpenChange,
  userToEdit,
  refresh
}) {
  const [loading, setLoading] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const [person, setPerson] = useState(null)
  const [accessLevel, setAccessLevel] = useState(new Set([]))
  const [visible, toggleVisible] = useState({ new: false, repeat: false })

  const handleSearchPerson = async (e) => {
    if (e.key !== 'Enter') return

    const docNumber = e.target.value
    if (!docNumber || docNumber.length < 8) return

    const result = await searchPersonNotUser(docNumber)
    if (!result.data) {
      setPerson(null)
      toast.error('No se encontró a la persona')
      return
    }

    if (result.data.idusuario) {
      setPerson(null)
      toast.error('Esta persona ya está registrada')
      return
    }
    setPerson(result.data)
  }

  const personName = userToEdit
    ? `${userToEdit?.nombres} ${userToEdit?.apellidos}`
    : person?.nombres
    ? `${person?.nombres} ${person?.apellidos}`
    : ''

  const handleAddOrEditPerson = async (e, onClose) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const dataToSend = Object.fromEntries(formData)

    if (dataToSend.claveAcceso !== dataToSend.claveAccesoRepetida)
      return toast.error('Las contraseñas no coinciden')

    if (!userToEdit) {
      dataToSend.idPersona = person.idpersona
      dataToSend.nivelAcceso = [...accessLevel][0]
      console.log(dataToSend)
      try {
        const result = await createUser(dataToSend)
        refresh()
        toast.success(result.message)
        onClose()
      } catch {
        toast.error('Ocurrió un problema al guardar')
      }
    } else {
      dataToSend.nivelAcceso = [...accessLevel][0]
      dataToSend.cambiarClaveAcceso = isSelected

      try {
        const result = await updateUser(userToEdit.idusuario, dataToSend)
        refresh()
        toast.success(result.message)
        onClose()
      } catch {
        toast.error('Ocurrió un problema al guardar')
      }
    }

    setLoading(false)
  }

  const handleOpenChange = (e) => {
    onOpenChange(e)
    setPerson(null)
    setAccessLevel(new Set([]))
  }

  useEffect(() => {
    if (userToEdit) {
      setAccessLevel(new Set([userToEdit.nivel_acceso]))
    } else {
      setPerson(null)
      setAccessLevel(new Set([]))
      setIsSelected(false)
      toggleVisible({ new: false, repeat: false })
    }
  }, [userToEdit])

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='lg'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleAddOrEditPerson(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader>
              <h2 className='text-xl'>
                {!userToEdit ? 'Nuevo Registro' : 'Editar Registro'}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-y-4'>
                {!userToEdit && (
                  <Input
                    isDisabled={Boolean(userToEdit)}
                    label='Número de documento'
                    placeholder='Enter para buscar'
                    endContent={<Search />}
                    onKeyDown={handleSearchPerson}
                    isRequired
                  />
                )}
                <Input
                  isReadOnly
                  label='Nombre y apellidos'
                  value={personName}
                  isRequired
                />
                <Divider className='my-2' />
                <Select
                  label='Roles'
                  items={rolesOptions}
                  placeholder='Seleccione el rol del usuario'
                  selectedKeys={accessLevel}
                  onSelectionChange={setAccessLevel}
                  isRequired
                >
                  {(rol) => (
                    <SelectItem key={rol.value} value={rol.value}>
                      {rol.label}
                    </SelectItem>
                  )}
                </Select>
                <Input
                  label='Nombre de usuario'
                  defaultValue={userToEdit ? userToEdit.nombre_usuario : ''}
                  name='nombreUsuario'
                  maxLength={50}
                  isRequired
                />
                {userToEdit && (
                  <Switch
                    isSelected={isSelected}
                    onValueChange={setIsSelected}
                    name='cambiarClaveAcceso'
                    size='sm'
                  >
                    Cambiar contraseña
                  </Switch>
                )}
                <Input
                  label='Contraseña'
                  name='claveAcceso'
                  type={visible.new ? 'text' : 'password'}
                  maxLength={50}
                  isDisabled={userToEdit && !isSelected}
                  endContent={
                    <button
                      className='focus:outline-none'
                      type='button'
                      onClick={() =>
                        toggleVisible((prev) => {
                          return { ...prev, new: !visible.new }
                        })
                      }
                    >
                      {visible.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                  isRequired
                />
                <Input
                  label='Repetir contraseña'
                  name='claveAccesoRepetida'
                  type={visible.repeat ? 'text' : 'password'}
                  maxLength={50}
                  isDisabled={userToEdit && !isSelected}
                  endContent={
                    <button
                      className='focus:outline-none'
                      type='button'
                      onClick={() =>
                        toggleVisible((prev) => {
                          return { ...prev, repeat: !visible.repeat }
                        })
                      }
                    >
                      {visible.repeat ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  }
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color='danger'
                type='button'
                variant='light'
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button color='primary' type='submit' isLoading={loading}>
                Guardar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
