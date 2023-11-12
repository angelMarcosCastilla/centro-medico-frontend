import { useState } from 'react'
import { createCompany, updateCompany } from '../../../../services/company'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch
} from '@nextui-org/react'
import { toast } from 'sonner'

export default function ModalFormCompany({
  isOpen,
  onOpenChange,
  companyToEdit,
  refresh
}) {
  const [loading, setLoading] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleAddOrEditCompany = async (e, onClose) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSelected) {
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
      }

      const formData = new FormData(e.target)
      const dataToSend = Object.fromEntries(formData)
      if (isSelected) dataToSend.convenio = isSelected

      const result = !companyToEdit
        ? await createCompany(dataToSend)
        : await updateCompany(companyToEdit.idempresa, dataToSend)

      if (result.isSuccess) {
        toast.success(result.message)
        onClose()
        refresh()
      }
    } catch (err) {
      toast.error('Ocurrió un problema al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (e) => {
    onOpenChange(e)
    setIsSelected(false)
    setStartDate('')
    setEndDate('')
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='xl'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleAddOrEditCompany(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader>
              <h2 className='text-xl'>
                {!companyToEdit ? 'Nuevo Registro' : 'Editar Registro'}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-y-4'>
                <Input
                  className='mb-2'
                  label='RUC'
                  maxLength={11}
                  defaultValue={companyToEdit ? companyToEdit.ruc : ''}
                  name='ruc'
                  isRequired
                />
                <Input
                  className='mb-2'
                  label='Razon Social'
                  maxLength={50}
                  defaultValue={companyToEdit ? companyToEdit.razon_social : ''}
                  name='razonSocial'
                  isRequired
                />
                <Input
                  className='mb-2'
                  label='Dirección'
                  maxLength={150}
                  defaultValue={companyToEdit ? companyToEdit.direccion : ''}
                  isRequired
                  name='direccion'
                />
                {!companyToEdit && (
                  <Switch
                    isSelected={isSelected}
                    onValueChange={setIsSelected}
                    name='convenio'
                    size='sm'
                  >
                    Habilitar convenio
                  </Switch>
                )}
                {!companyToEdit && (
                  <div className='flex flex-row gap-x-4'>
                    <Input
                      name='fechaInicio'
                      type='date'
                      label='Fecha Inicio'
                      placeholder='Fecha Inicio'
                      isDisabled={!isSelected}
                      value={startDate}
                      onValueChange={setStartDate}
                      isRequired
                    />
                    <Input
                      name='fechaFin'
                      type='date'
                      label='Fecha Fin'
                      placeholder='Fecha Fin'
                      isDisabled={!isSelected}
                      value={endDate}
                      onValueChange={setEndDate}
                      isRequired
                    />
                  </div>
                )}
              </div>
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
