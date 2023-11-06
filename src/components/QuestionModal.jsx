import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { useState } from 'react'
import { toast } from 'sonner'

export function QuestionModal({
  title = 'Centro Médico Melchorita',
  textContent = '¿Seguro de proceder?',
  isOpen,
  onOpenChange,
  onCancel,
  confirmConfig = { text: 'Aceptar', color: 'primary' }
}) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async (onClose) => {
    setLoading(true)
    try {
      await confirmConfig.action()
      onClose()
    } catch (err) {
      toast.error('Ocurrió un problema, intente más tarde')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='sm'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <span>{textContent}</span>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='light'
                onPress={() => {
                  onCancel && onCancel()
                  onClose()
                }}
              >
                Cancelar
              </Button>
              <Button
                isLoading={loading}
                color={confirmConfig.color}
                onPress={() => handleConfirm(onClose)}
                className='text-white'
              >
                {confirmConfig.text}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
