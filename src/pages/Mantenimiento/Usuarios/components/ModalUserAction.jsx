import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@nextui-org/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { createUserHistory } from '../../../../services/userHistory'

export default function ModalUserAction({
  isOpen,
  onOpenChange,
  title,
  operation,
  action,
  refresh
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [reason, setReason] = useState('')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const handleOpenChange = (e) => {
    onOpenChange(e)
    setReason('')
  }

  const handleSaveOperation = async (onClose) => {
    setIsSaving(true)

    try {
      const dataToSend = {
        idAfectado: isOpen,
        operacion: operation === 'disable' ? 'D' : 'A',
        motivo: reason,
        idRealizador: userInfo.idusuario
      }

      const result = await createUserHistory(dataToSend)
      if (result.isSuccess) {
        action()
        refresh()
        onClose()
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal size='md' isOpen={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <Textarea
                minRows={5}
                maxRows={5}
                placeholder='Escribe el motivo de la operación'
                value={reason}
                onValueChange={setReason}
              />
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Cancelar
              </Button>
              <Button
                isLoading={isSaving}
                color={operation === 'disable' ? 'danger' : 'success'}
                className='text-white'
                onPress={() => handleSaveOperation(onClose)}
                isDisabled={reason === ''}
              >
                {operation === 'disable' ? 'Eliminar' : 'Activar'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
