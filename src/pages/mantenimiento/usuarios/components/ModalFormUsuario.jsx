import {
  Button,
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
} from '../../../../services/usuarios'
import { rolesOptions } from '../../../../constants/auth.constant'

export default function ModalFormUsuario({
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
      toast.error('Esta persona ya esta registrado')
      return
    }
    setPerson(result.data)
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
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='text-xl'>
                {!dataToEdit ? 'Nuevo Registro' : 'Editar Registro'}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-y-2'>
                <Input
                  isDisabled={Boolean(dataToEdit)}
                  className='mb-2'
                  label='Num Documento'
                  endContent={<Search />}
                  isRequired
                  onKeyDown={handleSearchPerson}
                />
                <Input
                  isReadOnly
                  className='mb-2'
                  label='Nombre y apellidos'
                  value={personName}
                  name='Nombre y apellidos'
                  isRequired
                />
                <Select
                  items={rolesOptions}
                  label='Seleccione rol'
                  isRequired
                  placeholder='Seleccione rol'
                  selectedKeys={data.nivel_acceso}
                  onSelectionChange={(e) =>
                    setData({ ...data, nivel_acceso: e })
                  }
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
