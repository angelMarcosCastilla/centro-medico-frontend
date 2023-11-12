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
import { toast } from 'sonner'

export default function ModalCorrection({
  isOpen,
  onOpenChange,
  idDetAttention,
  refreshTable
}) {
  const [correction, setCorrection] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleClose = () => {
    setCorrection('')
    onOpenChange(false)
  }

  const handleSaveCorrection = async (onClose) => {
    try {
      setIsSaving(true)

      const [statusChangeRes, updateResultRes] = await Promise.all([
        changeStatus(idDetAttention, 'PC'),
        updateResultForCorrection({
          idDetAtencion: idDetAttention,
          observacion: correction
        })
      ])

      if (statusChangeRes && updateResultRes) {
        toast.success('Solicitud enviada con éxito')
        refreshTable()
        onClose()
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal size='md' isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Corrección del informe</ModalHeader>
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
                isLoading={isSaving}
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
