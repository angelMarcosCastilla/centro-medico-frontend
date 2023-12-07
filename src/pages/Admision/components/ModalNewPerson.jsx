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
import { createPerson, searchPersonById } from '../../../services/person'
import { useState } from 'react'
import { useDataContext } from './DataContext'
import { isPersonAdult } from '../../../utils/date'

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
    setLoading(true)

    try {
      const formData = new FormData(e.target)

      if (!isPersonAdult(formData.get('fechaNacimiento'))) {
        return toast.error('El cliente debe ser mayor de edad')
      }

      const result = await createPerson(Object.fromEntries(formData))

      if (!result.isSuccess) {
        toast.error('Error al momento de registrar')
      } else {
        const dataPersona = await searchPersonById(result.data)

        const {
          idpersona,
          apellidos,
          nombres,
          num_documento: numeroDocumento,
          fecha_nacimiento: fechaNacimiento,
          direccion
        } = dataPersona.data

        if (isPatient) {
          setDataPaciente({
            nombres: apellidos + ' ' + nombres,
            numeroDocumento,
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
    } catch (err) {
      toast.error('Error al momento de registrar')
    } finally {
      setLoading(false)
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
                    label='Tipo documento'
                    defaultSelectedKeys={['D']}
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
                    maxLength={20}
                    isRequired
                  />
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input
                    className='mb-2'
                    label='Nombres'
                    name='nombres'
                    maxLength={50}
                    isRequired
                  />
                  <Input
                    className='mb-2'
                    label='Apellidos'
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
                    isRequired
                  />
                  <Select label='Género' name='genero' isRequired>
                    <SelectItem value='M' key='M'>
                      Masculino
                    </SelectItem>
                    <SelectItem value='F' key='F'>
                      Femenino
                    </SelectItem>
                    <SelectItem value='I' key='I'>
                      39 tipos de gays
                    </SelectItem>
                  </Select>
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input
                    className='mb-2'
                    label='Dirección'
                    name='direccion'
                    maxLength={150}
                  />
                </div>
                <div className='flex flex-row gap-x-4'>
                  <Input
                    className='mb-2'
                    label='Correo'
                    name='correo'
                    maxLength={40}
                  />
                  <Input
                    name='celular'
                    className='mb-2'
                    label='Celular'
                    maxLength={9}
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
    </>
  )
}
