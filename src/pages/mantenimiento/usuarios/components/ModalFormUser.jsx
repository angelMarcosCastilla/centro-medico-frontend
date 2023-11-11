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
  SelectItem
} from '@nextui-org/react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import {
  SearchPersonNotUser,
  createUser,
  editUser
} from '../../../../services/user'
import { rolesOptions } from '../../../../constants/auth.constant'

export default function ModalFormUser({
  isOpen,
  onOpenChange,
  dataToEdit,
  refresh
}) {
  const [loading, setLoading] = useState(false)
  const [person, setPerson] = useState(null)

  const [data, setData] = useState({
    nombre_usuario: dataToEdit?.nombre_usuario ?? '',
    password: '',
    nivel_acceso: dataToEdit?.nivel_acceso
      ? new Set([dataToEdit?.nivel_acceso])
      : ''
  })

  const handleSearchPerson = async (e) => {
    if (e.key !== 'Enter') return

    const docNumber = e.target.value
    if (!docNumber || docNumber.length < 8) return

    const result = await SearchPersonNotUser(docNumber)
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

  const handleAddOrEditPerson = async (e, onClose) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!dataToEdit) {
        // validar los campos
        if (Object.values(data).some((el) => el === '') || !person) {
          toast.error('Falta llenar campos')
          return
        }
        const dataTosend = {
          idPersona: person.idpersona,
          nombreUsuario: data.nombre_usuario,
          claveAcceso: data.password,
          nivelAcceso: Array.from(data.nivel_acceso)[0]
        }

        const result = await createUser(dataTosend)
        if (!result.data) {
          toast.success('Se registró correctamente')
          refresh()
          onClose()
        }
      } else {
        if (Object.values(data).some((el) => el === '')) {
          toast.error('Falta llenar campos')
          return
        }
        const dataTosend = {
          nombreUsuario: data.nombre_usuario,
          claveAcceso: data.password,
          nivelAcceso: Array.from(data.nivel_acceso)[0]
        }
        const result = await editUser(dataToEdit.idusuario, dataTosend)
        if (!result.data) {
          toast.success('Se editó correctamente')
          refresh()
          onClose()
        }
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setLoading(false)
    }
  }

  const personName = dataToEdit
    ? `${dataToEdit?.nombres} ${dataToEdit?.apellidos}`
    : person?.nombres
    ? `${person?.nombres} ${person?.apellidos}`
    : ''

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <form autoComplete='off'>
            <ModalHeader>
              <h2 className='text-xl'>
                {!dataToEdit ? 'Nuevo Registro' : 'Editar Registro'}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-y-4'>
                <Input
                  isDisabled={Boolean(dataToEdit)}
                  label='Número de documento'
                  placeholder='Enter para buscar'
                  endContent={<Search />}
                  onKeyDown={handleSearchPerson}
                  isRequired
                />
                <Input
                  isReadOnly
                  label='Nombre y apellidos'
                  value={personName}
                  name='Nombre y apellidos'
                  isRequired
                />
                <Divider className='my-2' />
                <Select
                  label='Roles'
                  items={rolesOptions}
                  placeholder='Seleccione el rol del usuario'
                  selectedKeys={data.nivel_acceso}
                  onSelectionChange={(e) =>
                    setData({ ...data, nivel_acceso: e })
                  }
                  isRequired
                >
                  {(rol) => (
                    <SelectItem key={rol.value} value={rol.value}>
                      {rol.label}
                    </SelectItem>
                  )}
                </Select>
                <Input
                  className='mb-2'
                  label='Nombre Usuario'
                  value={data.nombre_usuario}
                  onChange={(e) =>
                    setData({ ...data, nombre_usuario: e.target.value })
                  }
                  name='Nombre Usuario'
                  isRequired
                />
                <Input
                  className='mb-2'
                  label='Password'
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  name='Password'
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

              <Button
                onClick={(e) => handleAddOrEditPerson(e, onClose)}
                color='primary'
                type='button'
                isLoading={loading}
              >
                Guardar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
