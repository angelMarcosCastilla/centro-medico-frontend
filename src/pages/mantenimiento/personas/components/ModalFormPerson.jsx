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
import { createPerson, updatePerson } from '../../../../services/person'
import { toast } from 'sonner'

const parseDateToInput = (date) => {
  return date
    .toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    .split('/')
    .reverse()
    .join('-')
}

export default function ModalFormPerson({
  isOpen,
  onOpenChange,
  personToEdit,
  refresh
}) {
  const [loading, setLoading] = useState(false)
  const currentDate = parseDateToInput(new Date())

  const handleAddOrEditPerson = async (e, onClose) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.target)
      const dataToSend = Object.fromEntries(formData)

      const result = !personToEdit
        ? await createPerson(dataToSend)
        : await updatePerson(personToEdit.idpersona, dataToSend)

      if (result.isSuccess) {
        toast.success(result.message)
        onClose()
        refresh()
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleAddOrEditPerson(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader>
              <h2 className='text-xl'>
                {!personToEdit ? 'Nuevo Registro' : 'Editar Registro'}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-row gap-x-4'>
                <Select
                  label='Tipo documento'
                  defaultSelectedKeys={[
                    personToEdit ? personToEdit.tipo_documento : 'D'
                  ]}
                  name='tipoDocumento'
                  isRequired
                >
                  <SelectItem value='D' key={'D'}>
                    DNI
                  </SelectItem>
                  <SelectItem value='C' key={'C'}>
                    Carnet de extranjería
                  </SelectItem>
                </Select>
                <Input
                  className='mb-2'
                  label='Número documento'
                  name='numDocumento'
                  defaultValue={personToEdit ? personToEdit.num_documento : ''}
                  maxLength={20}
                  isRequired
                />
              </div>
              <div className='flex flex-row gap-x-4'>
                <Input
                  className='mb-2'
                  label='Nombres'
                  defaultValue={personToEdit ? personToEdit.nombres : ''}
                  name='nombres'
                  maxLength={50}
                  isRequired
                />
                <Input
                  className='mb-2'
                  label='Apellidos'
                  defaultValue={personToEdit ? personToEdit.apellidos : ''}
                  name='apellidos'
                  maxLength={50}
                  isRequired
                />
              </div>
              <div className='flex flex-row gap-x-4'>
                <Input
                  name='fechaNacimiento'
                  type='date'
                  defaultValue={
                    personToEdit
                      ? parseDateToInput(new Date(personToEdit.fecha_nacimiento))
                      : ''
                  }
                  max={currentDate}
                  className='mb-2'
                  label='Fecha nacimiento'
                  placeholder='fecha nacimiento'
                  isRequired
                />
                <Input
                  className='mb-2'
                  label='Dirección'
                  name='direccion'
                  maxLength={150}
                  defaultValue={personToEdit ? personToEdit.direccion : ''}
                />
              </div>
              <div className='flex flex-row gap-x-4'>
                <Input
                  className='mb-2'
                  label='Correo'
                  name='correo'
                  maxLength={40}
                  defaultValue={personToEdit ? personToEdit.correo : ''}
                />
                <Input
                  name='celular'
                  className='mb-2'
                  label='Celular'
                  maxLength={9}
                  defaultValue={personToEdit ? personToEdit.celular : ''}
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
