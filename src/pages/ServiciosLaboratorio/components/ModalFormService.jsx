import { useState } from 'react'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea
} from '@nextui-org/react'
import { DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { createService } from '../../../services/service'
import { useFetcher } from '../../../hook/useFetcher'
import { LABORATORIO_ID } from '../../../constants/areas'
import { listCategoriesByArea } from '../../../services/category'
import { getAllRequirement } from '../../../services/requirement'

const INITIAL_FORM = {
  observacion: '',
  idRequisito: 0,
  ordenMedica: false,
  triaje: false
}

export default function ModalFormService({ isOpen, onOpenChange }) {
  const [loading, setLoading] = useState(false)
  const { data: categoriesData } = useFetcher(() =>
    listCategoriesByArea(LABORATORIO_ID)
  )
  const { data: requirementsData } = useFetcher(getAllRequirement)
  const [form, setForm] = useState(INITIAL_FORM)

  const handleInputChange = (e, type = 'text') => {
    setForm({
      ...form,
      [e.target.name]:
        type === 'text' ? e.target.value : parseFloat(e.target.value)
    })
  }

  const handleSelectChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: parseInt(e.target.value)
    })
  }

  const handleCheckBoxChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.checked
    })
  }

  const handleSubmitService = async (e, onClose) => {
    e.preventDefault()

    try {
      setLoading(true)

      const result = await createService(form)

      if (result.isSuccess) {
        toast.success(result.message)
        onClose()
        setForm(INITIAL_FORM)
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Problemas al guardar')
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleSubmitService(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader>
              <h2 className='text-xl'>Registro de servicio</h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-row gap-x-4 mb-2'>
                <Select
                  label='Categoría'
                  name='idCategoria'
                  onChange={handleSelectChange}
                  isRequired
                >
                  {categoriesData.map((category) => (
                    <SelectItem key={category.idcategoria}>
                      {category.nombre_categoria}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label='Nombre servicio'
                  name='nombreServicio'
                  maxLength={50}
                  onChange={handleInputChange}
                  isRequired
                />
              </div>
              <div className='flex flex-row gap-x-4 mb-2'>
                <Textarea
                  label='Observación'
                  name='observacion'
                  maxRows={3}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex flex-row gap-x-4 mb-2'>
                <Input
                  type='number'
                  label='Precio'
                  placeholder='0.00'
                  name='precio'
                  min={0}
                  max={5000}
                  startContent={
                    <DollarSign className='text-default-400' size={20} />
                  }
                  onChange={(e) => handleInputChange(e, 'number')}
                  isRequired
                />
                <Select
                  label='Requisito'
                  name='idRequisito'
                  onChange={handleSelectChange}
                >
                  {requirementsData.map((requirement) => (
                    <SelectItem key={requirement.idrequisito}>
                      {requirement.descripcion}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className='grid grid-cols-2 gap-x-4'>
                <CheckboxGroup
                  label='Selecciona los requerimientos'
                  orientation='horizontal'
                >
                  <Checkbox
                    name='ordenMedica'
                    value='ordenmedica'
                    onChange={handleCheckBoxChange}
                  >
                    Orden médica
                  </Checkbox>
                  <Checkbox
                    name='triaje'
                    value='triaje'
                    onChange={handleCheckBoxChange}
                  >
                    Triaje
                  </Checkbox>
                </CheckboxGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type='button'
                color='danger'
                variant='light'
                onPress={() => {
                  onClose()
                  setForm(INITIAL_FORM)
                }}
              >
                Cancelar
              </Button>
              <Button type='submit' color='primary' isLoading={loading}>
                Guardar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
