import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { createAgreement } from '../../../../services/agreement'

export default function ModalFormAgreement({
  isOpen,
  onOpenChange,
  companyId,
  mutate
}) {
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleAddAgreement = async (e, onClose) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (startDate === endDate) {
        return toast.error(
          'La fecha de inicio y la fecha de fin son iguales. Deben ser diferentes.'
        )
      }

      if (startDate >= endDate) {
        return toast.error(
          'La fecha de inicio debe ser anterior a la fecha de fin.'
        )
      }

      const formData = new FormData(e.target)
      const dataToSend = Object.fromEntries(formData)

      const result = await createAgreement(companyId, dataToSend)

      if (result.isSuccess) {
        toast.success(result.message)

        mutate((prevCompanies) => {
          const updatedCompanies = prevCompanies.map((company) => {
            if (company.idempresa === companyId) {
              return {
                ...company,
                convenio: 1,
                idconvenio: result.data,
                fecha_inicio: new Date(startDate).toISOString(),
                fecha_fin: new Date(endDate).toISOString()
              }
            }
            return company
          })
          return updatedCompanies
        })

        onClose()
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (e) => {
    onOpenChange(e)
    setStartDate('')
    setEndDate('')
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='sm'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleAddAgreement(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader>
              <h2 className='text-xl'>Nuevo convenio</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                name='fechaInicio'
                type='date'
                label='Fecha Inicio'
                placeholder='Fecha Inicio'
                value={startDate}
                onValueChange={setStartDate}
                isRequired
              />
              <Input
                name='fechaFin'
                type='date'
                label='Fecha Fin'
                placeholder='Fecha Fin'
                value={endDate}
                onValueChange={setEndDate}
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color='danger'
                type='button'
                variant='light'
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button color='primary' type='submit' isLoading={loading}>
                Guardar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
