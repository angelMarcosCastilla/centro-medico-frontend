import { useEffect, useState } from 'react'
// import { useDataContext } from '../../Admision/components/DataContext'
import {
  addCompanyService,
  getCompany,
  updateCompany
} from '../../../services/company'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { toast } from 'sonner'

const INITIAL_FORM = {
  idEmpresa: 0,
  razonSocial: '',
  ruc: '',
  direccion: '',  
  registrarConvenio: false
}

export default function ModalNewCompany({
  isOpen,
  onOpenChange,
  operation,
  serviceToEdit,
  refreshTable
}) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({})
  const [selected, setSelected] = useState([])
  // const { dataToSend, setDataToSend } = useDataContext()

  const handleInputChange = (e, type = 'text') => {
    setForm({
      ...form,
      [e.target.name]:
        type === 'text' ? e.target.value : parseFloat(e.target.value)
    })
  }

  const handleCheckBoxChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked })
  }

  const handleSubmitCompany = async (e, onClose) => {

    e.preventDefault()

    try {

      setLoading(true)

      let result
      if (operation === 'new') {
        result = await addCompanyService(form)
      }else{
        result = await updateCompany(serviceToEdit,form)
      }
      setLoading(false)
      if(result.isSuccess){
        toast.success(result.message)
        refreshTable()
        onClose()
      }else{
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Problemas al guardar')
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (operation === 'new') {
      setForm(INITIAL_FORM)    
      setSelected([])
    }
    onOpenChange(false)
  }

  useEffect(()=>{
    if (operation === 'edit' && serviceToEdit){
      getCompany(serviceToEdit).then((res)=>{
        setForm({
          idEmpresa: res.idempresa,
          razonSocial: res.razon_social,
          ruc: res.ruc,
          direccion: res.direccion,
          registrarConvenio: Boolean(res.convenio)
        })

        setSelected([
          res.convenio === 1 ? 'Convenio' : '',
        ])
      })
    }else{
      setForm(INITIAL_FORM)
      setSelected([])
    }
  },[operation, serviceToEdit])

  /* const handleAddCompany = async (e, onclose) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData(e.target)
      const result = await addCompanyService(Object.fromEntries(formData))
      if (!result.isSuccess) {
        toast.error('No se pudo registrar la empresa')
        return
      }
      setDataToSend({ ...dataToSend, idcliente: [0, result.data] })
      onclose()
      setLoading(false)
    } catch (error) {
      toast.error('Error al registrar la empresa')
      setLoading(false)
    }
  } */

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={handleClose} size='xl'>
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => handleSubmitCompany(e, onClose)}
              autoComplete='off'
            >
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  <h2 className='text-xl'>{operation=== 'edit'?'Editar Empresa': 'Registro de Empresa'}</h2>
                </ModalHeader>
                <ModalBody>
                  <div className='flex flex-col gap-y-4'>
                    <Input
                      className='mb-2'
                      label='RUC'
                      maxLength={11}
                      value={form.ruc}
                      isRequired
                      onChange={handleInputChange}
                      name='ruc'
                    />
                    <Input
                      className='mb-2'
                      label='Razon Social'
                      maxLength={50}
                      value={form.razonSocial}
                      isRequired
                      onChange={handleInputChange}
                      name='razonSocial'
                    />

                    <Input
                      className='mb-2'
                      label='Dirección'
                      maxLength={150}
                      value={form.direccion}
                      isRequired
                      onChange={handleInputChange}
                      name='direccion'
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-x-4'>
                    <CheckboxGroup
                      orientation='horizontal'
                      value={selected}
                      onValueChange={setSelected}
                    >
                      <Checkbox
                        name='convenio'
                        value='convenio'
                        onChange={handleCheckBoxChange}
                      >
                        Habilitar Convenio
                      </Checkbox>
                    </CheckboxGroup>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color='danger'
                    type='submit'
                    variant='light'
                    onPress={onClose}
                  >
                    Cerrar
                  </Button>
                  <Button color='primary' type='submit' isLoading={loading}>
                    Registrar
                  </Button>
                </ModalFooter>
              </>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
