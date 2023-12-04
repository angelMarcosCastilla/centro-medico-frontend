import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@nextui-org/react'
import { MinusCircle } from 'lucide-react'
import { useState } from 'react'

export default function AllergiesModal({
  isOpen,
  onOpenChange,
  data,
  newAllergies,
  setNewAllergies
}) {
  const [allergy, setAllergy] = useState('')

  const addAllergy = () => {
    if (allergy.trim() === '') return

    setNewAllergies((prev) => {
      return [
        ...prev,
        {
          iddetcomplicacionmed: crypto.randomUUID(),
          idcomplicacionmed: 3,
          detalles: allergy
        }
      ]
    })
    setAllergy('')
  }

  const removeAllergy = (el) => {
    setNewAllergies((prev) => {
      return prev.filter(
        (det) => det.iddetcomplicacionmed !== el.iddetcomplicacionmed
      )
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => onOpenChange(false)}
      scrollBehavior='inside'
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className='text-xl'>Alergias de la persona</h2>
            </ModalHeader>
            <ModalBody>
              {data.detalleComplicacionMedica
                .filter((el) => el.idcomplicacionmed === 3)
                .map((el, index) => (
                  <li key={index}>{el.detalles}</li>
                ))}

              {newAllergies.map((el, index) => (
                <div className='flex justify-between items-center' key={index}>
                  <li>{el.detalles}</li>
                  <Button
                    tabIndex={-1}
                    isIconOnly
                    size='sm'
                    color='danger'
                    variant='light'
                    onPress={() => removeAllergy(el)}
                  >
                    {<MinusCircle size={20} />}
                  </Button>
                </div>
              ))}

              {(data.detalleComplicacionMedica.length > 0 ||
                newAllergies.length > 0) && <Divider />}

              <Textarea
                label='Nueva alergia'
                placeholder='Describe la alergia'
                minRows={3}
                maxRows={3}
                color='primary'
                variant='bordered'
                value={allergy}
                onValueChange={setAllergy}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    e.preventDefault()
                    addAllergy()
                  }
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type='button'
                color='primary'
                variant='light'
                onPress={onClose}
              >
                Cerrar
              </Button>
              <Button
                isDisabled={allergy.trim() === ''}
                color='primary'
                onPress={addAllergy}
              >
                Agregar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
