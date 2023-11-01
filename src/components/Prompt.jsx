import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function Prompt({
  title = 'Centro Médico Melchorita',
  placeholder,
  type = 'text',
  isOpen,
  onOpenChange,
  input,
  setInput,
  onConfirm
}) {
  const [visible, setVisible] = useState(false)

  const reset = () => {
    setVisible(false)
    setInput('')
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='sm'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                type={
                  type === 'password' ? (visible ? 'text' : 'password') : type
                }
                placeholder={placeholder}
                color='primary'
                variant='bordered'
                value={input}
                onValueChange={setInput}
                endContent={
                  type === 'password' && (
                    <button
                      className='focus:outline-none'
                      type='button'
                      onClick={() => setVisible(!visible)}
                    >
                      {!visible ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  )
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Cancelar
              </Button>
              <Button
                isDisabled={input.trim() === ''}
                color='primary'
                onPress={() => {
                  onConfirm()
                  onClose()
                  reset()
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
