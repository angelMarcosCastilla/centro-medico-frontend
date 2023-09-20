import { useState } from "react"
import { useDataContext } from "./DataContext"
import { addCompanyService, searchCompanyById } from "../../../services/company"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"

export default function ModalNewCompany({ isOpen, onOpenChange }) {
  const [loading, setLoading] = useState(false)
  const { setDataCliente, dataToSend, setDataToSend } = useDataContext()

  const handleAddCompany = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    setLoading(true)
    const result = await addCompanyService(Object.fromEntries(formData))
    setLoading(false)

    if (!result.isSuccess) {
      alert(result.message)
    } else {
      const dataEmpresa = await searchCompanyById(result.data)

      const {
        idempresa,
        razon_social: razonSocial,
        direccion
      } = dataEmpresa.data

      setDataCliente({
        nombres: razonSocial,
        direccion
      })
      setDataToSend({ ...dataToSend, idcliente: [0, idempresa] })

      alert(result.message)
    }
  }
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <form onSubmit={handleAddCompany} autoComplete='off'>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  <h2 className='text-xl'>Registro de empresa</h2>
                </ModalHeader>
                <ModalBody>
                  <div className='flex flex-col gap-y-4'>
                    <Input
                      className='mb-2'
                      label='RUC'
                      size='lg'
                      maxLength={11}
                      isRequired
                      name='ruc'
                    />
                    <Input
                      className='mb-2'
                      label='Razon Social'
                      size='lg'
                      maxLength={50}
                      isRequired
                      name='razonSocial'
                    />

                    <Input
                      className='mb-2'
                      label='Dirección'
                      size='lg'
                      maxLength={150}
                      isRequired
                      name='direccion'
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color='danger'
                    type='button'
                    variant='light'
                    size='lg'
                    onPress={onClose}
                  >
                    Cerrar
                  </Button>
                  <Button
                    color='primary'
                    type='submit'
                    size='lg'
                    isLoading={loading}
                    onPress={onClose}
                  >
                    Registrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}