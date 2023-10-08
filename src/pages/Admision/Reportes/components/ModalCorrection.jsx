import { useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@nextui-org/react'
import { changeStatus } from '../../../../services/admission'

export default function ModalCorrection({
  isOpen,
  onOpenChange,
  idDetAttention,
  refreshTable
}) {
  const [correction, setCorrection] = useState('')

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleSaveCorrection = async (onClose) => {
    const result = await changeStatus(idDetAttention, 'PC')

    if (result) {
      refreshTable()
      onClose()
    }
  }

  return (
    <Modal size='lg' isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Corrección del informe
            </ModalHeader>
            <ModalBody>
              <Textarea
                maxRows={5}
                label='Motivo'
                labelPlacement='outside'
                placeholder='Escribe el motivo de la correción'
                value={correction}
                onValueChange={setCorrection}
              />
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color='primary'
                onPress={() => handleSaveCorrection(onClose)}
                isDisabled={correction === ''}
              >
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
