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

import React, { useEffect, useMemo, useState } from 'react'
import { useDataContext } from './DataContext'
import { toast } from 'sonner'

export function ModalServicios({ isOpen, onOpenChange, data, onChange }) {
  const [area, setArea] = useState(new Set([]))
  const [categoria, setCategoria] = useState(new Set([]))
  const [servicio, setServicio] = useState(new Set([]))
  const [isButtonDisabled, setButtonDisable] = useState(true)

  useEffect(()=>{
    if(area.size >0 && categoria.size >0 && servicio.size >0){
      setButtonDisable(false)
    }else{
      setButtonDisable(true)
    }
  }, [area, categoria, servicio])

  const { dataToSend } = useDataContext()

  const optionsCategoria = useMemo(() => {
    if (area.size === 0) return []
    const options = data.find((item) =>
      area.has(String(item.idarea))
    ).categorias

    return options
  }, [area])

  const optionSercicios = useMemo(() => {
    if (categoria.size === 0) return []
    const options = optionsCategoria.find((item) =>
      categoria.has(String(item.idcategoria))
    ).servicios
    return options
  }, [categoria])

  const currentServicio = useMemo(() => {
    if (servicio.size === 0) return null
    return optionSercicios.find((item) => servicio.has(String(item.idservicio)))
  }, [servicio])

  const handleAddServices = () => {
    // ver que no estea el servicio ya agregado
    const isExist = dataToSend.detalleAtencion?.some(
      (item) => item.idservicio === currentServicio?.idservicio
    )
    if (!isExist) {
      onChange({ ...currentServicio, descuento: ''})
      onOpenChange(false)
      setArea(new Set([]))
      setCategoria(new Set([]))
      setServicio(new Set([]))
    } else {
      toast.error('El servicio ya fue agregado')
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <h2 className='text-xl'>Selección de servicio</h2>
              </ModalHeader>
              <ModalBody>
                <div className='grid grid-cols-7 gap-4'>
                  <div className='grid col-span-5 gap-4'>
                    <Select
                      label='Área'
                      selectedKeys={area}
                      onChange={(e) => {
                        setCategoria(new Set([]))
                        setServicio(new Set([]))
                        if (e.target.value !== '') {
                          setArea(new Set([e.target.value]))
                        } else {
                          setArea(new Set([]))
                        }
                      }}
                    >
                      {data.map((area) => (
                        <SelectItem key={area.idarea} value={area.idarea}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label='Categoría'
                      selectedKeys={categoria}
                      onChange={(e) => {
                        setServicio(new Set([]))
                        if (e.target.value !== '') {
                          setCategoria(new Set([e.target.value]))
                        } else {
                          setCategoria(new Set([]))
                        }
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
                      label='Servicios'
                      selectedKeys={servicio}
                      onChange={(e) => {
                        if (e.target.value !== '') {
                          setServicio(new Set([e.target.value]))
                        } else {
                          setServicio(new Set([]))
                        }
                      }}
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
                  <div className='col-span-2 border text-base text-blue-900 border-blue-500 bg-blue-50 rounded-md p-4'>
                    <div className='grid grid-rows-3 grid-flow-col gap-x-4 h-full'>
                      <div className='flex flex-col'>
                        <div className='font-bold mb-2'>Precio:</div>
                        <div className='flex items-center'>
                          {currentServicio && (
                            <span className='mr-1'>S/. </span>
                          )}
                          {currentServicio && (
                            <span>{currentServicio.precio}</span>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <div className='font-bold mb-2'>Orden Médica:</div>
                        <div className='flex items-center'>
                          {currentServicio && (
                            <span
                              className={`text-xl ${
                                currentServicio.orden_medica
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {currentServicio.orden_medica ? '✅' : '❌'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <div className='font-bold mb-2'>Triaje:</div>
                        <div className='flex items-center'>
                          {currentServicio && (
                            <span
                              className={`text-xl ${
                                currentServicio.triaje
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {currentServicio.triaje ? '✅' : '❌'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='primary' onPress={handleAddServices} isDisabled={isButtonDisabled}>
                  Agregar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
