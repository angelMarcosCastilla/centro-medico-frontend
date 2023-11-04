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
import { changeStatus } from '../../../services/admission'
import { updateResultForCorrection } from '../../../services/result'

export default function ModalCorrection({
  isOpen,
  onOpenChange,
  idDetAttention,
  refreshTable
}) {
  const [correction, setCorrection] = useState('')

  const handleClose = () => {
    setCorrection('')
    onOpenChange(false)
  }

  const handleSaveCorrection = async (onClose) => {
    const [statusChangeRes, updateResultRes] = await Promise.all([
      changeStatus(idDetAttention, 'PC'),
      updateResultForCorrection({
        idDetAtencion: idDetAttention,
        observacion: correction
      })
    ])

    if (statusChangeRes && updateResultRes) {
      refreshTable()
      onClose()
    }
  }

  return (
    <Modal size='md' isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Corrección del informe
            </ModalHeader>
            <ModalBody>
              <Textarea
                minRows={5}
                maxRows={5}
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
