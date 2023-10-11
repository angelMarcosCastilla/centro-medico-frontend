import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'

export function QuestionModal({
  title = 'Centro Médico Melchorita',
  textContent = '¿Seguro de proceder?',
  isOpen,
  onOpenChange,
  onConfirm
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xs'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <span>{textContent}</span>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color='primary'
                onPress={() => {
                  onClose()
                  onConfirm()
                }}
              >
                Confirmar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
