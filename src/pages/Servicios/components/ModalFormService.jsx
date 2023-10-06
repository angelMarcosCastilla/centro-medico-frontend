import { useEffect, useMemo, useState } from 'react'
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
import { getAllCategories } from '../../../services/category'
import { getAllRequirement } from '../../../services/requirement'
import { getAllAreas } from '../../../services/area'

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
  serviceToEdit,
  refreshTable
}) {
  const [loading, setLoading] = useState(false)
  const { data: areasData } = useFetcher(getAllAreas)
  const { data: categoriesData } = useFetcher(getAllCategories)
  const { data: requirementsData } = useFetcher(getAllRequirement)
  const [form, setForm] = useState({})
  const [selectedArea, setSelectedArea] = useState(new Set([]))
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
      [e.target.name]: parseInt(e.target.value || 0)
    })
  }

  const handleCheckBoxChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.checked
    })
  }

  const filterCategoriesByArea = useMemo(() => {
    const filtered = categoriesData.filter((category) => {
      return category.idarea === parseInt(Array.from(selectedArea)[0])
    })
    return filtered
  }, [selectedArea, categoriesData])

  const handleSubmitService = async (e, onClose) => {
    e.preventDefault()

    try {
      setLoading(true)

      let result
      if (operation === 'new') {
        result = await createService(form)
      } else {
        result = await updateService(serviceToEdit, form)
      }
      setLoading(false)

      if (result.isSuccess) {
        toast.success(result.message)
        refreshTable()
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
      setSelectedArea(new Set([]))
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
          idCategoria: res.idcategoria,
          nombreServicio: res.nombre_servicio,
          observacion: res.observacion || '',
          precio: parseFloat(res.precio),
          idRequisito: res.idrequisito || 0,
          ordenMedica: Boolean(res.orden_medica),
          triaje: Boolean(res.triaje)
        })

        setSelectedArea(new Set([res.idarea.toString()]))
        setSelectedCategory(new Set([res.idcategoria.toString()]))

        if (res.idrequisito !== null) {
          setSelectedRequirement(new Set([res.idrequisito.toString()]))
        } else {
          setSelectedRequirement(new Set([]))
        }

        setSelected([
          res.orden_medica === 1 ? 'ordenmedica' : '',
          res.triaje === 1 ? 'triaje' : ''
        ])
      })
    } else {
      setForm(INITIAL_FORM)
      setSelectedArea(new Set([]))
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
                  label='Área'
                  selectedKeys={selectedArea}
                  onSelectionChange={(e) => {
                    setSelectedArea(e)
                    setSelectedCategory(new Set([]))
                  }}
                  isRequired
                >
                  {areasData.map((area) => (
                    <SelectItem key={area.idarea}>
                      {area.nombre_area}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label='Categoría'
                  name='idCategoria'
                  selectedKeys={selectedCategory}
                  onChange={handleSelectChange}
                  onSelectionChange={setSelectedCategory}
                  isRequired
                >
                  {filterCategoriesByArea.map((category) => (
                    <SelectItem
                      key={category.idcategoria}
                      value={category.idcategoria}
                    >
                      {category.nombre_categoria}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className='flex flex-flow gap-x-4 mb-2'>
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
                  value={form.observacion}
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
                  value={!isNaN(form.precio) ? form.precio : ''}
                  onChange={(e) => handleInputChange(e, 'number')}
                  isRequired
                />
                <Select
                  label='Requisito'
                  name='idRequisito'
                  selectedKeys={selectedRequirement}
                  onChange={handleSelectChange}
                  onSelectionChange={setSelectedRequirement}
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
