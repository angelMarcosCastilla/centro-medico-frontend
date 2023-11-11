import { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { addArea, getArea, updateArea } from '../../../../services/area'
import { toast } from 'sonner'

const INITIAL_FORM = {
  idarea: 0,
  nombreArea: ''
}

export default function ModalCategorie({
  isOpen,
  onOpenChange,
  operation,
  areaToEdit,
  refreshTable
}) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({})

  const handleInputChange = (e, type = 'text') => {
    setForm({
      ...form,
      [e.target.name]:
        type === 'text' ? e.target.value : parseFloat(e.target.value)
    })
  }

  const handleSubmitArea = async (e, onClose) => {
    e.preventDefault()

    try {
      setLoading(true)

      let result
      if (operation === 'new') {
        result = await addArea(form)
      } else {
        result = await updateArea(areaToEdit, form)
      }

      if (result.isSuccess) {
        toast.success(result.message)
        refreshTable()
        onClose()
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Problemas al registrar')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (operation === 'new') {
      setForm(INITIAL_FORM)
    }
    onOpenChange(false)
  }

  useEffect(() => {
    if (operation === 'edit' && areaToEdit) {
      getArea(areaToEdit).then((res) => {
        setForm({
          idArea: res.idarea,
          nombreArea: res.nombre_area
        })
      })
    } else {
      setForm(INITIAL_FORM)
    }
  }, [operation, areaToEdit])

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size='xl'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleSubmitArea(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader>
              <h2 className='text-xl'>
                {operation === 'edit' ? 'Editar Area' : 'Registro de Area'}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-y-4 mb-2'>
                <Input
                  className='mb-2'
                  label='Nombre Area'
                  maxLength={10}
                  value={form.nombreArea}
                  name='nombreArea'
                  onChange={handleInputChange}                  
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
