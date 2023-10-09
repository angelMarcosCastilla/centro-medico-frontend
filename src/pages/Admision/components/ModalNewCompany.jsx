import { useState } from 'react'
import { useDataContext } from './DataContext'
import { addCompanyService } from '../../../services/company'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { toast } from 'sonner'

export default function ModalNewCompany({ isOpen, onOpenChange }) {
  const [loading, setLoading] = useState(false)
  const { setDataCliente, dataToSend, setDataToSend } = useDataContext()

  const handleAddCompany = async (e, onclose) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData(e.target)
      const result = await addCompanyService(Object.fromEntries(formData))
      if (!result.isSuccess) {
        toast.error('No se pudo registrar la empresa')
        return
      }

      setDataCliente({
        nombres: formData.get('razonSocial'),
        direccion: formData.get('direccion'),
        convenio: 0
      })
      setDataToSend({ ...dataToSend, idcliente: [0, result.data] })
      onclose()
      setLoading(false)
    } catch (error) {
      toast.error('Error al registrar la empresa')
      setLoading(false)
    }
  }
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => handleAddCompany(e, onClose)}
              autoComplete='off'
            >
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  <h2 className='text-xl'>Registro de empresa</h2>
                </ModalHeader>
                <ModalBody>
                  <div className='flex flex-col gap-y-4'>
                    <Input
                      className='mb-2'
                      label='RUC'
                      maxLength={11}
                      isRequired
                      name='ruc'
                    />
                    <Input
                      className='mb-2'
                      label='Razon Social'
                      maxLength={50}
                      isRequired
                      name='razonSocial'
                    />

                    <Input
                      className='mb-2'
                      label='Dirección'
                      maxLength={150}
                      isRequired
                      name='direccion'
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
                  <Button
                    color='primary'
                    type='submit'
                    isLoading={loading}                    
                  >
                    Registrar
                  </Button>
                </ModalFooter>
              </>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
