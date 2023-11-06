import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from '@nextui-org/react'
import React, { useState } from 'react'
import { searchPersonByNumDocPersonalMedico } from '../../../services/person'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { createPersonalMedico } from '../../../services/especialidad'
import { BASE_URL_WS } from '../../../config'
import { updatePersonalMedico } from '../../../services/personalMedico'

export default function PersonalMedicoModal({
  isOpen,
  onOpenChange,
  dataToEdit,
  dataEspecialidad,
  refresh
}) {
  const [loading, setLoading] = useState(false)
  const [person, setPerson] = useState(null)
  const [firma, setFirma] = useState(() => {
    if (!dataToEdit) return null
    return dataToEdit?.firma_url ? dataToEdit?.firma_url : null
  })
  const [especialidad, setEspecialidad] = useState(() => {
    if (!dataToEdit) return new Set()
    return new Set(
      dataToEdit.especialidades.filter(el => el.estado === 1).map((esp) => String(esp.idespecialidad))
    )
  })
  const handleReset = () => {
    setFirma(null)
    setPerson(null)
    setEspecialidad(new Set())
  }

  const handleAddPerson = async (e, onClose) => {
    e.preventDefault()
    const formData = new FormData()
    if (!dataToEdit) {
      if (person?.idpersona && Array.from(especialidad).length === 0) {
        return toast.error('Falta llenar campos')
      }
      formData.append('idpersonalmedico', person.idpersona)
      formData.append('idespecialidad', Array.from(especialidad))
      formData.append('firmaUrl', firma)
      try {
        await createPersonalMedico(formData)
        refresh()
        toast.success('Personal Médico registrado con éxito')
        handleReset()
        onClose()
      } catch {
        toast.error('Error al registrar Personal Médico')
        onClose()      
      
      }
    } else {
      const oldEspecialidades = dataToEdit.especialidades.map((el) =>
        String(el.iddetespecialidad)
      )

      const newEspecialidades = Array.from(especialidad).map((el) => ({
        idespecialidad: el,
        estado: 1
      }))

      const especialidadesToSend = []

      newEspecialidades.forEach((el) => {
        const isOldEspecialdad = oldEspecialidades.includes(el.idespecialidad)
        if (!isOldEspecialdad) {
          especialidadesToSend.push({
            ...el,
            op: 'new'
          })
        }
      })

      oldEspecialidades.forEach((esp) => {
        const isNewEspecialidad = newEspecialidades
          .map((el) => el.idespecialidad)
          .includes(esp)
        if (!isNewEspecialidad) {
          especialidadesToSend.push({
            idespecialidad: esp,
            estado: 0,
            op: 'edit'
          })
        }
      })

      formData.append('idpersonalmedico', dataToEdit.idpersona)
      formData.append('idespecialidad', JSON.stringify(especialidadesToSend))
      const firmaFile = !firma || typeof firma === 'string' ? null : firma
      formData.append('firmaUrl', firmaFile)
      try {
        await updatePersonalMedico(dataToEdit.idpersonal,formData)
        refresh()
        toast.success('Personal Médico registrado con éxito')
        handleReset()
        onClose()
      } catch {
        toast.error('Error al actualizar Personal Médico')
        onClose()      
      }
    }
  }

  const handleSearchPerson = async (e) => {
    if (e.key !== 'Enter') return

    const docNumber = e.target.value
    if (!docNumber || docNumber.length < 8) return

    const result = await searchPersonByNumDocPersonalMedico(docNumber)
    if (!result.data) {
      setPerson(null)
      toast.error('No se encontró a la persona')
      return
    }

    if (result.data.idpersonalmedico) {
      setPerson(null)
      toast.error('Esta persona ya esta registrado')
      return
    }
    setPerson(result.data)
  }

  const personName = dataToEdit
    ? dataToEdit.personal
    : person?.nombres
    ? `${person?.nombres} ${person?.apellidos}`
    : ''

  const isDisabled = !person?.idpersona && Array.from(especialidad).length === 0

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <form
            autoComplete='off'
            onSubmit={(e) => handleAddPerson(e, onClose)}
          >
            <ModalHeader className='flex flex-col gap-1'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl'>
                  <span>
                    {!dataToEdit ? 'Registrar' : 'Editar'} Personal Médico
                  </span>
                </h2>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-y-2'>
                <Input
                  isDisabled={Boolean(dataToEdit)}
                  className='mb-2'
                  label='Num Documento'
                  defaultValue={dataToEdit ? dataToEdit.nombres : ''}
                  endContent={<Search />}
                  isRequired
                  onKeyDown={handleSearchPerson}
                />
                <Input
                  isReadOnly
                  className='mb-2'
                  label='Nombre Doctor'
                  value={personName}
                  name='personal medico'
                  isRequired
                />
              </div>
              <Divider />
              <div className='flex flex-col gap-y-4'>
                <Select
                  label='Especialidad'
                  name='Especialidad'
                  isRequired
                  selectionMode='multiple'
                  defaultSelectedKeys={especialidad}
                  onSelectionChange={setEspecialidad}
                  value={especialidad}
                >
                  {dataEspecialidad.map((esp) => (
                    <SelectItem
                      value={esp.idespecialidad}
                      key={esp.idespecialidad}
                    >
                      {esp.nombre_especialidad}
                    </SelectItem>
                  ))}
                </Select>
                <div className='w-full'>
                  <label className='flex justify-center w-full h-44 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none'>
                    {!firma ? (
                      <>
                        <span className='flex items-center space-x-2'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-6 h-6 text-gray-600'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth='2'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                            />
                          </svg>
                          <span className='font-medium text-gray-600'>
                            Subir Firma(opcional)
                          </span>{' '}
                        </span>
                      </>
                    ) : (
                      <img
                        className='w-full h-full object-contain'
                        src={
                          typeof firma === 'string'
                            ? `${BASE_URL_WS}/${firma}`
                            : URL.createObjectURL(firma)
                        }
                      />
                    )}
                    <input
                      accept='image/*'
                      type='file'
                      name='file_upload'
                      className='hidden'
                      onChange={(e) => {
                        if (e.target.files[0].type.includes('image')) {
                          setFirma(e.target.files[0])
                        } else {
                          toast.error('solo se permiten imagenes')
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color='danger'
                type='button'
                variant='light'
                onPress={onClose}
              >
                Cerrar
              </Button>
              <Button
                color='primary'
                type='submit'
                isLoading={loading}
                isDisabled={isDisabled}
              >
                {dataToEdit ? 'Actualizar' : 'Registrar'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
