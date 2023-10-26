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
import { createRefund } from '../../../services/refund'

export default function ModalFormRefund({
  isOpen,
  onOpenChange,
  paymentData,
  refreshTable
}) {
  const [reason, setReason] = useState('')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [loading, setLoading] = useState(false)

  const handleCreateRefund = async (onClose) => {
    try {
      setLoading(true)

      const refundData = {
        idPago: paymentData.idpago,
        motivoCancelacion: reason,
        montoCancelado: paymentData.monto_total,
        idUsuario: userInfo.idusuario
      }

      const result = await createRefund(refundData)
      setLoading(false)

      if (result.isSuccess) {
        toast.success(result.message)
        onClose()
        refreshTable()
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Problemas al guardar')
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={() => onOpenChange(false)} size='md'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className='text-xl'>Formulario de reembolso</h2>
            </ModalHeader>
            <ModalBody>
              <Textarea
                minRows={5}
                maxRows={5}
                placeholder='Escribe el motivo del reembolso'
                value={reason}
                onValueChange={setReason}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type='button'
                color='danger'
                variant='light'
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                color='primary'
                isLoading={loading}
                isDisabled={reason === ''}
                onPress={() => handleCreateRefund(onClose)}
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
