import { useEffect, useState } from 'react'
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
import {
  createService,
  getService,
  updateService
} from '../../../services/service'
import { useFetcher } from '../../../hook/useFetcher'
import { LABORATORIO_ID } from '../../../constants/areas'
import { listCategoriesByArea } from '../../../services/category'
import { getAllRequirement } from '../../../services/requirement'

const INITIAL_FORM = {
  idCategoria: 0,
  nombreServicio: '',
  observacion: '',
  precio: '',
  idRequisito: 0,
  ordenMedica: false,
  triaje: false
}

export default function ModalFormService({
  isOpen,
  onOpenChange,
  operation,
  serviceToEdit
}) {
  const [loading, setLoading] = useState(false)
  const { data: categoriesData } = useFetcher(() =>
    listCategoriesByArea(LABORATORIO_ID)
  )
  const { data: requirementsData } = useFetcher(getAllRequirement)
  const [form, setForm] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(new Set([]))
  const [selectedRequirement, setSelectedRequirement] = useState(new Set([]))
  const [selected, setSelected] = useState([])

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
      console.log(form)
      setLoading(true)

      let result
      if (operation === 'new') {
        result = await createService(form)
      } else {
        result = await updateService(serviceToEdit, form)
      }

      if (result.isSuccess) {
        toast.success(result.message)
        onClose()
      } else {
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
      setSelectedCategory(new Set([]))
      setSelectedRequirement(new Set([]))
      setSelected([])
    }
    onOpenChange(false)
  }

  useEffect(() => {
    if (operation === 'edit' && serviceToEdit) {
      getService(serviceToEdit).then((res) => {
        setForm({
          idServicio: res.idservicio,
          idCategoria: res.idcategoria,
          nombreServicio: res.nombre_servicio,
          observacion: res.observacion,
          precio: res.precio,
          idRequisito: res.idrequisito,
          ordenMedica: Boolean(res.orden_medica),
          triaje: Boolean(res.triaje)
        })
        setSelectedCategory(new Set([res.idcategoria.toString()]))
        setSelectedRequirement(new Set([res.idrequisito.toString()]))
        setSelected([
          res.orden_medica === 1 ? 'ordenmedica' : '',
          res.triaje === 1 ? 'triaje' : ''
        ])
      })
    } else {
      setForm(INITIAL_FORM)
      setSelectedCategory(new Set([]))
      setSelectedRequirement(new Set([]))
      setSelected([])
    }
  }, [operation, serviceToEdit])

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size='xl'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleSubmitService(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader>
              <h2 className='text-xl'>
                {operation === 'edit'
                  ? 'Editar servicio'
                  : 'Registro de servicio'}
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-row gap-x-4 mb-2'>
                <Select
                  label='Categoría'
                  name='idCategoria'
                  selectedKeys={selectedCategory}
                  onChange={(e) => {
                    handleSelectChange(e)
                    setSelectedCategory(new Set([e.target.value]))
                  }}
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
                  value={form.nombreServicio}
                  onChange={handleInputChange}
                  isRequired
                />
              </div>
              <div className='flex flex-row gap-x-4 mb-2'>
                <Textarea
                  label='Observación'
                  name='observacion'
                  maxRows={3}
                  value={form.observacion || ''}
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
                  value={form.precio}
                  onChange={(e) => handleInputChange(e, 'number')}
                  isRequired
                />
                <Select
                  label='Requisito'
                  name='idRequisito'
                  selectedKeys={selectedRequirement}
                  onChange={(e) => {
                    handleSelectChange(e)
                    setSelectedRequirement(new Set([e.target.value]))
                  }}
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
                  value={selected}
                  onValueChange={setSelected}
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
                onPress={onClose}
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
