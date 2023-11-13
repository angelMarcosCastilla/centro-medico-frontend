import { useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem
} from '@nextui-org/react'
import {
  addCategoria,
  getCategoria,
  updateCategoria
} from '../../../../services/category'

import { toast } from 'sonner'
import { getAllAreas } from '../../../../services/area'
import { useFetcher } from '../../../../hook/useFetcher'

const INITIAL_FORM = {
  idCategoria: 0,
  nombreCategoria: '',
  idArea: 0
}
export default function ModalCategoria({
  isOpen,
  onOpenChange,
  operation,
  categoriaToEdit,
  refreshTable
}) {
  const [loading, setLoading] = useState(false)
  const { data: areasData } = useFetcher(getAllAreas)
  const [form, setForm] = useState({})
  const [selectedArea, setSelectedArea] = useState(new Set([]))

  const handleSelectChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: parseInt(e.target.value || 0)
    })
  }

  const handleInputChange = (e, type = 'text') => {
    setForm({
      ...form,
      [e.target.name]: type === 'text' ? e.target.value : parseFloat(e.target.value)
    });
  };
  

  const handleSubmitCategorie = async (e, onClose) => {
    e.preventDefault()

    try {
      setLoading(true)

      let result
      if (operation === 'new') {
        result = await addCategoria(form)
      } else {
        result = await updateCategoria(categoriaToEdit, form)
      }

      if (result.isSuccess) {
        toast.success(result.message)
        refreshTable()
        onClose()
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error('Problemas al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (operation === 'new') {
      setForm(INITIAL_FORM)
      setSelectedArea(new Set([]))
    }
    onOpenChange(false)
  }

  useEffect(() => {
    if (operation === 'edit' && categoriaToEdit) {
      getCategoria(categoriaToEdit).then((res) => {
        setForm({
          idCategoria: res.idcategoria,
          idArea: res.idarea,  // Utiliza la propiedad correcta
          nombreCategoria: res.nombre_categoria
        });
  
        setSelectedArea(new Set([res.idarea.toString()]));
      });
    } else {
      setForm(INITIAL_FORM);
      setSelectedArea(new Set([]));
    }
  }, [operation, categoriaToEdit]);
  

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={handleClose} size='xl'>
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => handleSubmitCategorie(e, onClose)}
              autoComplete='off'
            >
              <ModalHeader className='flex flex-col gap-1'>
                <h2 className='text-xl'>
                  {operation === 'edit'
                    ? 'Editar Categoria'
                    : 'Registro de Categoria'}
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className='flex flex-row gap-x-4 mb-2'>
                  <Select
                    label='Área'
                    name='idArea'
                    selectedKeys={selectedArea}
                    onChange={handleSelectChange}
                    onSelectionChange={(e) => {
                      setSelectedArea(e)
                    }}
                    isRequired
                  >
                    {areasData.map((area) => (
                      <SelectItem key={area.idarea} value={area.idarea}>
                        {area.nombre_area}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className='flex flex-col gap-y-4 mb-2'>
                  <Input
                    className='mb-2'
                    label='Nombre Categoria'                    
                    value={form.nombreCategoria}
                    name='nombreCategoria'
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
    </>
  )
}
