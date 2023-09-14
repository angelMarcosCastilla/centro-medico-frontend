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
import React, { useMemo, useState } from 'react'

export function ModalServicios({ isOpen, onOpenChange, data, onChange }) {
  const [area, setArea] = useState('')
  const [categoria, setCategoria] = useState('')
  const [servicio, setServicio] = useState('')

  const optionsCategoria = useMemo(() => {
    if (area === '') return []
    const options = data.find(
      (item) => item.idarea === Number(Array.from(area))
    ).categorias
    return options
  }, [area])

  const optionSercicios = useMemo(() => {
    if (categoria === '') return []
    const options = optionsCategoria.find(
      (item) => item.idcategoria === Number(Array.from(categoria))
    ).servicios
    return options
  }, [categoria])

  const currentServicio = useMemo(() => {
    if (servicio === '') return null
    return optionSercicios.find((item) => item.idservicio === Number(servicio))
  }, [servicio])

  const handleAddServices = () => {
    setArea('')
    setCategoria('')
    setServicio('')
    onChange(currentServicio)
    onOpenChange(false)
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Servicio
              </ModalHeader>
              <ModalBody>
                {currentServicio && (
                  <div className='border mb-3 text-sm flex flex-col text-blue-900 border-blue-500 bg-blue-50 rounded px-4 py-2'>
                    <span>Precio: {currentServicio.precio}</span>
                    <span>
                      Orden Medica: {currentServicio.orden_medica ? '✅' : '❌'}
                    </span>
                  </div>
                )}
                <div className='flex flex-col gap-y-4'>
                  <Select
                    label='Area'
                    size='lg'
                    value={area}
                    onChange={(e) => {
                      setCategoria('')
                      setServicio('')
                      setArea(e.target.value)
                    }}
                  >
                    {data.map((area) => (
                      <SelectItem key={area.idarea} selectedKeys={area.idarea}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label='Categoria'
                    size='lg'
                    value={categoria}
                    onChange={(e) => {
                      setServicio('')
                      setCategoria(e.target.value)
                    }}
                  >
                    {optionsCategoria.map((categoria) => (
                      <SelectItem
                        key={categoria.idcategoria}
                        value={categoria.idcategoria}
                      >
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    key={categoria}
                    label='Servicios'
                    size='lg'
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                  >
                    {optionSercicios.map((servicio) => (
                      <SelectItem
                        key={servicio.idservicio}
                        value={servicio.idservicio}
                      >
                        {servicio.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={handleAddServices}>
                  Registrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
