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
import { createService, updateService } from '../../../services/service'
import { useFetcher } from '../../../hook/useFetcher'
import { getAllCategories } from '../../../services/category'
import { getAllRequirement } from '../../../services/requirement'
import { getAllAreas } from '../../../services/area'

export default function ModalFormService({
  isOpen,
  onOpenChange,
  serviceToEdit,
  refresh
}) {
  const [loading, setLoading] = useState(false)
  const { data: areasData } = useFetcher(getAllAreas)
  const { data: categoriesData } = useFetcher(getAllCategories)
  const { data: requirementsData } = useFetcher(getAllRequirement)
  const [selectedArea, setSelectedArea] = useState(new Set([]))
  const [selectedCategory, setSelectedCategory] = useState(new Set([]))
  const [selectedRequirement, setSelectedRequirement] = useState(new Set([]))
  const [selected, setSelected] = useState([])

  const filterCategoriesByArea = useMemo(() => {
    const filtered = categoriesData.filter((category) => {
      return category.idarea === parseInt(Array.from(selectedArea)[0])
    })
    return filtered
  }, [selectedArea, categoriesData])

  const handleSubmitService = async (e, onClose) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.target)
      const dataToSend = Object.fromEntries(formData)

      dataToSend.idcategoria = parseInt(dataToSend.idcategoria)
      dataToSend.precio = parseFloat(dataToSend.precio)
      dataToSend.idRequisito =
        selectedRequirement.size !== 0 ? parseInt(dataToSend.idRequisito) : 0
      dataToSend.ordenMedica = !!dataToSend.ordenMedica || false
      dataToSend.triaje = !!dataToSend.triaje || false

      const result = !serviceToEdit
        ? await createService(dataToSend)
        : await updateService(serviceToEdit.idservicio, dataToSend)

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
    setSelectedArea(new Set([]))
    setSelectedCategory(new Set([]))
    setSelectedRequirement(new Set([]))
    setSelected([])
  }

  useEffect(() => {
    if (serviceToEdit) {
      setSelectedArea(new Set([String(serviceToEdit.idarea)]))
      setSelectedCategory(new Set([String(serviceToEdit.idcategoria)]))
      setSelectedRequirement(
        new Set(
          serviceToEdit.idrequisito ? [String(serviceToEdit.idrequisito)] : []
        )
      )
      setSelected([
        serviceToEdit.ordenmedica && 'ordenmedica',
        serviceToEdit.triaje && 'triaje'
      ])
    } else {
      setSelectedArea(new Set([]))
      setSelectedCategory(new Set([]))
      setSelectedRequirement(new Set([]))
      setSelected([])
    }
  }, [serviceToEdit])

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='xl'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => handleSubmitService(e, onClose)}
            autoComplete='off'
          >
            <ModalHeader>
              <h2 className='text-xl'>
                {!serviceToEdit ? 'Nuevo Registro' : 'Editar Registro'}
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
                  {areasData
                    .filter((area) => area.idarea !== 4)
                    .map((area) => (
                      <SelectItem key={area.idarea}>
                        {area.nombre_area}
                      </SelectItem>
                    ))}
                </Select>
                <Select
                  label='Categoría'
                  name='idcategoria'
                  selectedKeys={selectedCategory}
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
                  defaultValue={serviceToEdit ? serviceToEdit.servicio : ''}
                  isRequired
                />
              </div>
              <div className='flex flex-row gap-x-4 mb-2'>
                <Textarea
                  label='Observación'
                  name='observacion'
                  maxRows={3}
                  defaultValue={serviceToEdit ? serviceToEdit.observacion : ''}
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
                  defaultValue={serviceToEdit ? serviceToEdit.precio : ''}
                  isRequired
                />
                <Select
                  label='Requisito'
                  name='idRequisito'
                  selectedKeys={selectedRequirement}
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
                  <Checkbox name='ordenMedica' value='ordenmedica'>
                    Orden médica
                  </Checkbox>
                  <Checkbox name='triaje' value='triaje'>
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
