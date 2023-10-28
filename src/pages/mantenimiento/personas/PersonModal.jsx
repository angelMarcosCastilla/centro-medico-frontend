import {
  Button,
  Checkbox,
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
import { addPersonService, updatePerson } from '../../../services/person'
import { toast } from 'sonner'

const parseDateToInput = (date) => {
  return date
    .toLocaleDateString('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    .split('/')
    .reverse()
    .join('-')
}

export default function PersonModal({
  isOpen,
  onOpenChange,
  dataToEdit,
  refresh
}) {
  const [loading, setLoading] = useState(false)
  const [isSelected, setIsSelected] = useState(Boolean(dataToEdit?.estado))
  const currentDate = parseDateToInput(new Date())

  const handleAddPerson = async (e, onClose) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.target)
      const dataTosend = Object.fromEntries(formData)

      if (!dataToEdit) {
        await addPersonService(dataTosend)
        await refresh()
        toast.success('Se Registró correctamente')
      } else {
        try {
          await updatePerson(dataToEdit.idpersona, {
            ...dataTosend,
            estado: isSelected
          })
          toast.success('Se Edito correctamente')
          await refresh()
        } catch (error) {
          toast.error('Error al momento de editar')
        }
      }
      onClose()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error al momento de registrar')
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <form
            autoComplete='off'
            onSubmit={(e) => handleAddPerson(e, onClose)}
          >
            <ModalHeader className='flex flex-col gap-1'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl'>
                  <span>{!dataToEdit ? 'Registrar' : 'Editar'} Personas</span>
                </h2>
                {dataToEdit && (
                  <Checkbox
                    onValueChange={setIsSelected}
                    isSelected={isSelected}
                    className='mr-10'
                  >
                    esta activo
                  </Checkbox>
                )}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-row gap-x-4'>
                <Select
                  label='Tipo documento'
                  defaultSelectedKeys={[
                    dataToEdit ? dataToEdit.tipo_documento : 'D'
                  ]}
                  name='tipoDocumento'
                  isRequired
                >
                  <SelectItem value='D' key={'D'}>
                    DNI
                  </SelectItem>
                  <SelectItem value='C' key={'C'}>
                    Carnet de extranjeria
                  </SelectItem>
                </Select>
                <Input
                  className='mb-2'
                  label='Número documento'
                  name='numDocumento'
                  defaultValue={dataToEdit ? dataToEdit.num_documento : ''}
                  maxLength={20}
                  isRequired
                />
              </div>
              <div className='flex flex-row gap-x-4'>
                <Input
                  className='mb-2'
                  label='Nombres'
                  defaultValue={dataToEdit ? dataToEdit.nombres : ''}
                  name='nombres'
                  maxLength={50}
                  isRequired
                />
                <Input
                  className='mb-2'
                  label='Apellidos'
                  defaultValue={dataToEdit ? dataToEdit.apellidos : ''}
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
                    dataToEdit
                      ? parseDateToInput(new Date(dataToEdit.fecha_nacimiento))
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
                  defaultValue={dataToEdit ? dataToEdit.direccion : ''}
                />
              </div>
              <div className='flex flex-row gap-x-4'>
                <Input
                  className='mb-2'
                  label='Correo'
                  name='correo'
                  defaultValue={dataToEdit ? dataToEdit.correo : ''}
                />
                <Input
                  name='celular'
                  className='mb-2'
                  label='Celular'
                  defaultValue={dataToEdit ? dataToEdit.celular : ''}
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
                Cerrar
              </Button>
              <Button color='primary' type='submit' isLoading={loading}>
                Registrar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
