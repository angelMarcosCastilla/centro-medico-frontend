import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ModalNewTemplate({ isOpen, onOpenChange, services }) {
  const navigate = useNavigate()
  const [selectedService, setSelectedService] = useState(new Set([]))

  const items = useMemo(() => {
    return [...services].sort((a, b) => a.servicio.localeCompare(b.servicio))
  }, [services])

  const handleNavigate = () => {
    const service = services.find(
      (el) => el.idservicio.toString() === selectedService.currentKey
    )

    navigate(`/plantillas/${service.idservicio}`, {
      state: {
        service,
        operation: 'new'
      }
    })
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='sm'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className='text-xl'>Nueva plantilla</h2>
            </ModalHeader>
            <ModalBody>
              <Select
                items={items}
                label='Plantilla para'
                placeholder='Selecciona el servicio'
                className='w-full'
                selectedKeys={selectedService}
                onSelectionChange={setSelectedService}
              >
                {(item) => (
                  <SelectItem key={item.idservicio} value={item.idservicio}>
                    {item.servicio}
                  </SelectItem>
                )}
              </Select>
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
              <Button
                isDisabled={selectedService.size === 0}
                color='primary'
                type='submit'
                onPress={handleNavigate}
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
