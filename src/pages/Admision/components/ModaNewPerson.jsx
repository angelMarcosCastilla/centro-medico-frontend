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
import { toast } from 'sonner'
import { addPersonService, searchPersonById } from '../../../services/person'
import { useState } from 'react'
import { useDataContext } from './DataContext'

export default function ModalNewPerson({
  isOpen,
  onOpenChange,
  isPatient = false
}) {
  const [loading, setLoading] = useState(false)
  const { setDataPaciente, setDataCliente, dataToSend, setDataToSend } =
    useDataContext()

  const currentDate = new Date()
    .toLocaleDateString('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    .split('/')
    .reverse()
    .join('-')

  const handleAddPerson = async (e, onClose) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.target)
      setLoading(true)

      const result = await addPersonService(Object.fromEntries(formData))

      setLoading(false)

      if (!result.isSuccess) {
        toast.error('Error al al momento de registrar')
      } else {
        const dataPersona = await searchPersonById(result.data)

        const {
          idpersona,
          apellidos,
          nombres,
          fecha_nacimiento: fechaNacimiento,
          direccion
        } = dataPersona.data

        if (isPatient) {
          setDataPaciente({
            nombres: apellidos + ' ' + nombres,
            fechaNacimiento: new Date(fechaNacimiento).toLocaleDateString(
              'es',
              {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }
            ),
            direccion
          })
          setDataToSend({ ...dataToSend, idpaciente: idpersona })
        } else {
          setDataCliente({
            nombres: apellidos + ' ' + nombres,
            direccion
          })
          setDataToSend({ ...dataToSend, idcliente: [idpersona, 0] })
        }

        toast.success(result.message)
        onClose()
      }
    } catch (error) {
      setLoading(false)
      toast.error('Error al al momento de registrar')
    }
  }
  
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => handleAddPerson(e, onClose)}
              autoComplete='off'
            >
              <ModalHeader className='flex flex-col gap-1'>
                <h2 className='text-xl'>
                  Registro de {isPatient ? 'paciente' : 'cliente'}
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className='flex flex-row gap-x-4'>
                  <Select
                    size='lg'
                    label='Tipo documento'
                    defaultSelectedKeys={['D']}
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
                    size='lg'
                    name='numDocumento'
                    maxLength={20}
                    isRequired
                  />
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input
                    className='mb-2'
                    label='Nombres'
                    size='lg'
                    name='nombres'
                    maxLength={50}
                    isRequired
                  />
                  <Input
                    className='mb-2'
                    label='Apellidos'
                    size='lg'
                    name='apellidos'
                    maxLength={50}
                    isRequired
                  />
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input
                    name='fechaNacimiento'
                    type='date'
                    max={currentDate}
                    className='mb-2'
                    label='Fecha nacimiento'
                    placeholder='fecha nacimiento'
                    size='lg'
                    isRequired
                  />
                  <Input
                    className='mb-2'
                    label='Dirección'
                    size='lg'
                    name='direccion'
                  />
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input
                    className='mb-2'
                    label='Correo'
                    size='lg'
                    name='correo'
                  />
                  <Input
                    name='celular'
                    className='mb-2'
                    label='Celular'
                    size='lg'
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  type='button'
                  variant='light'
                  size='lg'
                  onPress={onClose}
                >
                  Cerrar
                </Button>
                <Button
                  color='primary'
                  type='submit'
                  size='lg'
                  isLoading={loading}
                >
                  Registrar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
